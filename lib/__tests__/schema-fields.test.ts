/**
 * Tests for required schema fields across artifact, snapshot, and event types.
 *
 * DRIFT THIS PREVENTS:
 *   ADR-033: health was omitted from state shift proposals and state_delta in
 *   artifacts. The existing hasOnlyValidConditionKeys test caught invalid keys
 *   but not missing required ones — {food, attention} passed while health was
 *   silently absent. Over time this degrades health into a decorative field
 *   that only moves on dramatic events.
 *
 *   ADR-033: state_delta in artifact content must contain all three stats.
 *   A delta missing health means the published day page shows an incomplete
 *   change record and the author cannot verify that health was tracked.
 *
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

// ─── ADR-031 retired 2026-04-19 ──────────────────────────────────────────────
// source_event field was planned but never implemented in real event files.
// Test removed alongside ADR retirement. See ADR-031 retirement note.

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

// ─── ADR-033: condition completeness (all three stats required) ───────────────

/**
 * The existing hasOnlyValidConditionKeys check prevents invalid keys (e.g. 'hunger').
 * This check prevents the complementary failure: a condition that omits a required
 * stat entirely. {food, attention} passing while health is absent was the ADR-033
 * failure — health was silently skipped because the shift proposal template did not
 * list it as required.
 *
 * All three stats must be present in every condition object that represents a full
 * state (state_before, state_after). Partial reads during reconstruction are exempt
 * but should not appear in committed snapshot or artifact files.
 */
const REQUIRED_CONDITION_KEYS = ['health', 'food', 'attention'] as const

function hasAllRequiredConditionKeys(condition: Record<string, unknown>): boolean {
  return REQUIRED_CONDITION_KEYS.every((k) => k in condition)
}

describe('condition completeness — all three stats required (ADR-033)', () => {
  it('accepts a complete condition', () => {
    expect(hasAllRequiredConditionKeys({ health: 0.9, food: 0.4, attention: 0.5 })).toBe(true)
  })

  it('rejects a condition missing health — the ADR-033 scar', () => {
    expect(hasAllRequiredConditionKeys({ food: 0.4, attention: 0.5 })).toBe(false)
  })

  it('rejects a condition missing food', () => {
    expect(hasAllRequiredConditionKeys({ health: 0.9, attention: 0.5 })).toBe(false)
  })

  it('rejects a condition missing attention', () => {
    expect(hasAllRequiredConditionKeys({ health: 0.9, food: 0.4 })).toBe(false)
  })

  it('rejects an empty condition', () => {
    expect(hasAllRequiredConditionKeys({})).toBe(false)
  })

  it('accepts a condition with extra keys as long as required ones are present', () => {
    // Extra keys are caught by hasOnlyValidConditionKeys — this check is orthogonal
    expect(hasAllRequiredConditionKeys({ health: 0.9, food: 0.4, attention: 0.5, hunger: 0.3 })).toBe(true)
  })
})

// ─── ADR-033: state_delta completeness in artifact content ────────────────────

/**
 * Artifact content.state_delta must contain all three stat keys, each as a
 * string in "X.XX → X.XX" format. A missing health delta means the published
 * day page shows an incomplete change record — the author cannot verify that
 * health was tracked, and the pipeline silently skipped it.
 *
 * Pattern: "0.40 → 0.33" or "0.9 → 0.82" — two decimal numbers separated by →
 * Allow flexible decimal places; the important thing is both numbers are present.
 */
const STAT_DELTA_PATTERN = /^\d+\.\d+\s*→\s*\d+\.\d+$/

function isValidStatDelta(delta: string): boolean {
  return STAT_DELTA_PATTERN.test(delta.trim())
}

function isCompleteStateDelta(delta: Record<string, unknown>): boolean {
  return REQUIRED_CONDITION_KEYS.every(
    (k) => typeof delta[k] === 'string' && isValidStatDelta(delta[k] as string),
  )
}

describe('state_delta format (ADR-033)', () => {
  it('accepts a well-formed delta string', () => {
    expect(isValidStatDelta('0.40 → 0.33')).toBe(true)
    expect(isValidStatDelta('0.9 → 0.82')).toBe(true)
    expect(isValidStatDelta('0.50 → 0.62')).toBe(true)
  })

  it('rejects a delta with only one value', () => {
    expect(isValidStatDelta('0.40')).toBe(false)
  })

  it('rejects a delta with non-numeric values', () => {
    expect(isValidStatDelta('high → low')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidStatDelta('')).toBe(false)
  })
})

describe('state_delta completeness in artifact content (ADR-033)', () => {
  it('accepts a complete state_delta with all three stats', () => {
    expect(isCompleteStateDelta({
      food: '0.40 → 0.33',
      health: '0.90 → 0.82',
      attention: '0.50 → 0.62',
    })).toBe(true)
  })

  it('rejects state_delta missing health — the ADR-033 scar', () => {
    expect(isCompleteStateDelta({
      food: '0.40 → 0.33',
      attention: '0.50 → 0.62',
    })).toBe(false)
  })

  it('rejects state_delta missing food', () => {
    expect(isCompleteStateDelta({
      health: '0.90 → 0.82',
      attention: '0.50 → 0.62',
    })).toBe(false)
  })

  it('rejects state_delta missing attention', () => {
    expect(isCompleteStateDelta({
      food: '0.40 → 0.33',
      health: '0.90 → 0.82',
    })).toBe(false)
  })

  it('rejects state_delta where a value is not a string', () => {
    expect(isCompleteStateDelta({
      food: '0.40 → 0.33',
      health: 0.82,
      attention: '0.50 → 0.62',
    })).toBe(false)
  })

  it('rejects state_delta where a value is malformed', () => {
    expect(isCompleteStateDelta({
      food: '0.40 → 0.33',
      health: 'unchanged',
      attention: '0.50 → 0.62',
    })).toBe(false)
  })

  it('rejects an empty state_delta', () => {
    expect(isCompleteStateDelta({})).toBe(false)
  })
})
