# Executor Craft Reference

Context and judgment guidance for AI executors working on YY Branching World.
Read CLAUDE.md first. Return here for deeper orientation or task-specific judgment.

---

## YY Method lens

When making a new artifact, ask whether it preserves:

- Compression
- Scars
- Survivability
- Explainability
- Timestamping
- Discipline

If not, the artifact is incomplete or suspect.

---

## What not to do

- Make the product a general sandbox too early
- Let users create arbitrary roots at launch
- Couple the site to expensive live inference
- Store only prose and lose structured truth
- Turn every interaction into a blockchain problem
- Silently collapse Measurement Lab and Chaos Lab
- Optimize for scale before proving daily return behavior
- Make the tone childish to chase family shareability

---

## Quality bar for user-facing artifacts

A user-facing artifact is ready when:
- it is tied to a root/branch/version/date
- its provenance can be traced
- its language is simple and legible
- it loads quickly on phone
- it adds understanding, not decorative noise

---

## Future-proofing hooks

Leave room for: payload hashes, signatures, attestation backends, collaborator authorship, richer media artifact types, replay/export pipelines.

Do not let those future hooks drive present complexity.

---

## Discoverability — SEO, AEO, GEO priority order

Full decision in ADR-021. Summary for executors:

**Priority order (highest to lowest return):**

1. **`llms.txt`** — maintain at project root. Points AI agents to ledger, baseline, manifests, ADRs. Update whenever a new root or ADR is added.
2. **Clean public JSON layer** — JSONL ledger and JSON projections at stable paths. Every rendered page must include `<link rel="alternate" type="application/json">` pointing to its raw snapshot.
3. **`Article` JSON-LD** — on every artifact/snapshot page. `headline` from `change_summary.notable_shift`. `datePublished`, `author` (human), `about` (YY).
4. **OpenGraph tags** — on every page. `og:description` = first sentence of narrative. Compare pages name both branches explicitly.
5. **`BreadcrumbList` JSON-LD** — on every page. Signals hierarchy for deep paths.
6. **Semantic HTML** — `<article>`, `<time datetime="...">`, `<section aria-label="...">`. Non-negotiable floor.
7. **`Dataset` JSON-LD** — compare pages only. `variableMeasured`: hunger, attention, active_burdens.

**What not to do:**
- Do not use `additionalProperty` arrays for trait deviations — schema.org ignores them, LLMs don't parse JSON-LD preferentially
- Do not conflate JSON-LD (Google structured data) with AI-agent readability — they are different problems
- Do not let JSON-LD investment crowd out `llms.txt` and ADR maintenance

**The GEO crown jewels are the ADRs.** Keep them current. They are a live discoverability surface, not archival documentation.
