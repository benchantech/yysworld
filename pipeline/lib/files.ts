import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { createHash } from 'crypto'
import type {
  RunContext,
  BranchMeta,
  GeneratedEvent,
  GeneratedSnapshot,
  GeneratedArtifact,
  BranchEvaluation,
} from './types'

const SCHEMA_VERSION = '0.1'
const PACKAGE_ID = 'yysworld-pipeline-v0.1'
const MODEL_ID = 'claude-sonnet-4-6'
const PIPELINE_VERSION = '0.1'

function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

function writeJson(path: string, data: object): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
}

function nextEventNumber(eventsDir: string): string {
  if (!existsSync(eventsDir)) return '001'
  const existing = readdirSync(eventsDir).filter(f => f.endsWith('.json'))
  return String(existing.length + 1).padStart(3, '0')
}

function packageRef(date: string): object {
  const hash = createHash('sha256')
    .update(`${PACKAGE_ID}:${PIPELINE_VERSION}:${date}`)
    .digest('hex')
  return {
    package_id: PACKAGE_ID,
    package_created_at: new Date().toISOString(),
    package_hash: `sha256:${hash}`,
  }
}

function modelRef(role: string): object {
  return {
    provider: 'anthropic',
    model_id: MODEL_ID,
    model_version: new Date().toISOString().slice(0, 10),
    role,
    runtime_class: 'cloud',
    parameters: {
      temperature: null,
      top_p: null,
      max_tokens: 2000,
      seed: null,
    },
  }
}

// ─── Write event file ─────────────────────────────────────────────────────────

export function writeEvent(
  ctx: RunContext,
  date: string,
  storyDay: number,
  event: GeneratedEvent,
): string {
  const eventsDir = join(ctx.rootDir, 'events')
  ensureDir(eventsDir)
  const num = nextEventNumber(eventsDir)
  const eventId = `evt_${date}_${num}`

  writeJson(join(eventsDir, `${eventId}.json`), {
    schema_version: SCHEMA_VERSION,
    event_id: eventId,
    root_id: ctx.rootId,
    story_day: storyDay,
    occurred_at: `${date}T12:00:00Z`,
    event_type: event.event_type,
    canonical_truth: event.canonical_truth,
    perception_prompt: event.perception_prompt,
    tags: event.tags,
    created_at: new Date().toISOString(),
    authorial_note: event.authorial_note,
  })

  return eventId
}

// ─── Write snapshot file ──────────────────────────────────────────────────────

export function writeSnapshot(
  ctx: RunContext,
  date: string,
  storyDay: number,
  branch: BranchMeta,
  snapshot: GeneratedSnapshot,
  eventId: string,
  decisionId: string | null,
): string {
  const snapshotsDir = join(ctx.rootDir, 'snapshots')
  ensureDir(snapshotsDir)
  const snapshotId = `snap_${date}_${branch.branchId}`

  writeJson(join(snapshotsDir, `${snapshotId}.json`), {
    schema_version: SCHEMA_VERSION,
    snapshot_id: snapshotId,
    root_id: ctx.rootId,
    branch_id: branch.branchId,
    story_day: storyDay,
    snapshot_date: date,
    time_policy: 'nightly_auto_advance',
    package_ref: packageRef(date),
    model_refs: [modelRef('generator')],
    event_refs: [eventId],
    decision_refs: decisionId ? [decisionId] : [],
    state_before: snapshot.state_before,
    state_after: snapshot.state_after,
    change_summary: snapshot.change_summary,
    created_at: new Date().toISOString(),
  })

  return snapshotId
}

// ─── Write artifact file ──────────────────────────────────────────────────────

