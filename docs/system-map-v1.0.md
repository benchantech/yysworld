# YY Branching World — System Map v1.0

**Version:** 1.0  
**Date:** 2026-04-16  
**Status:** current — reflects the repo as actually constituted  
**Next version:** when a layer changes structurally

Audience: humans and AI systems alike. Every box describes something that exists now
unless explicitly marked `[planned — not yet implemented]`.

---

```
                          ┌──────────────────────────────┐
                          │            YOU / BEN         │
                          │                              │
                          │  writes / approves ADRs      │
                          │  selects world events        │
                          │  approves artifacts          │
                          │  resolves ambiguity          │
                          └──────────────┬───────────────┘
                                         │
                                         ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            ADR GRAPH  (docs/adrs/)                                  │
│                                                                                     │
│  Active ADRs (31):                                                                  │
│    001-product-thesis-...md                                                         │
│    004-branches-arise-from-acquisitions-...md                                       │
│    021-url-structure-and-discoverability-...md                                      │
│    028-artifact-rewrite-and-event-translation-quality.md                            │
│    030-drift-is-research-governance-as-legibility-not-constraint.md                 │
│    031-source-event-as-required-event-field.md                                      │
│    ... (31 total, named YYBW-001 through YYBW-031)                                  │
│                                                                                     │
│  Each ADR contains:                                                                 │
│    - context (why this decision was needed)                                         │
│    - decision (what was decided)                                                    │
│    - consequences (what changes downstream)                                         │
│    - depends on (links to other ADRs by ID)                                         │
│    - status · date · scar records where applicable                                  │
│    - Pencil.dev links where UI decisions are involved                               │
│                                                                                     │
│  docs/adrs/README.md   ← navigable index                                            │
│  docs/adrs/museum/     ← 57 superseded ADRs (scar tissue, never deleted)            │
│                                                                                     │
│  ADRs serve as both reasoning records AND specs.                                    │
│  There is no separate /specs/ layer. Pencil.dev links live inside ADR files.        │
│  [planned: dedicated /specs/ layer as volume grows]                                 │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   │  parsed at build time by lib/adrs.ts
                                   │  + exposed via llms.txt (dynamic route)
                                   │
                          ┌────────┴─────────────────────────────────────────────────┐
                          │         KNOWLEDGE INDEX — current substitute              │
                          │                                                           │
                          │   lib/adrs.ts          reads docs/adrs/*.md at build     │
                          │   getActiveAdrs()      returns typed AdrMeta[]            │
                          │   app/llms.txt/route.ts  generates machine entry point   │
                          │   app/adrs/[slug]/     generates one page per ADR        │
                          │                                                           │
                          │   Enables: ADR discovery · dependency links ·            │
                          │   summaries · structured metadata in JSON-LD             │
                          └────────┬─────────────────────────────────────────────────┘
                                   │
                          ┌────────┴─────────────────────────────────────────────────┐
                          │   [planned — not yet implemented]                         │
                          │   RETRIEVAL LAYER                                         │
                          │                                                           │
                          │   - embeddings (pgvector / Pinecone)                     │
                          │   - metadata DB (ADR id, links, timestamps)              │
                          │   - graph edges (principle → decision → consequence)     │
                          │                                                           │
                          │   Would enable: semantic search · constraint             │
                          │   inheritance · ambiguity detection · foldout reasoning  │
                          └──────────────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    WORLD MODEL + LEDGER  (runs/root_YYYY_MM_DD/)                    │
│                                                                                     │
│  baseline/                                                                          │
│    yy_baseline.json          ← character: traits, values, calibration notes         │
│                                                                                     │
│  events/                                                                            │
│    evt_YYYY-MM-DD_NNN.json   ← immutable. one file per event. append-only.          │
│                                 includes: source_event (real-world anchor),         │
│                                 canonical_truth, perception_prompt, authorial_note  │
│                                                                                     │
│  branches/                                                                          │
│    branch_{rootId}_{id}.json ← current state: food · health · attention · burdens  │
│                                                                                     │
│  snapshots/                                                                         │
│    snap_{date}_{branchId}.json  ← state before + after per day, with provenance    │
│                                                                                     │
│  artifacts/                                                                         │
│    art_{date}_{branchId}_summary.json  ← narrative + state delta (human output)    │
│                                                                                     │
│  comparisons/                                                                       │
│    cmp_{date}_{day}_main_vs_{alt}.json  ← divergence summary per day               │
│                                                                                     │
│  decisions/                                                                         │
│    dec_{date}_NNN.json       ← branch evaluation + outcome (branched / not)        │
│                                                                                     │
│  inbox/                                                                             │
│    YYYY-MM-DD.json           ← queued author intent for next pipeline run           │
│                                                                                     │
│  schemas/  (repo root)                                                              │
│    world_event.schema.json · branch_state.schema.json · artifact.schema.json · …   │
│                                                                                     │
│  Derived from ADR reasoning. Truth may not be overwritten — only extended.          │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   │  read at build time by lib/runs.ts
                                   │  nightly: /pipeline-go writes new files here
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        PROJECTION LAYER  (Next.js build → Vercel)                   │
│                                                                                     │
│  app/  →  yysworld.com  (static export, deployed via Vercel)                        │
│                                                                                     │
│  Human pages:                                                                       │
│    /yy/{runDate}/{branch}/day/{N}/              narrative + state delta             │
│    /yy/{runDate}/vs/{a}/{b}/day/{N}/            branch comparison                  │
│    /adrs/{slug}/                                ADR detail                          │
│                                                                                     │
│  Machine-readable:                                                                  │
│    /yy/data/{YYYY-MM}/{branch}/day/{N}.json     artifact JSON (static)              │
│    /yy/data/{YYYY-MM}/vs/{a}/{b}/day/{N}.json   comparison JSON (static)            │
│    /yy/baseline.json                            character baseline JSON             │
│    /llms.txt                                    AI entry point (dynamic route)      │
│    /sitemap.xml                                 generated at build time             │
│    /feed.xml                                    RSS (latest artifacts)              │
│                                                                                     │
│  All human pages include <link rel="alternate" type="application/json">             │
│  pointing to the parallel machine-readable URL.                                     │
│                                                                                     │
│  Generated from world model + ADR graph. Never mutated directly.                    │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
          ┌────────────────────────┼──────────────────────────┐
          │                        │                          │
          ▼                        ▼                          ▼

┌──────────────────┐   ┌───────────────────────┐   ┌───────────────────────────────┐
│ Humans           │   │ AI systems            │   │ Claude Code sessions          │
│                  │   │                       │   │                               │
│ read site        │   │ /llms.txt             │   │ reads ADRs · reads runs/      │
│ narrative view   │   │ /yy/data/ JSON API    │   │ runs /pipeline-go             │
│ compare branches │   │ /yy/baseline.json     │   │ writes files · commits        │
│ explore ADRs     │   │ /sitemap.xml          │   │ proposes · awaits approval    │
└──────────────────┘   └───────────────────────┘   └───────────────────────┬───────┘
                                                                            │
                                                          [planned — not yet implemented]
                                                          named Claude agents:
                                                          "Pipeline Executor"
                                                          "ADR Drafter"
                                                          "Branch Analyst"
                                                                            │
                                                                            ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      ADRs AS SPECS + DESIGN LAYER                                   │
│                                                                                     │
│  docs/adrs/{slug}.md  ← each ADR includes, where relevant:                         │
│    - context + goal                                                                 │
│    - decision + why-not                                                             │
│    - constraints inherited from earlier ADRs (via depends-on)                      │
│    - affected world entities (character, branch, event, artifact)                  │
│    - Pencil.dev link (UI/flow design, when applicable)                              │
│    - acceptance criteria (consequences section)                                    │
│                                                                                     │
│  [planned: dedicated /specs/ layer once ADR volume exceeds manageable scope]        │
└──────────────────────────────────┬──────────────────────────────────────────────────┘
                                   │
                                   ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           DESIGN + EXECUTION STACK                                  │
│                                                                                     │
│  ┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────────┐  │
│  │ Pencil.dev      │     │ Claude Code          │     │ GitHub Repo             │  │
│  │                 │────▶│                      │────▶│                         │  │
│  │ UI + flows      │     │ reads CLAUDE.md       │     │ app/       (site)        │  │
│  │ linked from     │     │ reads docs/adrs/      │     │ runs/      (world model) │  │
│  │ ADR files       │     │ reads runs/           │     │ docs/adrs/ (ADR graph)   │  │
│  │                 │     │ edits files           │     │ components/ lib/         │  │
│  └─────────────────┘     │ commits to main       │     │ schemas/   pipeline/     │  │
│                           └──────────┬───────────┘     └────────────┬────────────┘  │
│                                      │                              │               │
│                                      ▼                              ▼               │
│                                 GitHub PR                    Vercel build           │
│                                      │                              │               │
│                                      ▼                              ▼               │
│                                    Merge                    Deploy → yysworld.com   │
└──────────────────────────────────────┼──────────────────────────────────────────────┘
                                       │
                                       ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          PRODUCTION + OBSERVABILITY                                  │
│                                                                                     │
│  Current:                                                                           │
│    Vercel deploy logs (basic — available via Vercel dashboard)                      │
│    GitHub Actions build output                                                      │
│                                                                                     │
│  World-drift detection:                                                             │
│    Principle established in ADR-030. No automated tooling yet.                      │
│    Detected manually during pipeline runs and Claude Code sessions.                 │
│                                                                                     │
│  [planned — not yet implemented]                                                    │
│    Structured observability (error tracking, analytics, user behavior)              │
│    Automated world-consistency checks                                                │
└──────────────────────────────────────┬──────────────────────────────────────────────┘
                                       │
                                       ▼

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            REVERIFY + UPDATE LOOP                                   │
│                                                                                     │
│  Trigger: drift detected in world model, narrative inconsistency,                   │
│           broken assumption, or schema gap (e.g. ADR-031 source_event patch)        │
│                                                                                     │
│        ▼                                                                            │
│  Discuss with Claude Code                                                           │
│    — surface the contradiction                                                      │
│    — propose resolution                                                             │
│    — confirm scope before mutating anything                                         │
│        ▼                                                                            │
│  Update ADR (or write new one)                                                      │
│    — corrections are new events, not silent rewrites (ADR-027)                      │
│    — scar records preserved in museum if superseded                                 │
│        ▼                                                                            │
│  Rebuild projections                                                                │
│    — next Vercel deploy picks up ADR changes                                        │
│    — nightly pipeline picks up world model changes                                  │
│                                                                                     │
│  [planned — not yet implemented]                                                    │
│    Task tracking integration (Linear / GitHub Issues)                               │
│    Automated drift alerts                                                           │
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
