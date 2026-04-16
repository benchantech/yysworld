# ADR 030 — Drift Is Research: Governance Makes Drift Legible, Not Absent

- **ID:** YYBW-030
- **Status:** Decided
- **Date:** 2026-04-15
- **Scope:** YY Branching World
- **Depends on:** YYBW-029, YYBW-003, YYBW-011
- **Supersedes / clarifies:** Clarifies the purpose of world seeds and voice registers introduced in YYBW-029 — they are legibility tools, not control mechanisms

---

## Context

After designing the world seed and voice register (YYBW-029), the April 2026 run was framed as a gap — a root that started without proper governance. The natural next question was whether to tighten constraints immediately or run the month out.

The reframe: the April run drifting is not a failure to be managed. It is research data being collected. The drift will produce things that a pre-authored world seed would have prevented. Some of those things will be bad. Some will be genuinely interesting — hypotheses the author couldn't have written in advance. The east cache, the fence post marks, and "the question kept running" all emerged from freeform generation without any authorial intent behind them.

This ADR records two decisions that followed from that reframe, and the reasoning behind them.

---

## Decision

### 1. The April run completes as the intentional control condition

The April root runs to completion without retrofitted governance. It may drift. The drift is allowed and observed.

This is not passivity — it is deliberate. A run that drifts under no governance is the baseline against which every governed run will be compared. Without it, there is no way to know whether governance produced improvement or just produced consistency. Consistency and improvement are not the same thing.

The April run will eventually answer: what does this system produce when left to itself? That answer is worth more than a tidied-up first run.

### 2. First-generation governance should be tighter than comfortable

When the world seed and voice register are introduced at the next root, they should be tighter than the author expects to keep them long-term. This is intentional.

**The asymmetry of failure modes:**

Over-constraint produces *legible* failure. If the world seed is too rigid, the geography becomes a cage — the pipeline returns to the same locations mechanically rather than because they fit the day. If the voice register is too tight, the writing starts to feel performed — YY hitting the beats rather than the beats landing naturally. Both failures are visible in the output and diagnosable from the text.

Under-constraint produces *invisible* failure. Writing that is thin without a clear reason why. Voice that drifts toward the mean without any specific pattern to name. World that feels arbitrary without any single moment you can point to as wrong. The April run is evidence for what invisible failure looks like.

You can only reach over-constraint after having something tight enough to feel. The loosening is easy once you know which constraints are load-bearing. The tightening — discovering that you needed constraints you didn't have — is what the April run is teaching.

### 3. The loosening signals are named in advance

When the governance is too tight, the following will be visible:

**World seed too rigid:**
- Named places appear in the narrative because the pipeline is following the seed, not because the day needed that place
- No new geography emerges across an entire month — the world stops being discovered and starts being administered
- The `atmosphere` field becomes a formula the pipeline quotes rather than a context it draws from

**Voice register too tight:**
- The three-beat rhythm appears on every single passage regardless of state — compression that was earned becomes compression that is expected
- Reference quotes from the register start appearing near-verbatim in generated artifacts
- The randomly_eloquent trait (0.65) stops being random — eloquence becomes constant

When these signals appear, the correct response is to relax specific constraints, not to abandon the governance structure. The goal is a scaffold, not a cage.

### 4. Two modes are now explicit

The system has two legitimate operating modes:

**Governed runs** — authored world seed, active voice register, arc intention in authorial_intent, interactive pipeline confirmation. Maximally human. Family-shareable from Day 1. Reliable quality. The goal for production runs.

**Freeform runs** — no world seed, no voice register, pipeline generates freely. Drift-permissive. Generative research. Produces unexpected things, some of which are worth preserving, some of which are thin. The April 2026 run is this mode.

Both modes are valid. The freeform mode is not a lesser version of the governed mode — it is a different instrument for a different purpose. A freeform run is how you discover what needs to be governed. A governed run is how you make that governance worth having.

---

## Why

Governance structures that prevent drift are cages. Governance structures that make drift legible are instruments. The difference is whether the author can look at an unexpected element in the output and say: "this came from the seed" or "this came from somewhere outside the seed, and here's what that means."

The April run already produced both kinds of things: moments that clearly followed from the calibration (the voice compression, the territorial accounting) and moments that appeared from nowhere (the fence post marks, the thread about whether made things last). The second category is the one worth designing for. The world seed's value is that it makes the second category *visible* — you know it wasn't in the seed, so you know it's genuine emergence.

The first-generation governance being tight is not about control. It is about having something firm enough that the loosening teaches you something. You cannot learn which constraints are load-bearing by never having had constraints.

---

## Reversals / scars preserved

This ADR was written because the project initially framed the April run's lack of governance as a gap rather than as a baseline. The reframe happened in conversation on 2026-04-15, after the world seed and voice register were designed. The earlier framing is preserved in the commit history and in YYBW-029.

The fence post marks and "the question kept running" in the Day 2 alt rewrite — both of which emerged without any authorial world seed — are the evidence cited here that freeform mode produces things worth preserving. If those elements disappear under tight governance in May, that is a data point, not a success.

---

## Consequences

- The April run is the control condition. Its output — including any drift — is reference data for evaluating future governed runs.
- First-generation world seeds and voice registers should be written tight. The loosening signals in §3 are the criteria for revision.
- The question "is this governed run more *alive* than the April one, or just more *consistent*?" is now a standing evaluation criterion for every future root.
- Freeform runs remain available as a mode — for research, for starting new characters, for deliberate exploration without authorial commitment.

---

## Freshness boundary

Revisit after the first fully governed run completes (May 2026 or later). At that point there will be empirical data on whether the governance produced improvement or just consistency, and whether any of the loosening signals in §3 have fired.
