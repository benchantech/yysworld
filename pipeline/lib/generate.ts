import Anthropic from '@anthropic-ai/sdk'
import type {
  RunContext,
  BranchMeta,
  InboxEntry,
  GeneratedEvent,
  GeneratedSnapshot,
  GeneratedArtifact,
  BranchEvaluation,
  InitSuggestions,
} from './types'

const client = new Anthropic()
const MODEL = 'claude-sonnet-4-6'

// ─── Shared system prompt ─────────────────────────────────────────────────────

function systemPrompt(ctx: RunContext): string {
  const { baseline } = ctx
  const traits = Object.entries(baseline.core_traits)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join('\n')

  return `You are the nightly pipeline for YY's branching world story.

YY is a fictional character. Never break this character.

TRAITS (0–1 scale):
${traits}

VALUES: ${baseline.values.join(', ')}

FAILURE BOUNDARIES — never cross these:
${baseline.failure_boundaries.join(', ')}

DEFAULT REACTIONS:
${Object.entries(baseline.default_reactions).map(([k, v]) => `  ${k} → ${v}`).join('\n')}

IDENTITY RULES:
- ${baseline.identity_rules.conservation_rule}
- ${baseline.identity_rules.out_of_character_rule}

NARRATIVE STYLE:
- Short paragraphs. Direct sentences.
- Third person — "YY", not "I".
- Concrete sensory details. What YY sees, hears, feels, notices.
- Emotional honesty without melodrama.
- When YY speaks, keep it brief and in character.
- Restraint is a feature. Don't over-explain.
- Match the compression style of prior days.`.trim()
}

function recentHistoryBlock(ctx: RunContext): string {
  if (ctx.recentDays.length === 0) return 'No prior days yet — this is Day 1.'

  return ctx.recentDays.map(d => {
    const summaries = Object.entries(d.summaries)
      .map(([b, s]) => `  ${b}: ${s}`)
      .join('\n')
    return `Day ${d.storyDay} (${d.date}):\n${summaries || '  (no summary)'}`
  }).join('\n\n')
}

function branchStateBlock(branch: BranchMeta): string {
  const s = branch.currentState
  return JSON.stringify({
    hunger: s.condition.hunger,
    attention: s.condition.attention,
    health: s.condition.health,
    active_burdens: s.active_burdens,
    trait_deviations: s.trait_deviations,
    identity_notes: s.identity_notes,
  }, null, 2)
}

// ─── Tool: generate event + snapshot ─────────────────────────────────────────

const snapshotTool: Anthropic.Tool = {
  name: 'write_snapshot',
  description: 'Write the canonical event and state snapshot for this story day.',
  input_schema: {
    type: 'object' as const,
    required: ['event', 'state_after', 'change_summary'],
    properties: {
      event: {
        type: 'object' as const,
        required: ['event_type', 'canonical_truth', 'perception_prompt', 'tags', 'authorial_note'],
        properties: {
          event_type: { type: 'string' as const },
          canonical_truth: {
            type: 'object' as const,
            required: ['summary', 'entities', 'location', 'concrete_outcome'],
            properties: {
              summary: { type: 'string' as const },
              entities: { type: 'array' as const, items: { type: 'string' as const } },
              location: { type: 'string' as const },
              concrete_outcome: { type: 'string' as const },
            },
          },
          perception_prompt: {
            type: 'object' as const,
            required: ['noticeable_surface', 'ambiguity_level'],
            properties: {
              noticeable_surface: { type: 'string' as const },
              ambiguity_level: { type: 'number' as const, minimum: 0, maximum: 1 },
            },
          },
          tags: { type: 'array' as const, items: { type: 'string' as const } },
          authorial_note: {
            type: 'object' as const,
            required: ['real_world_inspiration', 'translation_logic', 'restraint_reason'],
            properties: {
              real_world_inspiration: { type: 'string' as const },
              translation_logic: { type: 'string' as const },
              restraint_reason: { type: 'string' as const },
            },
          },
        },
      },
      state_after: {
        type: 'object' as const,
        required: ['condition', 'inventory', 'active_burdens', 'goals', 'reaction_overrides', 'trait_deviations', 'identity_notes'],
        properties: {
          condition: {
            type: 'object' as const,
            properties: {
              health: { type: 'number' as const },
              hunger: { type: 'number' as const },
              attention: { type: 'number' as const },
            },
          },
          inventory: { type: 'array' as const, items: { type: 'string' as const } },
          active_burdens: { type: 'array' as const, items: { type: 'string' as const } },
          goals: {
            type: 'object' as const,
            properties: {
              primary: { type: 'string' as const },
              secondary: { type: 'string' as const },
            },
          },
          reaction_overrides: { type: 'object' as const },
          trait_deviations: { type: 'object' as const },
          identity_notes: { type: 'array' as const, items: { type: 'string' as const } },
        },
      },
      change_summary: {
        type: 'object' as const,
        required: ['notable_shift', 'branch_created'],
        properties: {
          notable_shift: { type: 'string' as const },
          branch_created: { type: 'boolean' as const },
        },
      },
    },
  },
}

