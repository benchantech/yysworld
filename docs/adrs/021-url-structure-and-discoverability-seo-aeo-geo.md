# ADR 021 — URL Structure and Discoverability: SEO, AEO, GEO Priority Order

- **ID:** YYBW-021
- **Status:** Decided
- **Date:** 2026-04-14
- **Scope:** YY Branching World
- **Depends on:** YYBW-008, YYBW-009, YYBW-012, YYBW-013, YYBW-016, YYBW-017, YYBW-020
- **Museum lineage:** [C2-003](./museum/case-002/C2-003-data-posture-outward-only.md), [C2-016](./museum/case-002/C2-016-six-invariants-dna.md)

## Context

As the site approaches launch, three distinct discoverability problems must be resolved:

1. **SEO** — how traditional search engines (Google, Bing) index and rank pages
2. **AEO** — how answer engines (Perplexity, SearchGPT) surface content in direct answers
3. **GEO** — how generative engines (Claude, GPT, Gemini via crawl/RAG) and runtime AI agents read and reason about the system

The initial instinct was to "max JSON-LD" as the discoverability solution. That framing was revised: JSON-LD optimizes for Google structured data, which solves SEO and partial AEO — but is not the primary lever for GEO or AI agent readability. Conflating the three problems leads to over-investment in the wrong layer.

## Decision

Adopt a layered discoverability strategy with an explicit priority order. Each layer solves a different reader's needs with a different format.

### Priority order

**1. `llms.txt` at the project root — GEO, AI agents**

A single file that tells LLMs exactly where the structured truth lives: ledger, baseline, manifests, ADRs. One-stop entry point for any AI agent crawling the site. This is the highest-leverage GEO action because it makes the full reasoning chain discoverable without requiring inference across many pages.

**2. Clean public JSON layer — GEO, AI agents**

The JSONL ledger and JSON projections at stable, predictable paths (per YYBW-020). These are already designed for machine consumption. The key is discoverability: link from `llms.txt`, sitemap, and `<link rel="alternate" type="application/json">` on every corresponding page.

**3. `Article` JSON-LD on every artifact/snapshot page — SEO, AEO**

Each day's artifact page gets structured `Article` markup with `headline` from `change_summary.notable_shift`, `datePublished`, `author` (human), and `about` pointing to YY. This is what Google reads for rich results and what Perplexity uses for citations.

**4. OpenGraph tags on every page — AEO, social distribution**

Perplexity, iMessage, Slack, and email clients all read OG tags. Every page gets `og:title`, `og:description` (first sentence of narrative), `og:type`, and `og:url`. Compare pages get special treatment: OG description names both branches explicitly.

**5. `BreadcrumbList` JSON-LD everywhere — SEO, AEO**

Signals page hierarchy to crawlers. Especially important for deep paths like `/root/2026-04/time-slip/day/7`. Breadcrumbs help answer engines understand the navigation model without inferring it from URL structure.

**6. Semantic HTML — SEO, GEO, accessibility**

`<article>`, `<time datetime="...">`, `<section aria-label="branch comparison">`. LLM crawlers read DOM structure. A well-structured page without JSON-LD outperforms a poorly-structured page with maxed JSON-LD. Semantic HTML is the floor, not an afterthought.

**7. `Dataset` JSON-LD on compare pages only — SEO**

Compare pages (`/root/2026-04/compare/main/time-slip`) are the most distinctive content type. `Dataset` markup with `variableMeasured` (hunger, attention, active_burdens) signals structured comparison content to Google. Limited to compare pages — not appropriate for narrative artifact pages.

### URL structure

```
/                                            home — latest day, main branch
/yy                                          character page — baseline, identity, version history
/root/2026-04                                root overview — all branches, all days
/root/2026-04/main                           main branch timeline
/root/2026-04/main/day/1                     specific day snapshot (stable, immutable once published)
/root/2026-04/time-slip                      named branch timeline
/root/2026-04/time-slip/day/1               that branch on day 1
/root/2026-04/compare/main/time-slip         branch comparison (first-class URL)
/root/2026-04/compare/main/time-slip/day/1  day-specific comparison
```

