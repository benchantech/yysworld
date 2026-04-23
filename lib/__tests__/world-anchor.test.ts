/**
 * Tests for the world_anchor field in artifact content (ADR-036).
 *
 * DRIFT THIS PREVENTS:
 *   ADR-036: world_anchor is a required string field in artifact content.
 *   Without it, the day page <details> element does not render, the real-world
 *   inspiration is invisible to crawlers, and AEO/GEO value is lost silently.
 *
 *   The field must be a non-empty string — an empty string means the pipeline
 *   failed to write it (or the backfill was not run), and degrades gracefully
 *   in the UI (no <details> rendered) but should be caught before commit.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

// ─── unit: world_anchor field validation ─────────────────────────────────────

function isValidWorldAnchor(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

describe('world_anchor field validation (ADR-036)', () => {
  it('accepts a non-empty string', () => {
    expect(isValidWorldAnchor('Earth Day 2026 — global environmental renewal')).toBe(true)
  })

  it('rejects an empty string', () => {
    expect(isValidWorldAnchor('')).toBe(false)
  })

  it('rejects a whitespace-only string', () => {
    expect(isValidWorldAnchor('   ')).toBe(false)
  })

  it('rejects undefined', () => {
    expect(isValidWorldAnchor(undefined)).toBe(false)
  })

  it('rejects null', () => {
    expect(isValidWorldAnchor(null)).toBe(false)
  })

  it('rejects a number', () => {
    expect(isValidWorldAnchor(42)).toBe(false)
  })

  it('rejects an object', () => {
    expect(isValidWorldAnchor({ text: 'Earth Day' })).toBe(false)
  })

  it('accepts a multi-clause inspiration string', () => {
    expect(isValidWorldAnchor(
      'Tax Day (US, April 15 2026) + World Art Day (Leonardo da Vinci\'s birthday, April 15)'
    )).toBe(true)
  })
})

// ─── integration: all committed artifact files carry world_anchor ─────────────

/**
 * Every artifact file in runs/ must have content.world_anchor set to a
 * non-empty string. A missing or empty field means:
 *   - the pipeline did not write it (new artifact, pipeline-go not updated)
 *   - the backfill was not run (old artifact, pre-ADR-036)
 *   - the <details> element will silently not render on that day page
 */
describe('all artifact files have world_anchor (ADR-036)', () => {
  const runsDir = join(process.cwd(), 'runs')

  if (!existsSync(runsDir)) {
    it.skip('no runs/ directory — skipping file checks')
    return
  }

  for (const rootId of readdirSync(runsDir)) {
    const artifactsDir = join(runsDir, rootId, 'artifacts')
    if (!existsSync(artifactsDir)) continue

    for (const file of readdirSync(artifactsDir).filter((f) => f.endsWith('.json'))) {
      it(`${rootId}/artifacts/${file} has non-empty world_anchor`, () => {
        const art = JSON.parse(readFileSync(join(artifactsDir, file), 'utf-8'))
        const anchor = art?.content?.world_anchor
        expect(
          isValidWorldAnchor(anchor),
          `content.world_anchor must be a non-empty string — got: ${JSON.stringify(anchor)}`
        ).toBe(true)
      })
    }
  }
})