export async function generateSnapshot(
  inbox: InboxEntry,
  ctx: RunContext,
  branch: BranchMeta,
  mainSnapshot?: GeneratedSnapshot,  // for alt branches — contrast context
): Promise<{ event: GeneratedEvent; snapshot: GeneratedSnapshot }> {
  const storyDay = branch.publishedDays + 1
  const isMain = branch.urlId === 'main'
  const branchGuidance = inbox.branch_context?.[branch.urlId] ?? ''
  const authorIntent = inbox.author_intent ?? ctx.recentAuthorIntent ?? ''

  const contrastNote = !isMain && mainSnapshot
    ? `\nFor contrast: on the main branch (where YY's morning started badly), today played out as: "${mainSnapshot.change_summary.notable_shift}". The alt branch should feel meaningfully different — same world, different inner state.`
    : ''

  const messages: Anthropic.MessageParam[] = [{
    role: 'user',
    content: `Generate Day ${storyDay} for the **${branch.urlId}** branch.

WORLD EVENT ANCHOR: ${inbox.event_hint ?? '(none — use seasonal/contextual reasoning)'}
DATE: ${new Date().toISOString().slice(0, 10)} (real-world date)

BRANCH STARTING STATE:
${branchStateBlock(branch)}

${isMain ? '' : `BRANCH PREMISE: ${branch.parentBranchId ? `This branch diverged from main. YY's circumstances differ: ${branch.currentState.identity_notes.join('; ')}` : ''}`}
${contrastNote}

AUTHOR INTENT (arc direction): ${authorIntent || '(none — use your judgment)'}
AUTHOR GUIDANCE (this branch today): ${branchGuidance || '(none — use your judgment)'}
AUTHOR NOTES (day-level): ${inbox.notes || '(none)'}

RECENT HISTORY:
${recentHistoryBlock(ctx)}

Generate the canonical event abstraction and resulting state snapshot.
Follow author guidance closely. Respect all failure boundaries.`,
  }]

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt(ctx),
    tools: [snapshotTool],
    tool_choice: { type: 'any' },
    messages,
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No tool use in snapshot response')
  const result = toolUse.input as { event: GeneratedEvent; state_after: GeneratedSnapshot['state_after']; change_summary: GeneratedSnapshot['change_summary'] }

  return {
    event: result.event,
    snapshot: {
      state_before: branch.currentState,
      state_after: result.state_after,
      change_summary: result.change_summary,
    },
  }
}

// ─── Tool: generate narrative artifact ───────────────────────────────────────

