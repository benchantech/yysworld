# ADR 028 — Narrative Artifacts Are Projections; Event Translation Requires Physical Presence

- **ID:** YYBW-028
- **Status:** Decided
- **Date:** 2026-04-15
- **Scope:** YY Branching World
- **Depends on:** YYBW-012, YYBW-007, YYBW-005
- **Supersedes / clarifies:** None — establishes new rule for narrative quality and event translation

---

## Context

On 2026-04-15, the Day 2 artifacts for both branches were reviewed before publication and found to be significantly below quality bar. This ADR documents what failed, why rewriting was permitted, and the rules it establishes going forward.

### What failed in Day 2

**1. The event translation had no physical presence.**

Tax Day (April 15) was translated into "cache audit" — an obligation surface, a bureaucratic concept. A squirrel does not experience a cache audit. The concept arrived in the narrative without sensory grounding, producing prose that circled abstractions rather than rendered experience. Readers encounter YY through specific, physical things. The cache audit gave the writing nothing physical to land on.

**2. The prose became self-aware in the wrong way.**

Several passages described the emotional situation from a remove rather than putting the reader inside it:

- *"The math was the math. You can't argue with the accounting, which is the main thing that's wrong with accounting."*
- *"The kind of fine that doesn't fix anything but technically counts."*
- *"The wavefunction collapsed in my favor."*

These are the writer narrating rather than YY experiencing. The voice stepped slightly outside the character to comment on the situation.

**3. World events were dropped mechanically.**

"Someone mentioned World Art Day. Something about making things." appears in both branches as an almost identical standalone sentence with no connection to what surrounds it. By contrast, Day 1's quantum day notification arrived mid-cache — while eating — so the idea landed in context, inside an action.

**4. Style patterns became formulas.**

Day 2 alt ended "Suspicious. But good." — a variant of Day 1's closer "Suspicious. But fine." Earned compression in Day 1 became visible technique in Day 2. Reusing structural tricks from the previous day weakens both.

**5. Italicized intrusion with unclear referent.**

`*Less than I thought.*` appeared as a sudden italicized thought without a clear referent or grounding.

---

## Decision

### 1. Rewrite Day 2 artifacts

Narrative artifacts are projections, not ledger truth. CLAUDE.md is explicit:

> "ledger entries are append-only; corrections are new events; **projections may be rebuilt**, truth may not be overwritten."

The Day 2 artifacts were rewritten. All provenance fields, snapshot references, state data, and structural metadata were preserved unchanged. Only the `content` fields (title, tone, narrative, state_note, summary, state_delta) were replaced.

A correction event (`evt_2026-04-15_002`, type: `territorial_encounter`) was appended, superseding the original event abstraction (`evt_2026-04-15_001`, type: `obligation_surface`). The original event file is preserved unchanged — it is superseded, not deleted.

Branch file `identity_notes` were updated to reflect the new narrative frame. These are mutable current-state fields, updated every pipeline run by design.

### 2. Event translation rule: physical presence required

Every event used as a story anchor must produce a physical encounter in YY's world. The translation from real-world event to YY-world event must yield something YY could encounter with their body — a sight, a sound, another animal, a specific location, a change in the environment.

**The rule:** the event should be something YY encounters, not something YY conceptually knows about.

| Real-world event | Weak translation | Strong translation |
|---|---|---|
| Tax Day | "The cache audit arrived" | Another squirrel appeared at a cache site |
| A major holiday | "The festive energy was noticeable" | More animals than usual on the main path |
| A cultural moment | "Something was announced" | A sound from a neighboring territory |
| A scientific discovery | "The concept arrived via notification" | A change in how some familiar thing behaves |

Abstractions are permitted in the *narrative's response* to an event — YY can think in abstractions, make connections, draw conclusions. The abstraction belongs in the character's mind, not in the event trigger.

### 3. Antipatterns documented in craft.md

The specific prose patterns that produced Day 2's failures are now listed as a named antipattern registry in `docs/executor/craft.md`. The pipeline prompt (`/pipeline-go`) and automated pipeline system prompt will reference this document.

---

## Why we didn't leave it alone

Day 2 was not yet published when the quality issue was caught. The artifacts existed in the repository and were ?preview-accessible, but had not passed their midnight gate. The rewrite cost was low; the reader cost of thin Day 2 writing — particularly for a reader encountering the project for the first time — is substantially higher.

Leaving poor artifacts in place would also establish a floor. If the system accepts writing at Day 2's original quality as "good enough," the pipeline has no quality gradient to pull toward. The rewrite makes the expected standard concrete.

Additionally: the product is described as "gentle on the surface and exacting underneath." The surface is the writing. If the writing is below quality, the system's exacting substrate is irrelevant to the reader.

---

## Alternatives considered

**Leave Day 2 as-is, improve Day 3 forward.**
Rejected. Day 2 publishes tomorrow. The rewrite cost is an afternoon; the reader cost accumulates from the moment Day 2 goes live. An audience builds from Day 1 forward — what they read shapes whether they return.

**Keep the event abstraction, improve only the prose.**
Rejected. The prose failures were downstream of the event choice. "Cache audit" provided no physical platform to write from. Improving the prose while keeping the event would require inventing grounding that the event didn't supply — which is the same as changing the event.

**Document the failure and move on without rewriting.**
The documentation happens regardless (this ADR). Moving on without rewriting treats the quality bar as aspirational rather than operational.

---

## Reversals / scars preserved

- The original Day 2 artifacts (`art_2026-04-15_*`) were rewritten on 2026-04-15. The original content is preserved in git history. The current files reflect the rewritten versions. `supersedes_content_from` and `content_rewritten_at` fields were added to both artifact files to mark the correction.
- The original event (`evt_2026-04-15_001`, type: `obligation_surface`) is preserved unchanged and superseded by `evt_2026-04-15_002`. Both files remain in the repository.
- The original branch `identity_notes` (referencing "audit confirmed what the body already knew") are replaced. They are recoverable from git history.

---

## Consequences

- Day 2 artifacts are of acceptable quality and will publish on schedule.
- The physical-presence rule for events constrains event choices usefully: it forces the author (and the pipeline) to find a sensory translation, not a conceptual one.
- The antipattern registry in craft.md gives the `/pipeline-go` confirmation step a concrete checklist to check proposed narratives against before committing.
- The `supersedes_content_from` / `content_rewritten_at` fields are now available as a convention for future artifact corrections.

---

## Freshness boundary

Revisit if a future YY story intentionally uses an event that is received information rather than a physical encounter (YY reads something, YY hears news). In that case, the physical presence is in the *act of reading or hearing*, not in the information itself. The rule governs the translation layer; it does not ban abstract content from appearing in narratives.
