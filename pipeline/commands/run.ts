import { loadContext } from '../lib/context'
import { readInbox, findQueueEntry } from '../lib/inbox'
import {
  generateSnapshot,
  generateArtifact,
  generateComparison,
  evaluateBranch,
} from '../lib/generate'
import {
  writeEvent,
  writeSnapshot,
  writeArtifact,
  writeComparisonArtifact,
  writeDecision,
  updateBranchFile,
  createBranchFile,
} from '../lib/files'
import { stageRuns, commit, push, hasChanges } from '../lib/git'
import type { GeneratedSnapshot, GeneratedEvent, GeneratedArtifact, BranchMeta } from '../lib/types'

const REPO_ROOT = new URL('../../', import.meta.url).pathname.replace(/\/$/, '')

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function log(msg: string): void {
  console.log(`[pipeline] ${new Date().toISOString().slice(11, 19)} ${msg}`)
}

export async function runCommand(args: string[]): Promise<void> {
  const targetDate = args[0] ?? yesterday()

  log(`starting — target date ${targetDate}`)

  const ctx = loadContext(REPO_ROOT, targetDate)
  if (!ctx) {
    log('ERROR: no active run found')
    process.exit(1)
  }

  log(`run: ${ctx.rootId}  branches: ${ctx.branches.map(b => b.urlId).join(', ')}`)

  // Load inbox entry for this date
  const inbox = readInbox(ctx.rootDir, targetDate)
    ?? findQueueEntry(ctx.rootDir, targetDate)
    ?? { schema_version: '0.1' as const, date: targetDate }

  const effectiveIntent = inbox.author_intent ?? ctx.recentAuthorIntent
  if (effectiveIntent) log(`author intent: "${effectiveIntent}"`)
  if (inbox.event_hint) log(`event hint: "${inbox.event_hint}"`)

  // Track output per branch for commit message and comparison generation
  const daySummaries: string[] = []
  const branchResults = new Map<string, {
    branch: BranchMeta
    storyDay: number
    snapshot: GeneratedSnapshot
    artifact: GeneratedArtifact
    snapshotId: string
  }>()

  // main branch must go first so alts can contrast against it
  let mainEvent: GeneratedEvent | null = null
  let mainSnapshot: GeneratedSnapshot | null = null

  for (const branch of ctx.branches) {
    const storyDay = branch.publishedDays + 1
    log(`generating branch: ${branch.urlId} → day ${storyDay}`)

    // Generate event + snapshot
    const { event, snapshot } = await generateSnapshot(
      inbox,
      ctx,
      branch,
      branch.urlId !== 'main' ? mainSnapshot ?? undefined : undefined,
    )

    if (branch.urlId === 'main') {
      mainEvent = event
      mainSnapshot = snapshot
    }

    // Generate narrative artifact
    const artifact = await generateArtifact(event, snapshot, ctx, branch, inbox)

    // Evaluate branching (only on main branch)
    let decisionId: string | null = null
    if (branch.urlId === 'main') {
      const evaluation = await evaluateBranch(snapshot, ctx, inbox, ctx.branches.length, storyDay)
      decisionId = writeDecision(ctx, targetDate, evaluation, `evt_${targetDate}_001`)

      if (evaluation.should_branch) {
        log(`branching: ${evaluation.suggested_name} (confidence ${evaluation.confidence.toFixed(2)})`)
        createBranchFile(ctx, branch, evaluation, snapshot, storyDay, targetDate)
      } else {
        log(`no branch (${evaluation.reason})`)
      }
    }

    // Write files
    const eventId = writeEvent(ctx, targetDate, storyDay, event)
    const snapshotId = writeSnapshot(ctx, targetDate, storyDay, branch, snapshot, eventId, decisionId)
    writeArtifact(ctx, targetDate, branch, artifact, snapshotId)

    // Update branch file
    updateBranchFile(ctx, branch, snapshot, storyDay)

    branchResults.set(branch.urlId, { branch, storyDay, snapshot, artifact, snapshotId })
    daySummaries.push(`${branch.urlId} day ${storyDay}: ${artifact.summary}`)
    log(`done: ${branch.urlId} — "${artifact.title}"`)
  }

  // Generate comparison artifacts for each branch pair (main vs each alt)
  const mainResult = branchResults.get('main')
  if (mainResult) {
    for (const [urlId, altResult] of branchResults) {
      if (urlId === 'main') continue
      log(`generating comparison: main vs ${urlId}`)
      const comparison = await generateComparison(
        mainResult.branch, altResult.branch,
        mainResult.artifact, altResult.artifact,
        mainResult.snapshot, altResult.snapshot,
        ctx,
      )
      writeComparisonArtifact(
        ctx, targetDate, mainResult.storyDay,
        mainResult.branch, altResult.branch,
        comparison,
        [mainResult.snapshotId, altResult.snapshotId],
      )
      log(`comparison written: main vs ${urlId}`)
    }
  }

  // Commit and push
  if (!hasChanges(REPO_ROOT)) {
    log('no changes to commit — already up to date')
    return
  }

  stageRuns(REPO_ROOT)
  const commitMsg = [
    `nightly: ${targetDate} — ${ctx.branches.map(b => `day ${b.publishedDays + 1}`)[0]}`,
    '',
    ...daySummaries,
    '',
    'Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>',
  ].join('\n')

  commit(REPO_ROOT, commitMsg)
  log('committed')

  push(REPO_ROOT)
  log('pushed — GitHub Actions deploy triggered')
}
