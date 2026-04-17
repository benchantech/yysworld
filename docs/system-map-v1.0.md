# YY Branching World — System Map v1.0

**Version:** 1.0
**Date:** 2026-04-16
**Status:** current — reflects the repo as actually constituted
**Next version:** when a layer changes structurally

Every unlabelled box exists in the repo.
Every `[planned — not yet implemented]` label is honest about what does not.

---

```
                     ┌──────────────────────────────────┐
                     │  YOU / BEN                       │
                     │                                  │
                     │  writes / approves ADRs          │
                     │  selects world events            │
                     │  approves artifacts              │
                     │  resolves ambiguity              │
                     └───────────────┬──────────────────┘
                                     │
                                     ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  ADR GRAPH  (docs/adrs/)                                                            │
│                                                                                     │
│  31 active ADRs, named YYBW-001 through YYBW-031                                    │
│    001-product-thesis-from-world-builder-to-branching-life-observatory.md           │
│    004-branches-arise-from-acquisitions-and-drift-gradually.md                      │
│    021-url-structure-and-discoverability-seo-aeo-geo.md                             │
│    028-artifact-rewrite-and-event-translation-quality.md                            │
│    030-drift-is-research-governance-as-legibility-not-constraint.md                 │
│    031-source-event-as-required-event-field.md                                      │
│                                                                                     │
│  Each ADR contains:                                                                 │
│    context · decision · consequences · depends-on · status · scar records           │
│                                                                                     │
│  docs/adrs/README.md  ← navigable index                                             │
│  docs/adrs/museum/    ← 57 superseded ADRs (scar tissue, never deleted)             │
│                                                                                     │
│  ADRs serve as reasoning records and specs. No separate /specs/ layer exists.       │
│  [planned: dedicated /specs/ layer as volume grows]                                 │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │  parsed at build time by lib/adrs.ts
                                   │  exposed via llms.txt (dynamic route)
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  KNOWLEDGE INDEX — current substitute                                               │
│                                                                                     │
│  lib/adrs.ts              reads docs/adrs/*.md at build time                        │
│  getActiveAdrs()          returns typed AdrMeta[] (id, title, status, date, deps)   │
│  app/llms.txt/route.ts    generates machine entry point dynamically                 │
│  app/adrs/[slug]/page.tsx generates one page per ADR, with JSON-LD                 │
│                                                                                     │
│  Enables: ADR discovery · dependency links · summaries · structured metadata        │
│                                                                                     │
│  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ │
│  [planned — not yet implemented]                                                    │
│                                                                                     │
│  Retrieval layer: embeddings (pgvector / Pinecone) · metadata DB · graph edges      │
│  Would enable: semantic search · constraint inheritance · ambiguity detection        │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  WORLD MODEL + LEDGER  (runs/root_YYYY_MM_DD/)                                      │
│                                                                                     │
│  baseline/yy_baseline.json            ← character: traits, values, calibration      │
│                                                                                     │
│  events/evt_YYYY-MM-DD_NNN.json       ← immutable, append-only, one file per event  │
│                                          source_event · canonical_truth             │
│                                          perception_prompt · authorial_note         │
│                                                                                     │
│  branches/branch_{rootId}_{id}.json   ← current state per branch                   │
│                                          food · health · attention · burdens        │
│                                                                                     │
│  snapshots/snap_{date}_{branch}.json  ← state before + after per day               │
│  artifacts/art_{date}_{branch}.json   ← narrative + state delta (human output)     │
│  comparisons/cmp_{date}_{day}.json    ← divergence summary per branch pair         │
│  decisions/dec_{date}_NNN.json        ← branch evaluation + outcome                │
│  inbox/YYYY-MM-DD.json                ← queued author intent for next pipeline run  │
│                                                                                     │
│  schemas/  (repo root)                                                              │
│    world_event.schema.json · branch_state.schema.json · artifact.schema.json · …   │
│                                                                                     │
│  Derived from ADR reasoning. Truth may not be overwritten — only extended.          │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │  read at build time by lib/runs.ts
                                   │  nightly: /pipeline-go writes new files here
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  PROJECTION LAYER  (Next.js → GitHub → Vercel)                                      │
│                                                                                     │
│  Human pages:                                                                       │
│    /yy/{runDate}/{branch}/day/{N}/          narrative + state delta                 │
│    /yy/{runDate}/vs/{a}/{b}/day/{N}/        branch comparison                      │
│    /adrs/{slug}/                            ADR detail                              │
│    /system-map/                             this diagram                            │
│                                                                                     │
│  Machine-readable:                                                                  │
│    /yy/data/{YYYY-MM}/{branch}/day/{N}.json     artifact JSON (static)              │
│    /yy/data/{YYYY-MM}/vs/{a}/{b}/day/{N}.json   comparison JSON (static)            │
│    /yy/baseline.json                            character baseline                  │
│    /llms.txt                                    AI entry point (dynamic route)      │
│    /sitemap.xml  /feed.xml                      discovery + RSS                     │
│                                                                                     │
│  Every human page has <link rel="alternate" type="application/json">                │
│  pointing to the parallel machine-readable URL.                                     │
│                                                                                     │
│  Generated from world model + ADR graph. Never mutated directly.                    │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  AUDIENCES                                                                          │
│                                                                                     │
│  Humans        read site · narrative view · compare branches · explore ADRs         │
│                                                                                     │
│  AI systems    /llms.txt · /yy/data/ JSON · /yy/baseline.json · /sitemap.xml        │
│                                                                                     │
│  Claude Code   reads CLAUDE.md + docs/adrs/ + runs/                                 │
│                runs /pipeline-go · edits files · commits · proposes                 │
│                human approves before anything ships                                  │
│                                                                                     │
│  [planned — not yet implemented]                                                    │
│  Named agents: "Pipeline Executor" · "ADR Drafter" · "Branch Analyst"               │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  ADRs AS SPECS                                                                      │
│                                                                                     │
│  docs/adrs/{slug}.md  ← each ADR includes, where relevant:                         │
│    context + goal                                                                   │
│    decision + why-not                                                               │
│    constraints inherited from earlier ADRs (via depends-on)                        │
│    affected world entities: character · branch · event · artifact                  │
│    acceptance criteria (consequences section)                                       │
│                                                                                     │
│  [planned: dedicated /specs/ layer once ADR volume exceeds manageable scope]        │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  EXECUTION STACK                                                                    │
│                                                                                     │
│  Claude Code                                                                        │
│    reads CLAUDE.md · docs/adrs/ · runs/                                             │
│    edits files · commits · opens GitHub PRs                                         │
│         │                                                                           │
│         ▼                                                                           │
│  GitHub Repo                                                                        │
│    app/ (site) · runs/ (world model) · docs/adrs/ (ADR graph)                      │
│    components/ · lib/ · schemas/ · pipeline/                                       │
│         │                                                                           │
│         ▼                                                                           │
│  Vercel build                                                                       │
│    GitHub push → Vercel CI → static export → yysworld.com                          │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  PRODUCTION + OBSERVABILITY                                                         │
│                                                                                     │
│  Current:                                                                           │
│    GitHub Actions build output                                                      │
│                                                                                     │
│  World-drift detection:                                                             │
│    Principle established in ADR-030. No automated tooling yet.                      │
│    Detected manually during pipeline runs and Claude Code sessions.                 │
│                                                                                     │
│  [planned — not yet implemented]                                                    │
│    Structured observability: error tracking · analytics · user behavior             │
│    Automated world-consistency checks                                               │
│                                                                                     │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  REVERIFY + UPDATE LOOP                                                             │
│                                                                                     │
│  Trigger: drift detected in world model, narrative inconsistency,                   │
│           broken assumption, or schema gap                                          │
│                                                                                     │
│    ▼  Discuss with Claude Code                                                      │
│       surface the contradiction · propose resolution                               │
│       confirm scope before mutating anything                                        │
│                                                                                     │
│    ▼  Update ADR (or write new one)                                                 │
│       corrections are new events, not silent rewrites  (ADR-027)                   │
│       scar records preserved in museum if superseded                               │
│                                                                                     │
│    ▼  Rebuild projections                                                           │
│       next Vercel deploy picks up ADR changes                                       │
│       nightly pipeline picks up world model changes                                 │
│                                                                                     │
│  [planned — not yet implemented]                                                    │
│    Task tracking integration (Linear / GitHub Issues)                               │
│    Automated drift alerts                                                           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## What this diagram is

A true snapshot of the system as constituted on 2026-04-16.
Every unlabelled box exists in the repo. Every `[planned]` label is honest about what does not.

## What it is not

A target architecture. A sales deck. An aspirational sketch.
Those belong in ADRs. This belongs here.

## How to keep it true

When a `[planned]` block ships, move it to a real box and bump the version.
When the structure changes materially, write `docs/system-map-v1.1.md`.
Old versions are not deleted — they are scar tissue too.

## Key files referenced

| What | Where |
|---|---|
| ADR index | `docs/adrs/README.md` |
| Executor procedures | `docs/executor/procedures.md` |
| Executor craft + antipatterns | `docs/executor/craft.md` |
| Character baseline | `runs/root_2026_04_14/baseline/yy_baseline.json` |
| Pipeline skill | `/pipeline-go` (Claude Code skill) |
| JSON schemas | `schemas/` (repo root) |
| Build-time ADR reader | `lib/adrs.ts` |
| Build-time run reader | `lib/runs.ts` |
| llms.txt route | `app/llms.txt/route.ts` |
| Data API route | `app/yy/data/[...path]/route.ts` |
