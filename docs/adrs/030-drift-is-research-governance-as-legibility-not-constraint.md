# ADR 030 — Drift Is Research: Governance Makes Drift Legible, Not Absent

- **ID:** YYBW-030
- **Status:** Decided
- **Date:** 2026-04-15
- **Amended:** 2026-04-15 — §5 added: May experimental design
- **Scope:** YY Branching World
- **Depends on:** YYBW-029, YYBW-003, YYBW-011, YYBW-012
- **Supersedes / clarifies:** Clarifies the purpose of world seeds and voice registers introduced in YYBW-029 — they are legibility tools, not control mechanisms. §5 establishes the May 2026 experimental design for validating the voice register specifically.

---

## Context

After designing the world seed and voice register (YYBW-029), the April 2026 run was framed as a gap — a root that started without proper governance. The natural next question was whether to tighten constraints immediately or run the month out.

The reframe: the April run drifting is not a failure to be managed. It is research data being collected. The drift will produce things that a pre-authored world seed would have prevented. Some of those things will be bad. Some will be genuinely interesting — hypotheses the author couldn't have written in advance. The east cache, the fence post marks, and "the question kept running" all emerged from freeform generation without any authorial intent behind them.

This ADR records the decisions that followed from that reframe, and the reasoning behind them.

---

## Decision

### 1. The April run completes as the intentional control condition

The April root runs to completion without retrofitted governance. It may drift. The drift is allowed and observed.

This is not passivity — it is deliberate. A run that drifts under no governance is the baseline against which every governed run will be compared. Without it, there is no way to know whether governance produced improvement or just produced consistency. Consistency and improvement are not the same thing.

The April run will eventually answer: what does this system produce when left to itself? That answer is worth more than a tidied-up first run.

### 2. First-generation governance should be tighter than comfortable

When the world seed and voice register are introduced, they should be tighter than the author expects to keep them long-term. This is intentional.

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

### 5. May 2026: the voice register experiment

The May 2026 run introduces a new structure: two simultaneous roots for the same month, differing in exactly one variable. This is the first controlled experiment in the system's governance design.

**The design:**

| | Root A (`2026-05-01`) | Root B (`2026-05-01-1`) |
|---|---|---|
| World seed | None | None |
| YY baseline | v1.0 | v1.0 |
| Voice register | Not active | Active (v1.1) |
| Starting conditions | Same | Same |
| Real-world event anchors | Same | Same |
| Alt branch structure | Mirrored | Mirrored |

The single independent variable is the voice register. Everything else is held constant.

No world seed is introduced in May. The decision to defer the world seed is deliberate: testing two variables simultaneously (voice and world) would make it impossible to attribute differences to either one. Voice governance is the higher priority — if the voice register doesn't improve the writing, designing a world seed is premature. Voice first.

**Why two simultaneous roots rather than sequential:**

Sequential comparison (April freeform → May governed) is asymmetric: different months, different seasons, different real-world anchors, different author familiarity. Any improvement in May could be attributed to those factors rather than to governance.

Two simultaneous roots in the same month, on the same events, with the same character, isolate governance as the variable. The comparison is live and symmetric rather than retrospective and confounded.

**The roles of each root:**

Root A (no voice register) produces the *logic* — what happened, the state transitions, the mechanical truth of the day. This is the control.

Root B (voice register active) tells the same story in a *more controlled voice*. Same canonical truth; different projection. This is the hypothesis.

The hypothesis: the voice register produces narratives that are more alive and more human while covering the same ground. If Root B is measurably better, the register is validated. If they are roughly equivalent, the register is overhead.

**On mirroring the alt branches:**

The alt branches in both roots must follow the same divergence events at the same story days. If Root A's alt1 branches on Day 7 from a particular event, Root B's alt1 branches on Day 7 from the same event. If the branches diverge independently, differences between roots could be attributed to story trajectory rather than voice governance.

Mirroring is the constraint that makes the experiment legible. It requires the author to run Root A first on a given day, then use the same event and approximate state transitions as input for Root B.

**On the truth/projection separation:**

ADR-012 established that the canonical truth layer (snapshots, state transitions) and the projection layer (narrative artifacts) are distinct. The May experiment is possible precisely because of this separation. Both roots can share the same truth (same event, same state values) while differing only in the artifact — the prose generated from that truth.

The purest version of the experiment: identical snapshot data in both roots, different artifacts. Root A's artifact is generated without the voice register; Root B's artifact is generated with it. The canonical truth is the control. The artifact is the variable.

**What the May experiment does not test:**

- World seed value — deliberately deferred to a future run
- Character version differences — both roots use YY v1.0
- Seasonal or temporal variation — same month, same events

These become available as variables in subsequent experiments once voice governance is validated or refuted.

---

## Why

Governance structures that prevent drift are cages. Governance structures that make drift legible are instruments. The difference is whether the author can look at an unexpected element in the output and say: "this came from the seed" or "this came from somewhere outside the seed, and here's what that means."

The April run already produced both kinds of things: moments that clearly followed from the calibration (the voice compression, the territorial accounting) and moments that appeared from nowhere (the fence post marks, the thread about whether made things last). The second category is the one worth designing for.

The May experiment is the first opportunity to find out whether the governance adds to the first category or diminishes the second. That is worth knowing precisely.

---

## Reversals / scars preserved

This ADR was written because the project initially framed the April run's lack of governance as a gap rather than as a baseline. The reframe happened in conversation on 2026-04-15.

The fence post marks and "the question kept running" in the Day 2 alt rewrite — both of which emerged without any authorial governance — are the evidence cited here that freeform mode produces things worth preserving. If those elements disappear under voice governance in May's Root B, that is a data point, not a success.

The May experimental design was also refined through deliberate pushback: an earlier proposal to run two roots with *different world seeds* was set aside in favor of two roots with *no world seed but different voice governance*. The world seed introduces a second variable; the clean experiment requires exactly one.

---

## Consequences

- The April run is the control condition. Its output — including drift — is reference data for evaluating future governed runs.
- May 2026 runs two simultaneous roots: `2026-05-01` (no voice register) and `2026-05-01-1` (voice register active). No world seed in either.
- Alt branches in both May roots are mirrored at the same divergence events on the same story days.
- Root A sets the canonical truth; Root B regenerates the artifact through the voice register.
- The question "is this governed run more *alive* than the control, or just more *consistent*?" is the standing evaluation criterion.
- If the voice register validates: world seed becomes the next variable in a future run.
- If the voice register does not validate: the register is revised before the world seed is introduced.
- Freeform runs remain available as a mode for research and new character exploration.

---

## Freshness boundary

Revisit after May 2026 completes. At that point there will be empirical data on whether voice governance produced improvement or consistency, and whether any loosening signals in §3 fired. The world seed experiment design follows from whatever May teaches.
