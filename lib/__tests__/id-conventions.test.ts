/**
 * Tests for ID and URL naming conventions.
 *
 * DRIFT THIS PREVENTS:
 *   ADR-023: root/branch/snapshot/artifact/event IDs must use full date-based slugs,
 *   never month-only slugs. Month-based IDs (root_2026_04) break when two runs share
 *   a calendar month and make it impossible to distinguish run boundaries.
 *
 *   ADR-022: Branch urlIds follow alt{n}-{descriptor} — ordinal + descriptor. An ordinal
 *   alone ('alt1') is not sortable-and-readable; a descriptor alone ('on-time') loses
 *   position. The vs separator (not 'compare') is the URL contract for comparison paths.
 *
 *   files.ts: urlId is derived by stripping the rootId prefix from branchId. If the
 *   stripping logic drifts, pages build under wrong route segments.
 */

import { describe, it, expect } from 'vitest'

// ─── ADR-023: root ID format ─────────────────────────────────────────────────

/** root_{YYYY}_{MM}_{DD} — full date, underscores */
function isValidRootId(id: string): boolean {
  return /^root_\d{4}_\d{2}_\d{2}$/.test(id)
}

describe('rootId format (ADR-023)', () => {
  it('accepts root_YYYY_MM_DD', () => {
    expect(isValidRootId('root_2026_04_14')).toBe(true)
  })

  it('rejects month-only root_YYYY_MM', () => {
    expect(isValidRootId('root_2026_04')).toBe(false)
  })

  it('rejects year-only root_YYYY', () => {
    expect(isValidRootId('root_2026')).toBe(false)
  })

  it('rejects hyphen separator', () => {
    expect(isValidRootId('root_2026-04-14')).toBe(false)
  })

  it('rejects missing root_ prefix', () => {
    expect(isValidRootId('2026_04_14')).toBe(false)
  })
})

// ─── ADR-023: branchId format ─────────────────────────────────────────────────

/** branch_{rootId}_{urlId} — three-part, rootId must be valid */
function isValidBranchId(id: string): boolean {
  return /^branch_root_\d{4}_\d{2}_\d{2}_\S+$/.test(id)
}

describe('branchId format (ADR-023)', () => {
  it('accepts branch_root_YYYY_MM_DD_main', () => {
    expect(isValidBranchId('branch_root_2026_04_14_main')).toBe(true)
  })

  it('accepts branch_root_YYYY_MM_DD_alt1-on-time', () => {
    expect(isValidBranchId('branch_root_2026_04_14_alt1-on-time')).toBe(true)
  })

  it('rejects month-only root inside branchId', () => {
    expect(isValidBranchId('branch_root_2026_04_main')).toBe(false)
  })

  it('rejects branchId without urlId segment', () => {
    expect(isValidBranchId('branch_root_2026_04_14')).toBe(false)
  })

  it('rejects branchId missing branch_ prefix', () => {
    expect(isValidBranchId('root_2026_04_14_main')).toBe(false)
  })
})

// ─── ADR-023: snapshotId format ───────────────────────────────────────────────

/** snap_{YYYY-MM-DD}_{branchId} — date uses hyphens here */
function isValidSnapshotId(id: string): boolean {
  return /^snap_\d{4}-\d{2}-\d{2}_branch_root_\d{4}_\d{2}_\d{2}_\S+$/.test(id)
}

describe('snapshotId format (ADR-023)', () => {
  it('accepts snap_YYYY-MM-DD_branchId', () => {
    expect(isValidSnapshotId('snap_2026-04-14_branch_root_2026_04_14_main')).toBe(true)
  })

  it('accepts alt branch snapshotId', () => {
    expect(isValidSnapshotId('snap_2026-04-17_branch_root_2026_04_14_alt1-on-time')).toBe(true)
  })

  it('rejects snapshotId without hyphen date', () => {
    expect(isValidSnapshotId('snap_2026_04_14_branch_root_2026_04_14_main')).toBe(false)
  })
})

// ─── ADR-023: artifactId format ───────────────────────────────────────────────

/** art_{YYYY-MM-DD}_{branchId}_summary */
function isValidArtifactId(id: string): boolean {
  return /^art_\d{4}-\d{2}-\d{2}_branch_root_\d{4}_\d{2}_\d{2}_\S+_summary$/.test(id)
}

describe('artifactId format (ADR-023)', () => {
  it('accepts art_YYYY-MM-DD_branchId_summary', () => {
    expect(isValidArtifactId('art_2026-04-14_branch_root_2026_04_14_main_summary')).toBe(true)
  })

  it('rejects artifactId without _summary suffix', () => {
    expect(isValidArtifactId('art_2026-04-14_branch_root_2026_04_14_main')).toBe(false)
  })

  it('rejects artifactId with wrong prefix', () => {
    expect(isValidArtifactId('snap_2026-04-14_branch_root_2026_04_14_main_summary')).toBe(false)
  })
})

// ─── ADR-023: eventId / decisionId format ────────────────────────────────────

/** evt_{YYYY-MM-DD}_{NNN} where NNN is zero-padded 3-digit */
function isValidEventId(id: string): boolean {
  return /^evt_\d{4}-\d{2}-\d{2}_\d{3}$/.test(id)
}

