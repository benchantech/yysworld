# ADR-033 — Pipeline-Go Corrections: Date Trust, Stat Completeness, Auto-Execution

**Status:** Accepted  
**Date:** 2026-04-19  
**Affects:** pipeline-go skill, nightly pipeline execution discipline

---

## Context

During the April 19, 2026 pipeline session, three failures required live correction by the author:

1. **Wrong date used for web search.** The system context reported `currentDate = 2026-04-18`. Today was actually April 19. The pipeline searched for news on the wrong date, returning stale results. The author had to correct it explicitly.

2. **Health omitted from state shift proposal.** When proposing the heat wave day, the pipeline included food and attention in the shift line but not health. The author caught it: "shouldn't YY's health go down as well because of the heat?" Health was added only after the correction.

3. **Phase transition required author intervention.** When Phase 1 was already complete, the pipeline presented a numbered menu ("three options: 1, 2, 3") instead of transitioning automatically. The author had to type "2" to proceed. The pipeline also required explicit confirmation at the READY TO COMMIT step before generating.

All three were corrected in the same session. The skill was updated after the run.

---

## Why Each Failure Happened

### Date trust

The pipeline accepted `currentDate` from the system context without verification. System context dates can be stale — they reflect when the session was initialized, not necessarily when the user is running the pipeline. On April 19, the context still carried April 18 from a prior session initialization. The pipeline treated it as authoritative.

This is a narrow but repeatable failure mode. Every time the user runs the pipeline near midnight or picks it up after a context gap, the session date may be wrong. The pipeline's first action — the live web search — depends entirely on having the correct date.

### Health omission

The shift proposal template in Step 6 read:

```
shift:  food {f}→{f2} · attention {a}→{a2}
```

Health was not listed as a required field in the shift line. The pipeline inferred it was optional and omitted it when the day's primary driver (heat) didn't have an explicit health narrative attached. This was wrong: health responds to exertion, environmental stress, and food pressure continuously. It is never static across a full day. Leaving it out of the proposal made it easy to leave it out of the state delta — and would have made it easy to silently skip health degradation in the generated snapshot.

The template itself encoded the omission. The pipeline followed the template.

### Auto-execution

The pipeline was designed with multiple confirmation gates: READY TO COMMIT (Step 8) and the Phase 1 / Phase 2 branch decision. These were added conservatively, treating every decision as potentially reversible. In practice, the author confirmed every proposal without modification and found the gates friction without value. The menu on Phase 1 completion ("three options") was not in the spec — the pipeline improvised it when it detected an ambiguous state, which was worse than the spec's original instruction.

---

## Why Not Leave As-Is

### On date trust

Leaving the system context date as authoritative means the pipeline will silently run web searches on the wrong date every time there is a session gap. The user will receive a list of yesterday's news when they asked for today's. Event anchors written into inbox files will reference the wrong real-world date. The downstream content will be correct in structure but wrong in provenance. This violates canonical invariant 5 (story date and generation date must not be conflated) and invariant 7 (build determinism — no hidden state).

A one-line date confirmation costs two seconds. A wrong event anchor written into a snapshot is a scar that cannot be corrected without a new event or a retroactive note.

### On health omission

A state system with three variables that only updates two of them per day is not a state system — it is a two-variable system with a decorative third field. Health degradation from environmental pressure, heat, foraging exertion, and resource scarcity is continuous and physically grounded. If the template does not require it, the generator will omit it whenever there is no explicit health narrative cue, which is most days.

Over time, this produces a health field that only moves when something dramatic happens (injury, illness) and sits static otherwise. That is not how bodies work and it is not what the system was designed to track. The author catching the omission on day 6 was early. Left uncorrected, it would have silently accumulated into a health track that requires retroactive rewriting or a scar record to explain the sudden correction.

Requiring all three stats in every shift line costs nothing and prevents a class of omissions that compound quietly.

### On auto-execution

The READY TO COMMIT gate existed to protect against accidental generation. In a system where every proposal step is already gated with enter-to-accept, a final confirmation gate is redundant. It adds a step that has never once been used to stop a generation — it has only ever been used to start one. A gate that is never tripped is not a safety mechanism; it is latency.

The Phase 1 / Phase 2 menu was worse: it introduced author cognitive load at the moment the author most wants the pipeline to proceed. When the pipeline detects that Phase 1 is already complete, the correct behavior is to say so briefly and continue — not to present options. Options require a decision. The decision was already made when the author ran the pipeline.

The unit test gate (Step 13b) replaces improvised human verification with automated schema and convention checking. Running 103 tests after generation and before commit is the correct confirmation mechanism — not a free-text "enter to proceed."

---

## Decisions

1. **Step 1 confirms date explicitly.** The pipeline asks the author to confirm today's date before proceeding. System context date is treated as a suggestion, not a fact.

2. **All three stats required in every shift proposal.** The template now lists `food · health · attention` in the shift line with an explicit note that health is never optional. Environmental pressure, exertion, and resource stress affect all three.

3. **READY TO COMMIT gate removed.** After all per-branch proposals and the branch evaluation are accepted, the pipeline proceeds directly to generation. No intermediate confirmation.

4. **Phase 1 already-complete path transitions directly to Phase 2.** No menu. The pipeline states what was published and moves on.

5. **Unit tests run before commit.** `npm test` (vitest) runs after all files are written. Drift is fixed before staging. Commit and push are automatic once tests pass.

---

## What This Is Not

This ADR does not change the interactive proposal discipline — the pipeline still pauses at each branch plan and the branch evaluation, and waits for author input. Those gates are not redundant because they represent authorial judgment calls that cannot be automated. The distinction is: gates that exist to confirm mechanical steps should be removed; gates that exist to exercise authorial judgment should remain.
