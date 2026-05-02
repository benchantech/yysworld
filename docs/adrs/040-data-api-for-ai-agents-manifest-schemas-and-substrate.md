# ADR-040 — Data API for AI Agents: Manifest, Schemas, and Substrate Endpoints

**Status:** Proposed
**Date:** 2026-05-02
**Refs:** ADR-013 (manifests as control surfaces), ADR-021 (URL discoverability), ADR-022 (URL design — human and machine layers), ADR-027 (authorship from public append-only systems), ADR-031 (source-event field), ADR-037 (schema normalization)

---

## Context

ADR-022 declared a two-layer URL design with a machine layer rooted at `/yy/data/`. Two endpoints from that declaration have been built:

- `/yy/data/{month}/{branch}/day/{day}.json` — day artifact
- `/yy/data/{month}/vs/{a}/{b}/day/{day}.json` — comparison
- `/yy/baseline.json` — character baseline

Three declared paths in ADR-022's URL map were never implemented:

- `/yy/data/{month}/manifest.json` — build/publish manifest
- `/yy/data/{month}/ledger.jsonl` — append-only event ledger
- (Implicit) any way for an agent to *discover* what runs, branches, days, or comparisons exist without scraping `llms.txt` or guessing URLs

The substrate that lives on disk under `runs/{rootId}/` — snapshots, events, branches, decisions, world-seed — is also not exposed at all. An AI agent today can read a single artifact but cannot walk the system: no entry point, no schema URLs to validate against, no path from artifact → snapshot → event → world-seed → root manifest.

CLAUDE.md §3.7 (build determinism) and ADR-013 (manifests as control surfaces) both call for explicit machine-readable surfaces over immutable truth. ADR-027 frames public append-only systems as the project's authority mechanism — but authority requires *legibility*: the ledger has to be reachable, not just present.

This ADR formalizes the data API so that an agent landing on `yy/data/index.json` can crawl the entire system without filesystem access, and so that every response is self-describing via `$schema` and `_links`.

---

## Decision

### 1. Single discovery entry point — `/yy/data/index.json`

One manifest is the canonical entry point for agents. It lists every run, every branch in each run, every published day, every comparison, the active baseline, and the world-seed for each root. Every reference is a fully-qualified URL relative to the site root.

```json
{
  "$schema": "/yy/data/schemas/index.json",
  "schema_version": "0.1",
  "generated_at": "2026-05-02T00:00:00Z",
  "character": { "id": "yy", "baseline": "/yy/baseline.json" },
  "runs": [
    {
      "run_id": "root_2026_05_01",
      "run_date": "2026-05-01",
      "month": "2026-05",
      "voice_version": "v2",
      "world_version": "2.0",
      "world_seed": "/yy/data/2026-05/world-seed.json",
      "manifest": "/yy/data/2026-05/manifest.json",
      "branches": [
        {
          "id": "main",
          "index": "/yy/data/2026-05/main/index.json",
          "published_days": [1, 2]
        }
      ],
      "comparisons": [
        { "a": "main", "b": "alt1-with-feather", "days": [1, 2] }
      ]
    }
  ]
}
```

This is the **only path an agent needs to memorize.** Everything else is discoverable from here.

### 2. Per-run manifest — `/yy/data/{month}/manifest.json`

Redeems the ADR-022 declaration. The manifest catalogs everything in one root: branches, days published, comparisons, voice/world versions, baseline reference, world-seed reference, and a list of every artifact, snapshot, event, decision, and branch file with its URL.

The manifest is **the rebuildable projection** for a root. It is regenerated on every nightly publish from the immutable substrate; it is not itself canonical truth. CLAUDE.md §3.2 holds.

### 3. Per-branch index — `/yy/data/{month}/{branch}/index.json`

For each branch, a single document gives the full day-by-day series in order, with each day pointing to its artifact, snapshot, and any decisions emitted that day:

