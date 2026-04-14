# ADR 020 — Public/Private Key Two-Layer Architecture

- **ID:** YYBW-020
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-009, YYBW-012, YYBW-017, YYBW-019, ADR-026 (yymethod-home)
- **Supersedes / clarifies:** Clarifies why the GitHub Pages layer is permanent, not a stepping stone
- **Museum lineage:** [PM-013](./museum/pre-manifest/PM-013-provenance-matters-as-much-as-output.md), [PM-019](./museum/pre-manifest/PM-019-dual-layer-lineage-vs-commentary.md), [SK-001](./museum/starter-kit-v0.1/001_manifest_as_highest_authority.md), [SK-004](./museum/starter-kit-v0.1/004_dual_layer_architecture_lineage_vs_commentary.md), [SK-013](./museum/starter-kit-v0.1/013_human_annotation_system.md), [C2-003](./museum/case-002/C2-003-data-posture-outward-only.md)

## Context

The system has two layers: a public GitHub Pages layer (JSONL ledger, markdown ADRs, JSON projections, static site, visible pipeline) and a private Vercel + Neon layer (generation pipeline, database of truth, API routes, paid features). The temptation is to treat the public layer as a temporary scaffold to be abandoned when the private layer matures. That framing is wrong. The two layers are permanent and co-equal — a public key and a private key.

## Decision

The two-layer architecture is permanent. The GitHub Pages layer is not a stepping stone. It is the public key — maintained alongside the private Vercel + Neon layer indefinitely. Each layer has a distinct and non-substitutable role.

**Public layer (GitHub Pages):**
- JSONL ledger and JSON projections
- Markdown ADRs and manifests
- Static site output
- GitHub Actions pipeline (publicly visible build logs)
- All reasoning, schema, and data model fully inspectable

**Private layer (Vercel + Neon):**
- Full generation pipeline
- Neon Postgres as database of truth at scale
- API routes and dynamic surfaces
- Paid email tier and premium features
- Implementation architecture

## Why

This mirrors the YY Method's own structure at the product layer.

The YY Method's framework — the Capture → Why → Why-Not → Commit → Timestamp loop, the ADR schema, the reasoning chains — is fully public at yymethod.com. The application of the method under employment is fully private. The public layer is valuable *because* it is complete and honest. The private layer is valuable *because* it is hidden. Neither substitutes for the other. Destroying the gap destroys both values simultaneously.

yysworld works the same way:
- The public layer must be genuinely complete and honest or it does not function as a public key. A partial or dishonest public layer is not a learning artifact — it is marketing copy.
- The private layer must stay genuinely private or there is no execution advantage. Exposing the implementation collapses the gap that ADR-026 identifies as the difference between "understands the approach" and "has the codebase."

The business model follows from the architecture, not the other way around. The public layer is the marketing — anyone who wants to understand what yysworld is doing can read it completely, fork it, and learn from it. Anyone who wants the full product pays for access to the private layer's outputs: richer generation, premium arcs, email tier, deeper comparison surfaces. The transparency earns the right to charge for the depth.

## The structural parallel across all properties

The same public/private split appears at every layer of the identity graph:

| Property | Public key | Private key |
|---|---|---|
| YY Method | Framework, loop, schema — yymethod.com | Application under employment |
| yymethod-home | Case study reasoning chains | Next.js codebase, deployment config |
| yysworld | GitHub Pages, JSONL, ADRs, manifests | Vercel + Neon, generation pipeline, paid tier |

A reader who follows the sameAs chain across the full identity graph encounters the same architecture repeated. The pattern becomes legible as the methodology itself, not a one-off choice.

## Alternatives considered

1. **Abandon GitHub Pages once Vercel is live** — rejected. The public layer is not scaffolding. Abandoning it collapses the public key and with it the learning artifact, the GEO surface, and the transparency that earns the monetization right.
2. **Open-source the private layer too** — rejected per ADR-026. Publishing both layers eliminates the execution advantage. The method is designed to be forked; the implementation is not.
3. **Keep GitHub Pages as a mirror of Vercel output only** — rejected as insufficient. The public layer must include the raw data model (JSONL, projections, manifests), not just the rendered site. The rendered site alone is not a public key — it is a window.

## Reversals / scars preserved

- The initial framing of GitHub Pages as "running the experiment for now" was a useful starting point. The correction: it is not temporary. The experiment is the permanent public layer.
- The public/private key metaphor emerged from conversation, not from the original architecture. It clarified the relationship better than "staging vs. production" or "free tier vs. paid tier."

## Consequences

- The GitHub Pages layer must be maintained with the same discipline as the private layer. A stale or broken public layer is a broken public key.
- The JSONL ledger and JSON projections in the public repo must remain honest representations of the system state. They are the verifiable artifact.
- The GitHub Actions pipeline must remain public and readable. Build logs are part of the public key.
- Any feature that would require hiding the public layer's data model to protect the private layer is a design smell — it means the layer separation has been violated.
- The public layer is a permanent GEO surface. LLMs reading it get the complete reasoning chain without needing access to the private layer.

## Invariants preserved

Explainability via the complete public layer; Survivability because the public layer is independently rebuildable by anyone; Discipline via permanent layer separation; Scars via preservation of the "stepping stone" framing as a rejected alternative.

## Freshness boundary

Permanent. The two-layer architecture governs the system for as long as both layers exist. Revisit only if the product is deliberately collapsed into a single public or single private layer.