const artifactTool: Anthropic.Tool = {
  name: 'write_artifact',
  description: 'Write the narrative artifact for this story day.',
  input_schema: {
    type: 'object' as const,
    required: ['title', 'tone', 'narrative', 'state_note', 'summary'],
    properties: {
      title: { type: 'string' as const, description: 'Short evocative title. Does NOT repeat as first line of narrative.' },
      tone: { type: 'string' as const, description: 'One compound descriptor, e.g. "mildly_sour_but_moving"' },
      narrative: { type: 'string' as const, description: 'The story. Paragraphs separated by \\n\\n. Does NOT start with the title.' },
      state_note: { type: 'string' as const, description: 'One paragraph: what this day cost or gave YY, internally.' },
      summary: { type: 'string' as const, description: 'One sentence. Past tense. What happened and how it resolved.' },
    },
  },
}

export async function generateArtifact(
  event: GeneratedEvent,
  snapshot: GeneratedSnapshot,
  ctx: RunContext,
  branch: BranchMeta,
  inbox: InboxEntry,
): Promise<GeneratedArtifact> {
  const storyDay = branch.publishedDays + 1
  const branchGuidance = inbox.branch_context?.[branch.urlId] ?? ''

  // Pull a prior narrative snippet for style reference
  const priorSnippet = ctx.recentDays
    .flatMap(d => Object.entries(d.narrativeSnippets))
    .filter(([b]) => b === branch.urlId || b === 'main')
    .at(-1)?.[1] ?? ''

  const messages: Anthropic.MessageParam[] = [{
    role: 'user',
    content: `Write the Day ${storyDay} narrative artifact for the **${branch.urlId}** branch.

EVENT:
${JSON.stringify(event.canonical_truth, null, 2)}

PERCEPTION PROMPT: ${event.perception_prompt.noticeable_surface}

STATE CHANGE:
  hunger: ${snapshot.state_before.condition.hunger} → ${snapshot.state_after.condition.hunger}
  attention: ${snapshot.state_before.condition.attention} → ${snapshot.state_after.condition.attention}
  new burdens: ${snapshot.state_after.active_burdens.join(', ') || 'none'}
  identity: ${snapshot.state_after.identity_notes.join('; ')}

NOTABLE SHIFT: ${snapshot.change_summary.notable_shift}

AUTHOR GUIDANCE: ${branchGuidance || inbox.notes || '(none)'}

${priorSnippet ? `STYLE REFERENCE (prior day, for tone matching):\n"${priorSnippet}..."` : ''}

The title should be evocative but NOT repeated as the first line of the narrative.
The narrative should open in scene, not with the title.`,
  }]

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: systemPrompt(ctx),
    tools: [artifactTool],
    tool_choice: { type: 'any' },
    messages,
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No tool use in artifact response')
  const result = toolUse.input as GeneratedArtifact

  // Derive state_delta from snapshot
  const before = snapshot.state_before.condition
  const after = snapshot.state_after.condition
  result.state_delta = {
    hunger: `${before.hunger} → ${after.hunger}`,
    attention: `${before.attention} → ${after.attention}`,
    health: `${before.health} → ${after.health}`,
  }
  if (snapshot.state_after.active_burdens.length > 0) {
    result.state_delta.burdens_added = snapshot.state_after.active_burdens
      .filter(b => !snapshot.state_before.active_burdens.includes(b))
      .join(', ') || 'none'
  }

  return result
}

// ─── Tool: branch evaluation ──────────────────────────────────────────────────

const branchTool: Anthropic.Tool = {
  name: 'evaluate_branch',
  description: 'Evaluate whether today warrants a new branch.',
  input_schema: {
    type: 'object' as const,
    required: ['should_branch', 'confidence', 'suggested_name', 'reason', 'branching_focus'],
    properties: {
      should_branch: { type: 'boolean' as const },
      confidence: { type: 'number' as const, minimum: 0, maximum: 1 },
      suggested_name: { type: 'string' as const, description: 'alt{N}-{descriptor} format if branching, empty string if not' },
      reason: { type: 'string' as const },
      branching_focus: { type: 'string' as const },
    },
  },
}