```json
{
  "$schema": "/yy/data/schemas/branch-index.json",
  "branch_id": "main",
  "run_id": "root_2026_05_01",
  "days": [
    {
      "day": 1,
      "story_date": "2026-05-01",
      "artifact": "/yy/data/2026-05/main/day/1.json",
      "snapshot": "/yy/data/2026-05/main/snapshots/1.json",
      "decisions": ["/yy/data/2026-05/main/decisions/2026-05-01_001.json"]
    }
  ]
}
```

This is the endpoint an agent uses to retrieve a branch's full history in one request rather than walking days one at a time.

### 4. Substrate endpoints

Expose what already lives on disk under `runs/{rootId}/`, mirroring the conceptual model rather than the on-disk filenames. Branch-scoped artifacts live under `{branch}/`; run-scoped artifacts (events, decisions, comparisons, world-seed) live one level up under `{month}/`.

- `/yy/data/{month}/world-seed.json` — world rules (re-serves `runs/{rootId}/world-seed.json`)
- `/yy/data/{month}/baseline.json` — per-run character baseline (re-serves `runs/{rootId}/baseline/yy_baseline.json`; distinct from the global `/yy/baseline.json`)
- `/yy/data/{month}/events/{date}_{nnn}.json` — individual event (events apply across all branches)
- `/yy/data/{month}/decisions/{date}_{nnn}.json` — individual decision
- `/yy/data/{month}/ledger.jsonl` — append-only event stream for the run (one JSON object per line, ordered by `occurred_at`)
- `/yy/data/{month}/{branch}/snapshots/{day}.json` — per-day, per-branch snapshot

The on-disk filenames carry the full `branch_root_2026_05_01_main` prefix; the URL drops the redundant root prefix because the path already names the run and branch. This is a presentation layer, not a rename of the underlying files.

### 5. Schema endpoints — `/yy/data/schemas/{name}.json`

The canonical JSON Schemas from `docs/pipeline/schemas.md` are served at stable URLs as proper JSON Schema documents:

- `/yy/data/schemas/artifact.json`
- `/yy/data/schemas/snapshot.json`
- `/yy/data/schemas/event.json`
- `/yy/data/schemas/decision.json`
- `/yy/data/schemas/branch.json`
- `/yy/data/schemas/world-seed.json`
- `/yy/data/schemas/baseline.json`
- `/yy/data/schemas/index.json` (the manifest itself)
- `/yy/data/schemas/branch-index.json`
- `/yy/data/schemas/comparison.json`

Every response in §1–§4 includes a top-level `$schema` field pointing at the matching schema URL. Agents can validate without out-of-band knowledge.

`docs/pipeline/schemas.md` remains the human-readable reference; the JSON files at `/yy/data/schemas/` are derived from it. If the markdown and the JSON ever diverge, the markdown wins and the JSON is regenerated — the markdown is the schema's authorial source per §3 below.

### 6. Hyperlinking — `_links` in every response

Every response includes a `_links` object pointing to the obvious neighbors an agent might want to traverse to next. Examples:

- An artifact links to `self`, `branch_index`, `manifest`, `snapshot`, `world_seed`, `comparisons` (any comparison this day participates in)
- A snapshot links to `self`, `branch_index`, `prev_snapshot`, `next_snapshot`, `events_for_this_day`
- A comparison links to `self`, both branch artifacts, both snapshots, `manifest`

`_links` is additive to the existing schema — it does not replace any existing field. Old artifacts loaded by existing pages continue to work; the new field is ignored by readers that don't need it.

### 7. URL stability — present-tense rename, no rewrites

The substrate URLs in §4 are *new surfaces* over existing files. The existing artifact and comparison URLs from ADR-022 are preserved verbatim. No old URL changes meaning. CLAUDE.md §3.2 (no silent retroactive rewrites) holds.

If a future change requires renaming an existing data URL, it gets its own ADR, ships a redirect for the old URL, and bumps `schema_version` on the affected response.

### 8. Static-first, force-static

