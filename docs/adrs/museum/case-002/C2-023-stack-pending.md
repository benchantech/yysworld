# C2-023: Technical Stack — Pending Operator Decision
**Method:** YY Method™ Home Edition v2.3 — Capture → Why → Why-Not → Commit → Timestamp
**Status:** Pending
**Date:** March 30, 2026
**Position in Hierarchy:** Pending — depends on C2-018
**Freshness Boundary:** Pending. Expires when operator decides.
**Source:** AI recommendation. Operator evaluating. Interview with AI, March 30, 2026.

---

## Capture

Stack not yet decided as of March 30, 2026.

This entry is a live example of the AI force multiplier working correctly: strong constraints from the founding architecture, clear requirements from the outward-only data posture, AI proposes a specific recommendation, operator evaluates it.

---

## AI Recommendation

**Next.js static export on Vercel.**

Same tooling as home.yymethod.com. Zero runtime extraction surface — a static export has no server, no runtime, no process that could accidentally start collecting data. Familiar stack, proven deployment pattern, familiar to the operator already. The static export constraint enforces the COPPA elimination posture architecturally, not just as policy.

---

## Why This Is Marked Pending

The operator heard the recommendation and found it useful. The operator said: "i think i'll likely follow it." That is not a decision. That is an operator in evaluation mode.

The distinction matters because: a decision under the YY Method is a committed position with captured reasoning. An operator saying "i'll likely follow it" is pre-decision — the reasoning has not yet been fully owned. When the operator decides, this ADR becomes Decided with operator-supplied rationale replacing this AI-supplied recommendation.

---

## Why the Recommendation Is Sound

The outward-only data posture (C2-013), COPPA by elimination (C2-018), and the genealogical artifact purpose (C2-022) collectively produce one architectural requirement: the site must be structurally incapable of data collection, not just policy-incapable.

A static export satisfies this requirement by construction. There is no server to instrument, no runtime to inject analytics into, no application process that could receive form submissions. The architecture enforces the posture.

Next.js on Vercel is additionally motivated by operator familiarity — the same stack is already running at home.yymethod.com. No new tooling to learn. Deployment is familiar. Cost is known.

---

## Breaks If

Operator selects a server-rendered stack without explicit architecture for maintaining the outward-only posture. Any server-side component introduces extraction surface that must be actively governed rather than structurally eliminated.

---

## Commit

**Decision:** Pending. AI recommends Next.js static export on Vercel. Operator evaluating.

**YY'S TAKE:** Pick something. The rest of us are ready.

**Confidence:** AI recommendation is high. Operator decision is pending.