export function writeArtifact(
  ctx: RunContext,
  date: string,
  branch: BranchMeta,
  artifact: GeneratedArtifact,
  snapshotId: string,
): string {
  const artifactsDir = join(ctx.rootDir, 'artifacts')
  ensureDir(artifactsDir)
  const artifactId = `art_${date}_${branch.branchId}_summary`

  writeJson(join(artifactsDir, `${artifactId}.json`), {
    schema_version: SCHEMA_VERSION,
    artifact_id: artifactId,
    artifact_type: 'daily_summary',
    snapshot_id: snapshotId,
    root_id: ctx.rootId,
    branch_id: branch.branchId,
    package_ref: packageRef(date),
    model_refs: [modelRef('summarizer')],
    comparison_contract_version: SCHEMA_VERSION,
    content: {
      title: artifact.title,
      tone: artifact.tone,
      narrative: artifact.narrative,
      state_note: artifact.state_note,
      summary: artifact.summary,
      state_delta: artifact.state_delta,
      branch_created: false,
    },
    created_at: new Date().toISOString(),
  })

  return artifactId
}

// ─── Write decision file ──────────────────────────────────────────────────────

export function writeDecision(
  ctx: RunContext,
  date: string,
  evaluation: BranchEvaluation,
  sourceEventId: string,
): string {
  const decisionsDir = join(ctx.rootDir, 'decisions')
  ensureDir(decisionsDir)
  const existing = existsSync(decisionsDir) ? readdirSync(decisionsDir).length : 0
  const num = String(existing + 1).padStart(3, '0')
  const decisionId = `dec_${date}_${num}`

  writeJson(join(decisionsDir, `${decisionId}.json`), {
    schema_version: SCHEMA_VERSION,
    decision_id: decisionId,
    root_id: ctx.rootId,
    source_event_id: sourceEventId,
    signaled_by: { actor_id: 'pipeline', actor_role: 'evaluator' },
    signaled_at: new Date().toISOString(),
    decision_type: 'create_branch',
    reason: {
      core_statement: evaluation.reason,
      branching_focus: evaluation.branching_focus,
      confidence: evaluation.confidence,
    },
    proposed_mutation: {
      mutation_id: `mut_${date}_${num}`,
      mutation_type: 'branch_divergence',
      branch_id: evaluation.suggested_name,
      summary: evaluation.reason,
    },
    decision_status: evaluation.should_branch ? 'executed' : 'evaluated_no_branch',
    created_at: new Date().toISOString(),
  })

  return decisionId
}

// ─── Update branch file ───────────────────────────────────────────────────────

export function updateBranchFile(
  ctx: RunContext,
  branch: BranchMeta,
  snapshot: GeneratedSnapshot,
  storyDay: number,
): void {
  const branchPath = join(ctx.rootDir, 'branches', `${branch.branchId}.json`)
  const existing = JSON.parse(readFileSync(branchPath, 'utf-8'))

  writeJson(branchPath, {
    ...existing,
    state: {
      ...snapshot.state_after,
      story_day: storyDay,
    },
    last_updated_at: new Date().toISOString(),
  })
}

// ─── Create new branch file ───────────────────────────────────────────────────

export function createBranchFile(
  ctx: RunContext,
  parentBranch: BranchMeta,
  evaluation: BranchEvaluation,
  snapshot: GeneratedSnapshot,
  storyDay: number,
  date: string,
): string {
  const altCount = ctx.branches.filter(b => b.urlId !== 'main').length + 1
  const newBranchId = `branch_${ctx.rootId}_alt${altCount}-${evaluation.suggested_name.replace(/^alt\d+-/, '')}`
  const branchPath = join(ctx.rootDir, 'branches', `${newBranchId}.json`)

  writeJson(branchPath, {
    schema_version: SCHEMA_VERSION,
    branch_id: newBranchId,
    root_id: ctx.rootId,
    parent_branch_id: parentBranch.branchId,
    character_id: 'yy',
    created_at: new Date().toISOString(),
    status: 'active',
    state: {
      ...snapshot.state_after,
      story_day: storyDay,
      identity_notes: [
        ...snapshot.state_after.identity_notes,
        `branched from ${parentBranch.urlId} on day ${storyDay}: ${evaluation.branching_focus}`,
      ],
    },
    drift_flags: [],
    last_updated_at: new Date().toISOString(),
  })

  return newBranchId
}