All endpoints in §1–§5 use `force-static` + `generateStaticParams` in Next.js, matching the existing `/yy/data/[...path]/route.ts`. Nightly publish regenerates the static files; daytime serves them from CDN. No server-side computation per request. ADR-009 (nightly build) holds.

### 9. Manifest is the single source of agent truth

If an artifact, snapshot, or comparison exists on disk but is not listed in `index.json` or the per-month `manifest.json`, agents should treat it as not yet published. This makes the manifest the publication boundary — consistent with ADR-024 (time-gated publication replaces deploy-gated story-day).

### 10. Derivation, not synchronization

**Nothing in this API is hand-maintained.** Every endpoint is a projection over data that is *already* the source of truth for some other surface in the app. The data API adds no new authoritative state — only new views of existing state.

| Endpoint | Derived from | Already powers |
|----------|--------------|----------------|
| `index.json` | `lib/runs.ts` enumerators (`getRuns`, `getBranches`, `getDayParams`, `getVsParams`) | `generateStaticParams` for every page route, `sitemap.ts`, `llms.txt` |
| `{month}/manifest.json` | Same enumerators, scoped to one root, plus the on-disk `runs/{rootId}/` listing | per-run pipeline outputs |
| `{month}/{branch}/index.json` | Same enumerators, scoped to one branch | `/yy/{date}/{branch}/day/{n}` page generation |
| `{month}/world-seed.json` | `runs/{rootId}/world-seed.json` (re-served verbatim) | pipeline reads it directly |
| `{branch}/snapshots/{day}.json` | `runs/{rootId}/snapshots/snap_{date}_{branchFile}.json` (re-served) | pipeline reads it directly |
| `{branch}/events/{file}.json` | `runs/{rootId}/events/evt_{file}.json` (re-served) | pipeline reads it directly |
| `{branch}/ledger.jsonl` | Concatenation of the same event files in `occurred_at` order | n/a — new view, but no new state |
| `_links` blocks | Computed at serialize time from the same enumerators | n/a — derived field |
| `schemas/{name}.json` | Authored once (or generated from `docs/pipeline/schemas.md`) and checked in | `docs/pipeline/schemas.md` references the same shapes |

The practical consequence: **adding a new run, branch, day, or comparison requires no edits to the data API.** The same act that makes a page render — dropping files into `runs/{rootId}/` and letting the nightly publish run — makes every data API endpoint reflect the change automatically. The build is the sync.

The two places that *are* hand-touched are:

1. `lib/runs.ts` enumerators — but these already exist and are exercised by every page route, so they are continuously validated.
2. The schema JSONs — touched only when `docs/pipeline/schemas.md` changes (which is itself rare and ADR-gated, e.g. ADR-037). A vitest test asserts every served response validates against its `$schema`, so drift surfaces in CI rather than in production.

This means the data API does not introduce a new sync burden. It introduces new *exits* from the existing source of truth. ADR-013 (manifests as control surfaces) holds: the manifest is a projection, not a parallel ledger.

---

## What this does not do

- Does not retrofit existing artifact responses — `$schema` and `_links` land at first regeneration of each file, not by editing committed history. Old root files (April) gain the fields the next time they pass through the pipeline; no manual rewrite.
- Does not introduce dynamic queries, search, or filtering. The data API is a static graph; agents that need to query do so client-side after fetching `index.json` and the manifests.
- Does not commit to a versioned API path (`/yy/data/v1/`). `schema_version` per response is the versioning surface for now. If a breaking change is ever needed, that ADR adds a path prefix at the same time.
- Does not gate any endpoint behind auth or rate-limiting. The data layer is public per ADR-027.
- Does not serve binary artifacts or non-JSON formats. Feeds (`feed.xml`) and `llms.txt` keep their existing paths and roles.
- Does not change `/llms.txt`. The agent index there continues to function as the prose-style guidance entry point; `index.json` is the structured-data entry point. Both are valid, and the README/landing page should mention both.

---

## Consequences

