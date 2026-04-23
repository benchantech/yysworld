# ADR-036 — World anchor surfacing on day pages

**Status:** Accepted  
**Date:** 2026-04-22  
**Refs:** ADR-021 (discoverability), ADR-028 (event translation quality)

---

## Context

Each day's artifact is anchored to a real-world event, translated into YY's physical world per ADR-028. The real-world inspiration (`authorial_note.real_world_inspiration` in the event file) existed only as pipeline provenance — never surfaced in the UI or in the artifact JSON.

This meant:
- AI agents and crawlers had no way to connect a day page to its real-world event
- AEO/GEO value from real-world event names was unrealized
- The authorial process was invisible to anyone reading the story

## Decision

1. **Add `world_anchor` to artifact `content`** at generation time. The pipeline writes `real_world_inspiration` from the event file into `content.world_anchor` in the artifact JSON. This keeps the artifact as the single document crawlers need — no extra event-file reads at render time.

2. **Render as `<details>/<summary>`** on the day page, labeled "world anchor". Collapsed by default — visible to crawlers (text is in DOM), invisible on first read. This preserves the narrative surface: YY never hears about Earth Day, just sees seedlings. The connection between them is available, not announced.

3. **Backfill all existing artifacts** with `world_anchor` at adoption time.

## Rationale

- `<details>/<summary>` is the only pattern that satisfies both "easter egg" UX and "crawlable text" SEO at the same time
- Putting `world_anchor` in the artifact (not read from the event file at render) keeps the render path simple and matches how all other content fields work
- The naming "world anchor" (not "real-world inspiration" or "based on") is consistent with the project's register — concrete, not explanatory

## AEO / GEO value

Real-world event names as crawlable DOM text create a second retrieval surface:
- An AI agent asked "what content engaged with Earth Day 2026" can match the day-9 pages
- Day pages for major events (earthquakes, elections, records) become findable through those events
- This compounds across a full run — 30 days × real event names = a navigable index

## What this does not do

- Does not break the fictional surface — YY never "hears about" the anchor event
- Does not require the reader to look at the anchor — it is collapsed
- Does not change how narrative is generated — the anchor is metadata, not story content

## Schema change

`artifact.content.world_anchor: string` — non-empty string, required for all new artifacts. Old artifacts without it degrade gracefully (empty string → `<details>` not rendered).

## Tests

`lib/__tests__/world-anchor.test.ts` — validates the field format and checks all committed artifact files carry a non-empty `world_anchor`.
