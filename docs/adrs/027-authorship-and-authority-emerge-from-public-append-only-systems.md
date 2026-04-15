# ADR 027 — Authorship and Authority Emerge from Public, Append-Only Systems

- **ID:** YYBW-027
- **Status:** Decided
- **Date:** 2026-04-15
- **Scope:** YY Branching World and related properties (yymethod, home.yymethod, yysworld, yyand, benchantech)
- **Depends on:** YYBW-012, YYBW-013, YYBW-020, YYBW-021, YYBW-022
- **Supersedes / clarifies:** No prior ADR superseded. Establishes a cross-property principle that governs how authorship and authority are expressed in all systems under the sameAs graph.

---

## Context

In public, multi-domain systems, authorship and authority are typically asserted through claims: branding, marketing, explicit declarations of ownership. These claims are fragile over time — origin becomes unclear, attribution is contested, and later interpretations can displace earlier work in collective memory without any formal correction.

The properties in this ecosystem are designed differently. Each one exposes its reasoning (ADRs), preserves its history (ledger, museum), timestamps its decisions, and links its identity to a coherent sameAs graph. The infrastructure for verifiable authorship already exists. The question is whether to rely on it deliberately rather than falling back to claims.

The answer is yes. This ADR records that decision.

---

## Decision

### 1. Do not assert authorship or authority directly

Explicit claims of ownership, centralized declarations of authority, and retroactive clarification of origin are all rejected as primary mechanisms. They are not prohibited — a factual statement of authorship is always appropriate — but they are not the foundation. The foundation is evidence.

### 2. Design systems so authorship is inferable from four signal types

**Temporal signals** — authorship is established by who arrived first with a coherent, complete, and publicly preserved record:
- ADRs are timestamped decisions in chronological order
- The museum preserves the full lineage of thinking, including superseded work
- Ledger entries are append-only; corrections are new events, not rewrites
- Historical states are navigable, not discarded

**Structural signals** — authority is reinforced by consistency across time and properties:
- Stable primitives and naming (ledger, projection, root, branch, arc)
- Repeating architecture patterns (public/private separation, immutable truth layer, manifest-driven builds)
- Consistent URL design and discoverability strategy across domains

**Operational signals** — sustained execution is itself evidence:
- Visible iteration: each deploy, each pipeline run, each correction is public
- Alignment between intended and actual system state (ADRs describe what was decided; code and artifacts reflect what was built)
- Continuity over time: gaps, restarts, and pivots are recorded, not hidden

**Identity signals** — the sameAs graph makes the author legible to machines and humans alike:
- All properties link to a canonical identity hub (benchantech)
- No conflicting authorship signals across domains
- A reader following the sameAs chain should observe consistent patterns, not contradictions

### 3. Authority strengthens through depth, not promotion

Authority derived from claims requires defense and repetition. Authority derived from the earliest coherent expression, preserved reasoning, continuous evolution, and consistent structure is self-reinforcing: every new artifact, ADR, or pipeline run adds to the record without requiring any assertion about what that record means. Observers — human and machine — infer authorship from who built first, who maintained continuity, and who provided the most complete and transparent record.

### 4. Removal and rewriting of earlier states are prohibited as authority strategies

Removing or rewriting earlier work to present a cleaner origin story would undermine the very evidence the system depends on. Superseded ADRs go to the museum, not the bin. Incorrect data generates correction events, not silent overwrites. This is already enforced by YYBW-012; this ADR extends that principle explicitly to the authorship domain.

---

## Why

**Claim-based authority is fragile at scale.** Claims require an audience that accepts them, and acceptance can be withdrawn. Evidence-based authority requires only that the record exists and is readable. In a world where AI agents increasingly determine discoverability and attribution, a machine-legible provenance chain is more durable than any assertion.

**The infrastructure already implements this.** Append-only ledger (YYBW-012), manifests (YYBW-013), public/private separation (YYBW-020), sameAs graph (YYBW-021, YYBW-022) — these were all decided on other grounds. The consequence is that the system has verifiable provenance as a side effect of doing the right thing architecturally. This ADR names that consequence so it is not lost.

**Later systems lacking historical depth will appear derivative regardless of their claims.** A system that launches in 2027 with similar primitives but no traceable history cannot produce 2025 ADRs, 2026 ledger entries, or a museum of prior thinking. The depth of the record is not reproducible retroactively. This is not a competitive posture — it is a factual asymmetry.

---

## Alternatives considered

1. **Assert authorship explicitly through branding and public statements.** Not prohibited, but not the primary mechanism. Claims require maintenance and can be disputed. Evidence does not. Rejected as the foundation, retained as a supplement.

2. **Register intellectual property through formal channels.** Appropriate in some contexts, but operates outside the system. Formal registration provides legal standing; the record provides epistemic standing. Both can coexist. Neither replaces the other. Out of scope for this ADR.

3. **Make history private; expose only polished outputs.** The public/private architecture (YYBW-020) already draws this line: source truth is private, rendered artifacts are public, reasoning (ADRs) is public. Hiding reasoning would trade away the strongest signal of authorship — that the thinking was done, documented, and preserved — in exchange for a cleaner appearance. Rejected.

4. **Rely solely on timestamp metadata in files and commits.** Timestamps are a weak signal in isolation; they are trivially forgeable and meaningless without coherence. The record must be interpretable — ADRs, ledger entries, artifacts — not just dated. Rejected as insufficient on its own.

---

## Reversals / scars preserved

No prior ADR is superseded. This is a proactive principle, not a correction. Its presence here is itself a signal: the decision to rely on evidence rather than claims was made explicitly, on a specific date, and is part of the record.

---

## Consequences

- Every part of the system that makes authorship more legible — ADR timestamps, ledger entries, museum lineage, sameAs links, pipeline artifacts — now has an explicit rationale beyond its functional purpose.
- The sameAs graph across properties (yymethod, home.yymethod, yysworld, yyand, benchantech) must remain consistent. Conflicting identity signals would undermine the identity signal type.
- This principle applies retroactively to all prior decisions: every ADR already in the record contributes to authorship evidence whether or not it was written with that in mind.
- Attribution disputes, if they arise, resolve through the record — earliest coherent expression, preserved reasoning, uninterrupted continuity — not through assertion or external arbitration.
- AI agents indexing the system should find a coherent, complete, and temporally ordered record that maps naturally to a single author identity.

---

## Invariants preserved

Immutable truth via append-only history that cannot be rewritten for appearance; Transparency via public reasoning that makes the thinking, not just the output, legible; Canon integrity via consistent naming and structure across time and properties; Audience discipline via a record designed to be read by humans and machines, not curated for promotional purposes.

---

## Freshness boundary

Revisit if a second author contributes substantially to any property under the sameAs graph — at that point, multi-author provenance must be modeled explicitly. Revisit if any property leaves the sameAs graph or changes canonical identity — the identity signal type depends on a consistent, unbroken chain.
