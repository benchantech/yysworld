# ADR 019 — yysworld Supersedes YY's World (Case-002) Entirely

- **ID:** YYBW-019
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-001, YYBW-002, YYBW-015
- **Supersedes:** Case-002 YY's World — kids-primary audience, COPPA-by-elimination, dandelion model (C2-002, C2-003, C2-004, C2-018, C2-019)
- **Museum lineage:** [C2-024](./museum/case-002/C2-024-supersession-yysworld-replaces-yys-world.md) ← terminal scar record from Case-002 side

## Context

Case-002 (yymethod-home) defined YY's World as a kids-only, read-only, outward-only property: primary audience ages 8–14, COPPA compliance by structural elimination, no data collection of any kind, no monetization, dandelion seeds with no tracking. That reasoning chain was coherent on its own terms. The product built in this repository is not that product.

yysworld (YY Branching World) is adult-facing, family-shareable, email-distributable, YouTube-Shorts-enabled, and aimed at building repeat daily behavior in a 14+ audience. It has monetization in scope from Phase 2. It is intended to appear in the sameAs identity graph for Ben Chan and the YY Method. None of that is compatible with the Case-002 architecture.

## Decision

yysworld supersedes Case-002's YY's World concept entirely. The kids-only, COPPA-by-elimination, dandelion model is abandoned. yysworld is the canonical YY's World property.

## Why

The kids-only framing forecloses too much. Case-002's dandelion model (C2-019) explicitly ruled out tracking, monetization, and identity inclusion on principle. Those are not foreclosures this product is willing to make. The Calvin-and-Hobbes model from C2-014 — "primary voice to kids, open to anyone" — was already pointing toward the adult audience as equally valid. That framing is elevated here, not discarded.

YY as protagonist and canonical anchor carries across. The audience restriction does not.

Adult-facing + family-shareable + 14+ floor achieves everything the Case-002 concept sought — warm, accessible, YY-anchored, not childish — without the constraints that blocked data collection and monetization. The same character. A different product posture.

## Alternatives considered

1. **Split model — keep kids site, also build adult site** — rejected. Two sites dilute energy and operator attention. The Calvin-and-Hobbes model already serves the widest possible audience from one product.
2. **Partial supersession — keep COPPA-by-elimination, allow email for adults only** — rejected. Maintaining two data postures on one site creates compliance complexity and architectural ambiguity. Clean break is better.
3. **Rename and rebrand away from YY's World** — rejected. yysworld is YY's World. The character and canon carry over. The product definition changes; the identity does not.

## Reversals / scars preserved

- Case-002's full ADR set (C2-001–C2-023) is preserved intact as a scar record in yymethod-home. The reasoning was coherent; the direction changed. C2-024 records the supersession.
- The outward-only posture (C2-003) was correct for the kids product being described. It is not correct for this product.
- The dandelion model (C2-019) captured something true about the founding impulse — content that gives without extracting. That spirit carries into yysworld at the content level, even as the business posture changes.
- The Calvin-and-Hobbes framing (C2-014) is the scar that was already right: "primary voice to kids, open to anyone." yysworld inverts the emphasis — primary audience is adults, open to anyone.

## Consequences

**Audience:** 14+ adults. Family-shareable. No child-directed content, copy, or design. The CLAUDE.md invariant "audience discipline — adult-facing, not childish" already enforces this.

**COPPA posture:** Not applicable. 14+ floor + adult-primary positioning + no child-directed content removes yysworld from COPPA's jurisdiction. Protection by positioning and age floor, not by structural elimination. Age attestation (simple "I confirm I am 14 or older") required at any data collection feature.

**Data posture:** Opt-in email with 14+ age attestation. Analytics permitted (Plausible or Vercel Analytics). Privacy policy required before any data collection feature launches. No data collection on the read-only static site itself — only at opt-in points.

**Monetization:** In scope from Phase 2. Email paid tier, premium arcs (Phase 4), YouTube Shorts channel monetization (separate from site — no conflict). "Immediate monetization" is no longer a non-goal — it is a scheduled goal with a phase assignment.

**sameAs identity:** yysworld is explicitly a Ben Chan property. Schema.org markup on the landing page links back to the canonical Person entity and the sameAs array (yymethod.com, yyand.me, benchantech.com, home.yymethod.com). This is detailed in a companion ADR.

**Case-002 in yymethod-home:** Status updated to Superseded. C2-024 filed as scar record. The case study is preserved in its entirety — the method applies to itself.

## Invariants preserved

Scars via preserved Case-002 ADR set and C2-024; Discipline via clean supersession rather than silent mutation; Explainability through explicit reasoning chain; Survivability by removing the business constraints that would have prevented traction.

## Freshness boundary

Stable. Revisit only if the product deliberately returns to a child-directed posture or COPPA's jurisdiction expands materially above age 13.