function isValidDecisionId(id: string): boolean {
  return /^dec_\d{4}-\d{2}-\d{2}_\d{3}$/.test(id)
}

describe('eventId format (ADR-023)', () => {
  it('accepts evt_YYYY-MM-DD_NNN', () => {
    expect(isValidEventId('evt_2026-04-14_001')).toBe(true)
    expect(isValidEventId('evt_2026-04-18_012')).toBe(true)
  })

  it('rejects event number without zero-padding', () => {
    expect(isValidEventId('evt_2026-04-14_1')).toBe(false)
    expect(isValidEventId('evt_2026-04-14_12')).toBe(false)
  })

  it('rejects missing prefix', () => {
    expect(isValidEventId('2026-04-14_001')).toBe(false)
  })
})

describe('decisionId format (ADR-023)', () => {
  it('accepts dec_YYYY-MM-DD_NNN', () => {
    expect(isValidDecisionId('dec_2026-04-14_001')).toBe(true)
  })

  it('rejects dec without zero-padded number', () => {
    expect(isValidDecisionId('dec_2026-04-14_1')).toBe(false)
  })
})

// ─── ADR-022: urlId format ────────────────────────────────────────────────────

/**
 * 'main' is the only canonical branch without a number prefix.
 * Alt branches: alt{n}-{descriptor} where n≥1 and descriptor is lowercase kebab.
 */
function isValidUrlId(id: string): boolean {
  if (id === 'main') return true
  return /^alt\d+-[a-z][a-z0-9-]+$/.test(id)
}

describe('urlId format (ADR-022)', () => {
  it('accepts main', () => {
    expect(isValidUrlId('main')).toBe(true)
  })

  it('accepts alt{n}-{descriptor}', () => {
    expect(isValidUrlId('alt1-on-time')).toBe(true)
    expect(isValidUrlId('alt2-early-riser')).toBe(true)
    expect(isValidUrlId('alt10-tax-delay')).toBe(true)
  })

  it('rejects ordinal-only alt (no descriptor)', () => {
    // 'alt1' alone reads like a name placeholder — the ADR-032 drift bug
    expect(isValidUrlId('alt1')).toBe(false)
  })

  it('rejects descriptor-only alt (no ordinal)', () => {
    expect(isValidUrlId('on-time')).toBe(false)
  })

  it('rejects alt with empty descriptor after hyphen', () => {
    expect(isValidUrlId('alt1-')).toBe(false)
  })

  it('rejects uppercase in urlId', () => {
    expect(isValidUrlId('Alt1-on-time')).toBe(false)
    expect(isValidUrlId('Main')).toBe(false)
  })
})

// ─── urlId extraction from branchId (files.ts + lib/runs.ts) ─────────────────

/**
 * lib/runs.ts strips the rootId prefix: branch_root_2026_04_14_main → main
 * This is the same operation used in getStaticRuns, getDayParams, getVsParams.
 */
function extractUrlId(branchId: string, rootId: string): string {
  return branchId.replace(`branch_${rootId}_`, '')
}

describe('urlId extraction from branchId', () => {
  it('extracts main from main branchId', () => {
    expect(extractUrlId('branch_root_2026_04_14_main', 'root_2026_04_14')).toBe('main')
  })

  it('extracts alt1-on-time from alt branchId', () => {
    expect(extractUrlId('branch_root_2026_04_14_alt1-on-time', 'root_2026_04_14')).toBe('alt1-on-time')
  })

  it('survives hyphen separators in the descriptor', () => {
    expect(extractUrlId('branch_root_2026_04_14_alt2-early-riser', 'root_2026_04_14')).toBe('alt2-early-riser')
  })

  it('does NOT strip a different rootId', () => {
    // Wrong rootId → branchId is returned unchanged
    const result = extractUrlId('branch_root_2026_04_14_main', 'root_2026_05_01')
    expect(result).toBe('branch_root_2026_04_14_main')
    expect(result).not.toBe('main')
  })
})

// ─── ADR-022: comparison URL uses 'vs' separator ─────────────────────────────

/** Comparison paths: /yy/{runDate}/vs/{branchA}/{branchB}[/day/{n}] */
function isValidVsPath(path: string): boolean {
  return /^\/yy\/\d{4}-\d{2}-\d{2}\/vs\/[a-z][a-z0-9-]+\/[a-z][a-z0-9-]+(\/day\/\d+)?$/.test(path)
}

describe('vs path format (ADR-022)', () => {
  it('accepts run-level vs path', () => {
    expect(isValidVsPath('/yy/2026-04-14/vs/main/alt1-on-time')).toBe(true)
  })

  it('accepts day-level vs path', () => {
    expect(isValidVsPath('/yy/2026-04-14/vs/main/alt1-on-time/day/4')).toBe(true)
  })

  it('rejects path using compare instead of vs', () => {
    expect(isValidVsPath('/yy/2026-04-14/compare/main/alt1-on-time')).toBe(false)
  })

  it('rejects path with month-only runDate', () => {
    expect(isValidVsPath('/yy/2026-04/vs/main/alt1-on-time')).toBe(false)
  })
})