Machine-readable (public layer):
```
/root/2026-04/ledger.jsonl                   append-only event ledger
/root/2026-04/manifest.json                  build/publish manifest
/root/2026-04/main/day/1.json               raw snapshot projection
/yy/baseline.json                            character baseline
/adrs/                                       ADRs — human and AI-readable reasoning chains
/sitemap.xml                                 generated nightly
/llms.txt                                    AI agent entry point
```

URLs mirror the data model exactly (`root_id`, `branch_id`, `story_day`). No human-facing name layer is added over it. The date-based root slug (`2026-04`) is honest and matches the ledger — the tradeoff of exposing internal time-segmentation is accepted in favor of model consistency and provenance clarity.

Branch names in URLs are short and descriptive — they name the divergence, not the date. Examples: `time-slip`, `guarded`, `early-riser`.

### JSON-LD schema map

| Page type | JSON-LD types |
|---|---|
| Every page | `BreadcrumbList`, `WebSite` (home only) |
| Snapshot/artifact | `Article` |
| Compare | `Dataset` |
| Character (`/yy`) | `Person` (fictional, noted as such) |
| Home | `WebSite` with `SearchAction` |

`additionalProperty` arrays for trait deviations or mutation types: **not used**. schema.org ignores them; LLMs don't parse JSON-LD preferentially. Visible structured text (tables, headings) serves GEO better.

### The GEO crown jewels

The ADRs are the highest-value GEO asset — complete reasoning chains with decisions, alternatives considered, and invariants preserved. An LLM reading `/adrs/` understands yysworld more fully than one reading a hundred JSON-LD `Article` blocks. ADRs must be kept current, honest, and linkable from `llms.txt`.

This is a structural GEO advantage most products do not have. It must not be neglected in favor of surface-layer JSON-LD investment.

### Distribution handoff URLs (per YYBW-016)

```
YouTube Shorts  →  /root/2026-04/compare/main/time-slip/day/1
Daily email     →  /root/2026-04/main/day/15
Home/feed       →  /
```

Compare pages are the primary YouTube Shorts landing target — they show divergence, which is the product's core idea.

## Why

JSON-LD is not AI readability. Conflating them leads to:
- over-investment in schema.org markup that LLMs don't parse preferentially
- under-investment in `llms.txt` and clean JSON endpoints that LLMs actually use
- neglect of the ADRs as GEO surface

The priority order reflects four distinct readers with four distinct parsers. Each layer solves one or two reader problems, not all four simultaneously.

## Alternatives considered

1. **Max JSON-LD everywhere** — rejected. Solves SEO and partial AEO but not GEO or runtime AI agents. Over-investment in the wrong layer.
2. **Human-facing arc names over data-model URLs** — rejected. Adds indirection, breaks model consistency, and conflicts with provenance clarity. The date-based slug is honest.
3. **GEO-only focus, minimal JSON-LD** — rejected. Google rich results still matter for initial distribution. SEO and AEO are not irrelevant.
4. **Single unified metadata format** — rejected. No format satisfies all four readers equally well. Layer separation is the right answer.

## Reversals / scars preserved

- The initial framing of "max JSON-LD" was a useful starting point. The correction: JSON-LD is layer 3, not layer 1.
- The distinction between JSON-LD (Google structured data) and AI-agent readability (a different problem) was the key clarification.
- `llms.txt` as priority 1 reflects the emerging standard for GEO, not a speculative bet.

## Consequences

- `llms.txt` must be written and maintained alongside ADRs.
- Every rendered page needs OG tags and BreadcrumbList at minimum.
- Artifact pages need `Article` JSON-LD generated from snapshot fields.
- Compare pages need `Dataset` JSON-LD.
- The public JSONL layer needs `<link rel="alternate" type="application/json">` links from corresponding rendered pages.
- Sitemap generated nightly from published snapshots.
- ADRs must remain current — they are a live GEO surface, not archival documentation.

## Invariants preserved

Explainability through the full public layer and ADR reasoning chains; Discipline via explicit priority order and rejection of "max JSON-LD" as a single-layer solution; Compression by matching format to reader rather than one format for all.

## Freshness boundary

Stable for launch. Revisit if `llms.txt` is superseded by a different AI-readability standard, or if Google introduces new schema.org types relevant to branching narrative content.
