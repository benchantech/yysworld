// ─── Inbox / Queue ────────────────────────────────────────────────────────────

export interface InboxEntry {
  schema_version: '0.1'
  date: string                                        // "2026-04-15"
  event_hint?: string                                 // "tax day" — one sentence
  notes?: string                                      // day-level tone/intent
  author_intent?: string                              // multi-day arc direction
  branch_context?: Record<string, string>             // branchId → guidance
  branch_decision?: 'approve' | 'deny' | 'suggest' | null
  is_default?: boolean                                // placeholder, overridable
}

// ─── Context passed to generators ────────────────────────────────────────────

export interface Baseline {
  character_id: string
  core_traits: Record<string, number>
  values: string[]
  failure_boundaries: string[]
  default_reactions: Record<string, string>
  identity_rules: Record<string, string>
}

export interface BranchState {
  story_day: number
  condition: { health: number; hunger: number; attention: number }
  inventory: string[]
  active_burdens: string[]
  goals: { primary: string; secondary: string }
  reaction_overrides: Record<string, string>
  trait_deviations: Record<string, number>
  identity_notes: string[]
}

export interface BranchMeta {
  branchId: string          // "branch_root_2026_04_14_main"
  urlId: string             // "main", "alt1-on-time"
  parentBranchId: string | null
  publishedDays: number
  currentState: BranchState
}

export interface DayRecord {
  date: string
  storyDay: number
  // Snapshot state_after per branch (for continuity context)
  stateAfter: Record<string, BranchState>
  // Artifact summaries per branch (for style/tone context)
  summaries: Record<string, string>
  narrativeSnippets: Record<string, string>  // first ~200 chars of narrative
}

export interface RunContext {
  rootId: string
  runDate: string
  runsDir: string
  rootDir: string
  baseline: Baseline
  branches: BranchMeta[]
  recentDays: DayRecord[]       // last 7 published days, oldest first
  recentAuthorIntent: string | null
}

// ─── Generated output types ───────────────────────────────────────────────────

export interface GeneratedEvent {
  event_type: string
  canonical_truth: {
    summary: string
    entities: string[]
    location: string
    concrete_outcome: string
  }
  perception_prompt: {
    noticeable_surface: string
    ambiguity_level: number
  }
  tags: string[]
  authorial_note: {
    real_world_inspiration: string
    translation_logic: string
    restraint_reason: string
  }
}

export interface GeneratedStateAfter {
  condition: { health: number; hunger: number; attention: number }
  inventory: string[]
  active_burdens: string[]
  goals: { primary: string; secondary: string }
  reaction_overrides: Record<string, string>
  trait_deviations: Record<string, number>
  identity_notes: string[]
}

export interface GeneratedSnapshot {
  state_before: BranchState
  state_after: GeneratedStateAfter
  change_summary: {
    notable_shift: string
    branch_created: boolean
  }
}

export interface GeneratedArtifact {
  title: string
  tone: string
  narrative: string
  state_note: string
  summary: string
  state_delta: Record<string, string>
}

export interface BranchEvaluation {
  should_branch: boolean
  confidence: number            // 0–1
  suggested_name: string        // "alt{N}-{descriptor}" — empty if no branch
  reason: string
  branching_focus: string
}

export interface InitSuggestions {
  event_hint: string
  notes: string
  branch_suggestions: Record<string, string>
  branch_decision_suggestion: 'approve' | 'deny' | 'suggest' | null
  branch_decision_reason: string
}