- The Next.js app gains route handlers (or extends `[...path]`) for: `/yy/data/index.json`, `/yy/data/{month}/manifest.json`, `/yy/data/{month}/world-seed.json`, `/yy/data/{month}/baseline.json`, `/yy/data/{month}/events/{file}.json`, `/yy/data/{month}/decisions/{file}.json`, `/yy/data/{month}/ledger.jsonl`, `/yy/data/{month}/{branch}/index.json`, `/yy/data/{month}/{branch}/snapshots/{day}.json`, and `/yy/data/schemas/{name}.json`. Every one of these reads from `lib/runs.ts` enumerators or directly from the on-disk substrate — no new state.
- `lib/runs.ts` may need small additions (e.g. a `getEvents(runId, branchId)` helper) if not already present, but the enumerator pattern is unchanged.
- Schema JSONs are hand-authored once at `lib/schemas/*.json` (or a comparable path) and committed. A vitest test validates every endpoint response against its declared `$schema`. If `docs/pipeline/schemas.md` and the JSONs disagree, the test fails and an ADR is required to resolve — the markdown is the authorial source per §5.
- The artifact route (`getDayArtifactByMonth`, `getComparisonArtifactByMonth`) is extended to attach `$schema` and `_links` at serialize time. The on-disk artifact files are not edited.
- The Lab page (`/lab`, recently renamed to "AI" in the nav) gains a card pointing at `/yy/data/index.json` as the agent entry point, alongside the existing `llms.txt` card.
- `sitemap.xml` continues to list human-layer URLs only. Machine-layer URLs are reachable via `index.json` and need not pollute the sitemap.
- `llms.txt` gains one line near the top pointing to `index.json` as the structured-data entry. The rest of `llms.txt` is unchanged.

---

## Alternatives considered

1. **Versioned API path (`/yy/data/v1/...`)** — rejected for now. Adds a permanent prefix to every URL for a versioning concern that has not yet materialized. `schema_version` per response is sufficient until a breaking change forces the issue.
2. **Mirror filesystem layout 1:1 (`/yy/data/runs/root_2026_05_01/snapshots/snap_2026-05-01_branch_root_2026_05_01_main.json`)** — rejected. Couples the public API to internal filenames forever and exports redundant prefixes (the `branch_root_2026_05_01_` portion is already implied by the URL path).
3. **Dynamic query endpoint (`/yy/data/query?branch=main&day=1`)** — rejected. Breaks static-first; introduces server-side compute per request; agents can't cache; couples the agent API to a query language we'd then have to version.
4. **GraphQL** — rejected. Same objection as (3), plus a runtime dependency for a data layer that is fundamentally a static graph already.
5. **One mega-document with the entire root inline** — rejected. Useful for offline analysis, but unwieldy for crawlers and pushes the cost of pagination onto the consumer. Per-branch `index.json` is the right granularity.
6. **Skip schemas; document the shapes only in markdown** — rejected. Agents need machine-readable schemas to validate. Markdown alone has been the status quo, and the project's recurring schema-drift findings (ADR-037) show why that is not enough.

---

## Invariants preserved

- **Canon integrity** (CLAUDE.md §3.1) — voice and world versions surface in `index.json` per run; old roots keep their own versions.
- **Immutable truth** (§3.2) — the data API is a projection over the on-disk substrate, never a write surface.
- **Build determinism** (§3.7) — every endpoint is statically generated; manifests are reproducible from substrate.
- **Audience discipline** (§3.8) — the data API is an agent surface, not a child-facing one, so no audience implications. Human navigation (ADR-022) is unchanged.

---

## Freshness boundary

Revisit if (a) a second character is introduced and `index.json` needs to enumerate multiple characters, (b) a single response exceeds a size that breaks downstream consumers and pagination becomes necessary, (c) the schema-generation step proves brittle and the markdown-as-source decision needs to flip, or (d) a real rate-limiting or auth need emerges (for example, an external integration that is not the public web).
