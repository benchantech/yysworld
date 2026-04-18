/**
 * Tests for required schema fields across artifact, snapshot, and event types.
 *
 * DRIFT THIS PREVENTS:
 *   ADR-026: stat name 'hunger' crept in at launch (corrected to 'food').
 *   The valid condition keys are locked: health, food, attention.
 *   Any code that uses 'hunger' (StatsBlock, pipeline generators, test fixtures)
 *   is silently wrong until it hits the UI.
 *
 *   ADR-026: BranchEvaluation.confidence must be [0, 1].
 *   A value outside this range indicates the LLM produced an out-of-range score;
 *   accepting it silently means the branch decision logic is operating on garbage.
 *
 *   ADR-031: source_event is a required top-level field in every event file.
 *   headline + date are required; category must be from a controlled list.
 *   Without this, cross-branch drift detection and the real-world timeline view
 *   are impossible — the only source of truth devolves back to prose strings.
 *
 *   ADR-024: snapshot_date is the source of truth for releaseAt.
 *   The snapshot schema must include snapshot_date and story_day; without both,
 *   the publication gate is uncomputable and getDayParams silently drops days.
 */

import { describe, it, expect } from 'vitest'

// ─── ADR-026: condition stat names ───────────────────────────────────────────

/** The only valid keys in any condition object. Frozen from first artifact. */
const VALID_CONDITION_KEYS = new Set<string>(['health', 'food', 'attention'])

function hasOnlyValidConditionKeys(condition: Record<string, unknown>): boolean {
  return Object.keys(condition).every((k) => VALID_CONDITION_KEYS.has(k))
}

describe('condition stat names (ADR-026)', () => {
  it('accepts health + food + attention', () => {
    expect(hasOnlyValidConditionKeys({ health: 7, food: 5, attention: 6 })).toBe(true)
  })

  it('rejects hunger — the ADR-026 scar', () => {
    expect(hasOnlyValidConditionKeys({ health: 7, hunger: 5, attention: 6 })).toBe(false)
  })

  it('rejects energy as a condition key', () => {
    // energy is a trait deviation, not a condition stat
    expect(hasOnlyValidConditionKeys({ health: 7, food: 5, energy: 6 })).toBe(false)
  })

  it('rejects mood as a condition key', () => {
    // mood appears in trait_deviations but not condition
    expect(hasOnlyValidConditionKeys({ health: 7, food: 5, mood: 6 })).toBe(false)
  })

  it('accepts a partial condition (subset of valid keys)', () => {
    // partial reads happen during state reconstruction; valid subset is fine
    expect(hasOnlyValidConditionKeys({ food: 5 })).toBe(true)
  })

  it('rejects an empty key name', () => {
    expect(hasOnlyValidConditionKeys({ '': 5 })).toBe(false)
  })
})

// ─── ADR-026: BranchEvaluation confidence range ───────────────────────────────

function isValidConfidence(c: number): boolean {
  return c >= 0 && c <= 1
}

describe('BranchEvaluation.confidence range (ADR-026 / types.ts)', () => {
  it('accepts 0 (no confidence)', () => {
    expect(isValidConfidence(0)).toBe(true)
  })

  it('accepts 1 (full confidence)', () => {
    expect(isValidConfidence(1)).toBe(true)
  })

  it('accepts mid-range values', () => {
    expect(isValidConfidence(0.5)).toBe(true)
    expect(isValidConfidence(0.75)).toBe(true)
  })

  it('rejects values below 0', () => {
    expect(isValidConfidence(-0.1)).toBe(false)
  })

  it('rejects values above 1', () => {
    expect(isValidConfidence(1.1)).toBe(false)
    expect(isValidConfidence(2)).toBe(false)
  })
})

// ─── ADR-031: source_event required fields ────────────────────────────────────

const SOURCE_EVENT_CATEGORIES = new Set([
  'politics', 'civic', 'science', 'culture', 'sports', 'other',
])

interface SourceEvent {
  headline: string
  date: string
  category: string
  secondary?: string
}

function isValidSourceEvent(ev: unknown): ev is SourceEvent {
  if (typeof ev !== 'object' || ev === null) return false
  const e = ev as Record<string, unknown>
  if (typeof e.headline !== 'string' || e.headline.trim() === '') return false
  if (typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) return false
  if (typeof e.category !== 'string' || !SOURCE_EVENT_CATEGORIES.has(e.category)) return false
  if ('secondary' in e && e.secondary !== undefined && typeof e.secondary !== 'string') return false
  return true
}

