/**
 * Tests for character name anchoring.
 *
 * DRIFT THIS PREVENTS:
 *   ADR-032 (scar): On Day 4, the alt1-on-time branch artifact and snapshot used
 *   "Alt1" and "alt1" as the character's name throughout narrative and identity_notes.
 *   The canonical name is "YY" (from yy_baseline.json).
 *
 *   Root cause: by the time the generator reached the alt branch, "alt1" had
 *   accumulated enough salience in the session context that it substituted into
 *   generation slots expecting a proper noun. "main" never triggers this because
 *   it carries no character-name connotation.
 *
 *   The fix adds an explicit character-name anchor at Steps 6 and 10 of pipeline-go.
 *   These tests catch the drift pattern in generated text without requiring the pipeline
 *   to run — any text that should contain the character name can be checked before commit.
 */

import { describe, it, expect } from 'vitest'

// ─── urlId-as-name detector ───────────────────────────────────────────────────

/**
 * Returns true if the text contains the ordinal prefix of a branch urlId
 * used as a standalone word — a signal that the branch label leaked into
 * character-name position.
 *
 * 'alt1-on-time' → checks for word-boundary match on 'alt1'
 * 'main'         → never produces a name-like prefix (no ordinal)
 *
 * Not a perfect semantic check — it's a fast lint, not a judge. False positives
 * are possible if the text legitimately references the branch name (e.g. in a
 * system message or metadata). Use only on narrative prose and identity_notes.
 */
function containsBranchLabelAsName(text: string, branchUrlId: string): boolean {
  if (branchUrlId === 'main') return false
  // Extract the ordinal prefix: 'alt1' from 'alt1-on-time'
  const prefix = branchUrlId.split('-')[0] // e.g. 'alt1'
  if (!prefix.startsWith('alt')) return false
  // Word-boundary before prefix, negative lookahead for hyphen so "alt1-on-time"
  // as a compound doesn't fire — only standalone "alt1" (or "Alt1") does.
  const pattern = new RegExp(`\\b${prefix}(?!-)`, 'i')
  return pattern.test(text)
}

describe('branch label as name detector (ADR-032)', () => {
  it('detects "Alt1" at sentence start', () => {
    const text = 'Alt1 opened the acorn cache early, surprising the others.'
    expect(containsBranchLabelAsName(text, 'alt1-on-time')).toBe(true)
  })

  it('detects lowercase "alt1" in prose', () => {
    const text = 'Today alt1 decided to skip the afternoon forage.'
    expect(containsBranchLabelAsName(text, 'alt1-on-time')).toBe(true)
  })

  it('detects "alt1" in identity_notes', () => {
    const note = 'alt1 maintains vigilance; no deviation from usual patterns.'
    expect(containsBranchLabelAsName(note, 'alt1-on-time')).toBe(true)
  })

  it('does NOT flag correct name "YY"', () => {
    const text = 'YY opened the acorn cache early, surprising the others.'
    expect(containsBranchLabelAsName(text, 'alt1-on-time')).toBe(false)
  })

  it('does NOT flag "main" branch (no name-like prefix)', () => {
    const text = 'main character decisions are well-documented.'
    expect(containsBranchLabelAsName(text, 'main')).toBe(false)
  })

  it('does NOT flag the full urlId in a file path context', () => {
    // "alt1-on-time" as a compound is NOT a word-boundary match on "alt1"
    const text = 'branch alt1-on-time shows steady acorn gathering.'
    // "alt1-on-time" contains "alt1" but followed immediately by "-" not a word boundary
    expect(containsBranchLabelAsName(text, 'alt1-on-time')).toBe(false)
  })

  it('detects alt2 prefix for a different branch', () => {
    const text = 'Alt2 chose a different route through the park.'
    expect(containsBranchLabelAsName(text, 'alt2-early-riser')).toBe(true)
  })

  it('does NOT flag "alt1" in a higher ordinal branch check', () => {
    // alt1 in text, but we are checking for alt2 — not the same ordinal
    const text = 'alt1 reference here'
    expect(containsBranchLabelAsName(text, 'alt2-early-riser')).toBe(false)
  })
})

// ─── canonical name presence ─────────────────────────────────────────────────

/**
 * Narrative and identity_notes for any active branch should contain the
 * character's canonical name at least once. This is a positive-signal check:
 * if the name is absent, the text may be using a substitution.
 *
 * Single-word baseline names like "YY" are case-sensitive.
 */
function narrativeContainsCharacterName(text: string, characterName: string): boolean {
  // Case-sensitive: "YY" is not "yy" — the canonical form is all-caps
  return text.includes(characterName)
}

describe('canonical name presence check (ADR-032)', () => {
  it('passes when YY is present in narrative', () => {
    const text = 'YY spent the morning at the oak tree, watching the humans pass.'
    expect(narrativeContainsCharacterName(text, 'YY')).toBe(true)
  })

  it('fails when YY is absent (branch label substitution occurred)', () => {
    // This is the exact drift: "Alt1" replaced "YY"
    const text = 'Alt1 spent the morning at the oak tree, watching the humans pass.'
    expect(narrativeContainsCharacterName(text, 'YY')).toBe(false)
  })

  it('is case-sensitive — lowercase yy is not canonical', () => {
    // The baseline name is "YY", not "yy"
    const text = 'yy spent the morning at the oak tree.'
    expect(narrativeContainsCharacterName(text, 'YY')).toBe(false)
  })
})

// ─── combined: full narrative validation ─────────────────────────────────────

/**
 * Combines both checks: a healthy narrative has the canonical name present
 * and does not use the branch label as a substituted name.
 */
function isHealthyNarrative(
  text: string,
  characterName: string,
  branchUrlId: string,
): boolean {
  if (!narrativeContainsCharacterName(text, characterName)) return false
  if (containsBranchLabelAsName(text, branchUrlId)) return false
  return true
}

describe('combined narrative health check (ADR-032)', () => {
  it('passes for a correct alt-branch narrative', () => {
    const text = 'YY left the cache early. The on-time path had its own rhythm.'
    expect(isHealthyNarrative(text, 'YY', 'alt1-on-time')).toBe(true)
  })

  it('fails when character name replaced with branch label', () => {
    const text = 'Alt1 left the cache early. The on-time path had its own rhythm.'
    expect(isHealthyNarrative(text, 'YY', 'alt1-on-time')).toBe(false)
  })

  it('fails when narrative has no character name at all', () => {
    const text = 'The cache was left early. The path had its own rhythm.'
    expect(isHealthyNarrative(text, 'YY', 'alt1-on-time')).toBe(false)
  })

  it('passes for main branch (no label detection applies)', () => {
    const text = 'YY settled into the familiar routine, scanning the park.'
    expect(isHealthyNarrative(text, 'YY', 'main')).toBe(true)
  })
})
