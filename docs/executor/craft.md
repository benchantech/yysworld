# Executor Craft Reference

Context and judgment guidance for AI executors working on YY Branching World.
Read CLAUDE.md first. Return here for deeper orientation or task-specific judgment.

---

## Voice versioning — read before generating any narrative

**Voice is root-scoped.** The narrative register used in a root must remain consistent from the root's first day to its last. Do not apply new voice guidance to a root that has already published at least one day.

| Root | Voice version | Notes |
|------|--------------|-------|
| `root_2026_04_14` | v1 — literary restraint | Rides out as-is. Do not apply v2 rules. |
| `root_2026_05_*` and later | v2 — author voice (pending) | Rules to be added before May 1 run. |

**Gate for executor:** If `rootId == root_2026_04_14`, stop here and use the existing narrative antipatterns section below. Do not read or apply any v2 voice rules even if they appear later in this file.

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

## Narrative antipatterns (ADR-028)

These patterns caused the Day 2 artifacts to fail and were identified by reviewing the actual output. Check every narrative against this list before committing.

### 1. Event without physical landing

Translating a world event to a *concept* rather than a *sensory encounter*.

**Fail:** "The cache audit arrived." / "The obligation surfaced."
**Pass:** Another squirrel appeared at the cache site.

The event must be something YY could encounter with their body. Abstractions belong in YY's *response* to the event, not in the event itself.

### 2. Meta-commentary

Writing *about* a feeling from outside instead of rendering it from inside.

**Fail:** "the kind of fine that doesn't fix anything but technically counts"
**Fail:** "which is the main thing that's wrong with accounting"
**Pass:** The day adjusted slightly. Not recovered — adjusted. (Shows the shape; doesn't explain it.)

If the sentence could begin with "In other words," it's commentary. Cut it or replace it with something that shows.

### 3. Mechanical world event drops

Inserting real-world context as a standalone fact with no narrative connection.

**Fail:** "Someone mentioned World Art Day. Something about making things."
**Pass:** During that time there was a fence post nearby with marks scratched into it. (The event arrives through what YY encounters, not through an announcement.)

World events must enter through something YY sees, hears, or finds — not through a sentence that begins "Someone mentioned."

### 4. Recycled style closers

Reusing a structural trick from a previous day's ending.

**Fail:** Day 1 closes with "Suspicious. But fine." → Day 2 closes with "Suspicious. But good."

A device that worked before becomes visible as a device the second time. Earn each close independently.

### 5. Unexplained interiority

Italicized thoughts that appear without grounding or a clear referent.

**Fail:** `*Less than I thought.*` (Less than what? Established by nothing.)

If you use italicized interior thought, the referent must be active in the scene at that moment.

### 6. Telling the accounting

Describing the internal calculus rather than showing its effects.

**Fail:** "food below what it should be, attention below what it should be, everything working at a slight margin rather than normal capacity" — this is a status report, not experience.
**Pass:** The math is usually quick, but yesterday was still in the system — and what usually takes a second took three or four.

Show the speed or texture of the thinking, not the inputs to it.

### 7. Formula endings

Any closing that follows the pattern: "[statement]. [Short inversion or qualifier]." two days in a row.

"Classic." / "The day started anyway. The acorns did not." — these work in Day 1 because they're fresh. They stop working the moment they become the expected shape. Vary the structure of endings across days.

---

## Event translation checklist

Before writing a narrative, verify:

- [ ] The event can be described as something YY *sees, hears, smells, or encounters physically*
- [ ] The world-event anchor enters through an action or observation, not a sentence beginning "Something happened" or "Someone mentioned"
- [ ] The event produces genuinely different experiences in the two branches given their different starting states
- [ ] No closing devices from the previous day are reused verbatim or near-verbatim

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