describe('source_event schema (ADR-031)', () => {
  it('accepts a valid source_event', () => {
    expect(isValidSourceEvent({
      headline: 'Federal Reserve holds rates steady',
      date: '2026-04-17',
      category: 'politics',
    })).toBe(true)
  })

  it('accepts source_event with optional secondary', () => {
    expect(isValidSourceEvent({
      headline: 'Tax Day filing surge',
      date: '2026-04-15',
      category: 'civic',
      secondary: 'IRS processing delay reported',
    })).toBe(true)
  })

  it('rejects missing headline', () => {
    expect(isValidSourceEvent({ date: '2026-04-17', category: 'politics' })).toBe(false)
  })

  it('rejects empty headline', () => {
    expect(isValidSourceEvent({ headline: '  ', date: '2026-04-17', category: 'politics' })).toBe(false)
  })

  it('rejects missing date', () => {
    expect(isValidSourceEvent({ headline: 'Test event', category: 'sports' })).toBe(false)
  })

  it('rejects date in wrong format (non-ISO)', () => {
    expect(isValidSourceEvent({ headline: 'Test', date: 'April 17', category: 'other' })).toBe(false)
    expect(isValidSourceEvent({ headline: 'Test', date: '04/17/2026', category: 'other' })).toBe(false)
  })

  it('rejects invalid category', () => {
    expect(isValidSourceEvent({ headline: 'Test', date: '2026-04-17', category: 'weather' })).toBe(false)
    expect(isValidSourceEvent({ headline: 'Test', date: '2026-04-17', category: '' })).toBe(false)
  })

  it('accepts all controlled category values', () => {
    for (const cat of SOURCE_EVENT_CATEGORIES) {
      expect(isValidSourceEvent({ headline: 'x', date: '2026-04-17', category: cat })).toBe(true)
    }
  })
})

// ─── ADR-024: snapshot required fields for publication gate ───────────────────

/**
 * getDayArtifact and getStaticRuns both require story_day and snapshot_date
 * to be present on snapshot files. A snapshot missing either field silently
 * drops the day from static params, causing a 404 at build time.
 */
interface SnapshotRequired {
  story_day: number
  snapshot_date: string
  branch_id: string
}

function isValidSnapshotForGate(s: unknown): s is SnapshotRequired {
  if (typeof s !== 'object' || s === null) return false
  const snap = s as Record<string, unknown>
  if (typeof snap.story_day !== 'number' || snap.story_day < 1) return false
  if (typeof snap.snapshot_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(snap.snapshot_date)) return false
  if (typeof snap.branch_id !== 'string' || snap.branch_id.trim() === '') return false
  return true
}

describe('snapshot required fields for publication gate (ADR-024)', () => {
  it('accepts a valid snapshot', () => {
    expect(isValidSnapshotForGate({
      story_day: 4,
      snapshot_date: '2026-04-17',
      branch_id: 'branch_root_2026_04_14_main',
    })).toBe(true)
  })

  it('rejects snapshot with story_day = 0', () => {
    // day/0 stub is a framework accommodation, not a real artifact
    expect(isValidSnapshotForGate({
      story_day: 0,
      snapshot_date: '2026-04-14',
      branch_id: 'branch_root_2026_04_14_main',
    })).toBe(false)
  })

  it('rejects snapshot missing snapshot_date', () => {
    expect(isValidSnapshotForGate({
      story_day: 1,
      branch_id: 'branch_root_2026_04_14_main',
    })).toBe(false)
  })

  it('rejects snapshot with non-ISO snapshot_date', () => {
    expect(isValidSnapshotForGate({
      story_day: 1,
      snapshot_date: 'April 14',
      branch_id: 'branch_root_2026_04_14_main',
    })).toBe(false)
  })

  it('rejects snapshot missing branch_id', () => {
    expect(isValidSnapshotForGate({
      story_day: 1,
      snapshot_date: '2026-04-14',
    })).toBe(false)
  })
})

// ─── schema_version consistency ───────────────────────────────────────────────

/**
 * All pipeline files use schema_version: '0.1' (the SCHEMA_VERSION constant in files.ts).
 * A drift to numeric 0.1 or a missing field means the file was written outside the pipeline.
 */
function hasValidSchemaVersion(file: unknown): boolean {
  if (typeof file !== 'object' || file === null) return false
  return (file as Record<string, unknown>).schema_version === '0.1'
}

describe('schema_version field', () => {
  it('accepts string "0.1"', () => {
    expect(hasValidSchemaVersion({ schema_version: '0.1', other: 'data' })).toBe(true)
  })

  it('rejects numeric 0.1 (must be string)', () => {
    expect(hasValidSchemaVersion({ schema_version: 0.1 })).toBe(false)
  })

  it('rejects missing schema_version', () => {
    expect(hasValidSchemaVersion({ story_day: 1 })).toBe(false)
  })

  it('rejects a future version string', () => {
    // Any version other than current is unexpected — fail-fast until versioning is explicit
    expect(hasValidSchemaVersion({ schema_version: '0.2' })).toBe(false)
  })
})
