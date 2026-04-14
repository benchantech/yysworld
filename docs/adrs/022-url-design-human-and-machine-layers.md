# ADR 022 — URL Design: Human and Machine Layers

- **ID:** YYBW-022
- **Status:** Decided
- **Date:** 2026-04-14
- **Scope:** YY Branching World
- **Depends on:** YYBW-017, YYBW-020, YYBW-021
- **Supersedes / clarifies:** Supersedes the URL structure section of YYBW-021 (`/root/` paths replaced; full two-layer design formalized)

## Context

YYBW-021 established a URL structure using `/root/2026-04/` as the path prefix for run data. That prefix has no character scoping — as soon as a second character exists, it becomes ambiguous. Separately, the human-facing and machine-readable layers were not cleanly separated. This ADR formalizes the full URL design: character-scoped, two-layer, with explicit decisions on run identification, branch naming, comparison paths, and navigation behavior.

## Decision

### Two-layer separation

Human-facing and machine-readable URLs are distinct paths under the same character scope.

```
/yy/2026-04-01/main/day/1              ← human layer
/yy/data/2026-04/main/day/1.json       ← machine layer
```

The character name (`yy`) is always the first segment. Both layers live under it. A future character drops in without structural change:

```
/zz/2026-05-01/main/day/1
/zz/data/2026-05/main/day/1.json
```

### Run identification

Runs are identified by their **start date** (full date, not month), because runs can begin partway through a month and multiple runs in the same month must not collide.

```
/yy/2026-04-01/    ← run starting April 1
/yy/2026-04-18/    ← hypothetical second run starting April 18
```

The machine layer uses month granularity (`2026-04`) because one run per month is the current operating assumption and month is the natural ledger boundary. If two runs exist in the same month, the machine layer path will be revisited.

### Branch naming

Branches follow the pattern `alt{n}-{descriptor}` where `n` is the ordinal and the descriptor names the divergence.

- `main` — canonical branch, no number prefix
- `alt1-time-slip` — first branch, named for its cause
- `alt2-early-riser` — second branch, named for its cause

The ordinal ensures stable sort order and machine parseability. The descriptor ensures human readability and shareability. Both are permanent once assigned.

### Comparison URLs

The comparison path uses `vs` as the separator segment.

```
/yy/2026-04-01/vs/main/alt1-time-slip          ← run-level
/yy/2026-04-01/vs/main/alt1-time-slip/day/1    ← day-level
```

`vs` is short, universally understood, and self-describing in a shared link without visiting the page.

### Navigation behavior

`/yy/2026-04-01/` does not have a standalone overview page. It 301 redirects to:
- the current day on main (if the run is active)
- day 1 on main (if the run is complete)

The artifact page itself carries branch switching and day navigation. No intermediate overview page is needed.

### Character pages

```
/                   landing page — concept intro + character cards
/yy                 YY's run list, newest first, with character header
/yy/about           full character profile — traits, values, calibration notes, version history
```

The home page (`/`) introduces the concept and links to each character. It is not a run list. It shows a compact character card (trait summary + cumulative stats) for each character. Tapping a character goes to `/yy`.

### ADRs

ADRs are served publicly at `/adrs/` (statically, from `docs/adrs/` in the repo). They are included in `sitemap.xml` and referenced in `llms.txt`. They are not linked in the main human navigation — they are a GEO and AI-agent surface, not a reading destination.

### Complete URL map

```
# Human layer
/                                              landing — concept + character cards
/yy                                            YY's runs, newest first + character header
/yy/about                                      full character profile
/yy/2026-04-01/                               → redirects to current/first day
/yy/2026-04-01/main/day/1                     day artifact, main branch
/yy/2026-04-01/alt1-time-slip/day/3           day artifact, alt branch
/yy/2026-04-01/vs/main/alt1-time-slip         run-level comparison
/yy/2026-04-01/vs/main/alt1-time-slip/day/1   day-level comparison

# Machine layer
/yy/data/2026-04/main/day/1.json              snapshot projection
/yy/data/2026-04/alt1-time-slip/day/1.json    branch snapshot
/yy/data/2026-04/ledger.jsonl                 append-only event ledger
/yy/data/2026-04/manifest.json                build/publish manifest
/yy/baseline.json                             character baseline

# Discoverability
/adrs/                                        ADRs — indexed, not nav'd
/llms.txt                                     AI agent entry point
/sitemap.xml                                  generated nightly
```

## Why

**Character scoping:** `/root/` has no character identity. Every URL should be self-identifying — a shared link should tell the reader whose world it is without visiting it.

**Start date over month:** Month slugs are imprecise for runs that start mid-month. Full date is honest and unambiguous.

**`alt{n}-{descriptor}`:** Ordinal alone (`alt1`) is sortable but opaque. Descriptor alone (`time-slip`) is memorable but not sortable. Both together cost one hyphen and gain both properties.

**`vs` over `compare`:** Shorter, universally understood, reads naturally in a URL shared out of context.

**No run overview page:** One less tap. The artifact page with branch switcher and day nav does the same job. Fewer routes to maintain.

**`/yy/data/` over `/data/yy/`:** The character owns everything under it. Data is a sublayer of the character, not a separate namespace.

## Alternatives considered

1. **`/root/2026-04/` paths (YYBW-021)** — rejected. No character scoping; breaks when a second character is introduced.
2. **Month-only run slug (`/yy/2026-04/`)** — rejected. Ambiguous when runs start mid-month or two runs share a month.
3. **Descriptive branch names only (`time-slip`)** — rejected. Not sortable, ordinal position lost.
4. **`compare` instead of `vs`** — rejected. Longer, no meaningful gain in clarity for URLs.
5. **Run overview page at `/yy/2026-04-01/`** — rejected. One extra tap with no additional content the artifact page doesn't already surface.
6. **`/data/yy/` for machine layer** — rejected. Splits the character across two top-level namespaces.

## Reversals / scars preserved

- YYBW-021 URL structure (`/root/`, `/compare/`) is superseded by this ADR. The old paths should not be implemented. The discoverability priority order from YYBW-021 (llms.txt → JSON layer → JSON-LD → OG → BreadcrumbList → semantic HTML → Dataset) remains in force and is not changed here.
- The human-facing name layer over data-model URLs was explicitly rejected in YYBW-021. This ADR preserves that rejection — the start date slug is honest and matches the ledger, not a marketing name.

## Consequences

- Internal data references using `root_2026_04` IDs remain unchanged — this ADR governs public URLs, not internal identifiers.
- `llms.txt` must be updated to reference `/yy/data/` paths and `/yy/baseline.json`.
- The nightly pipeline must write projections to paths matching `/yy/data/2026-04/` structure.
- Every rendered page needs `<link rel="alternate" type="application/json">` pointing to the corresponding `/yy/data/` path.
- `/adrs/` must be served statically and appear in `sitemap.xml`.

## Invariants preserved

Explainability via self-identifying URLs at every level; Compression via `vs` and ordinal-descriptor branch names; Discipline via explicit rejection of the run overview page and character-agnostic prefixes; Timestamping via start-date run slugs.

## Freshness boundary

Revisit the machine layer month granularity if two runs occur within the same calendar month. Revisit `/adrs/` path if ADRs are split by character in a future multi-character world.