export async function evaluateBranch(
  snapshot: GeneratedSnapshot,
  ctx: RunContext,
  inbox: InboxEntry,
  existingBranchCount: number,
): Promise<BranchEvaluation> {
  // Author override takes priority
  if (inbox.branch_decision === 'deny') {
    return { should_branch: false, confidence: 1, suggested_name: '', reason: 'author denied', branching_focus: '' }
  }
  if (inbox.branch_decision === 'approve') {
    // Still ask Claude for the name and reason
  }

  const nextAltN = existingBranchCount  // existing count includes main, so alt count = existing - 1 + 1

  const messages: Anthropic.MessageParam[] = [{
    role: 'user',
    content: `Evaluate whether today's events warrant a new branch.

NOTABLE SHIFT: ${snapshot.change_summary.notable_shift}
TRAIT DEVIATIONS: ${JSON.stringify(snapshot.state_after.trait_deviations)}
NEW BURDENS: ${snapshot.state_after.active_burdens.join(', ') || 'none'}
IDENTITY NOTES: ${snapshot.state_after.identity_notes.join('; ')}
AUTHOR SIGNAL: ${inbox.branch_decision === 'approve' ? 'APPROVE — author wants a branch, find the best name' : inbox.branch_decision === 'suggest' ? 'SUGGEST — author sees potential but defers to you' : 'none'}

A branch is warranted when something genuinely unexpected happened — a shift that diverges meaningfully from what YY would normally do. Small perturbations are not enough.

If branching: next ordinal is alt${nextAltN}. Suggest a short descriptor (1–2 words, hyphenated) that names the divergence.`,
  }]

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: systemPrompt(ctx),
    tools: [branchTool],
    tool_choice: { type: 'any' },
    messages,
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No tool use in branch response')
  return toolUse.input as BranchEvaluation
}

// ─── Init suggestions (pre-fetch for interactive init command) ────────────────

const initTool: Anthropic.Tool = {
  name: 'suggest_init_fields',
  description: 'Suggest values for the inbox fields for the given date.',
  input_schema: {
    type: 'object' as const,
    required: ['event_hint', 'notes', 'branch_suggestions', 'branch_decision_suggestion', 'branch_decision_reason'],
    properties: {
      event_hint: { type: 'string' as const, description: 'One sentence about what happened in the world this day' },
      notes: { type: 'string' as const, description: 'Suggested day-level tone/intent' },
      branch_suggestions: {
        type: 'object' as const,
        description: 'Per-branch narrative guidance suggestions',
        additionalProperties: { type: 'string' as const },
      },
      branch_decision_suggestion: {
        type: 'string' as const,
        enum: ['approve', 'deny', 'suggest', 'none'],
      },
      branch_decision_reason: { type: 'string' as const },
    },
  },
}

export async function suggestInitFields(
  targetDate: string,
  ctx: RunContext,
): Promise<InitSuggestions> {
  const branchList = ctx.branches.map(b => b.urlId).join(', ')

  const messages: Anthropic.MessageParam[] = [{
    role: 'user',
    content: `Suggest inbox fields for ${targetDate}.

Active branches: ${branchList}
Recent arc direction: ${ctx.recentAuthorIntent ?? '(none yet)'}

RECENT HISTORY:
${recentHistoryBlock(ctx)}

Suggest:
1. A real-world event that likely happened on ${targetDate} (use seasonal reasoning, known calendar events, or general cultural patterns if you don't have specific knowledge)
2. How it might translate to YY's world in tone
3. Per-branch narrative seeds for: ${branchList}
4. Whether a branch seems warranted based on trajectory

Keep all suggestions short — they're prompts for the author to accept or override.`,
  }]

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: systemPrompt(ctx),
    tools: [initTool],
    tool_choice: { type: 'any' },
    messages,
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') throw new Error('No tool use in init suggestions response')
  type RawSuggestions = Omit<InitSuggestions, 'branch_decision_suggestion'> & { branch_decision_suggestion: string }
  const raw = toolUse.input as RawSuggestions
  return {
    ...raw,
    branch_decision_suggestion: raw.branch_decision_suggestion === 'none'
      ? null
      : raw.branch_decision_suggestion as 'approve' | 'deny' | 'suggest',
  }
}
