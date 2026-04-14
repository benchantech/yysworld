# C2-018: COPPA by Elimination — No Jurisdiction to Grab
**Method:** YY Method™ Home Edition v2.3 — Capture → Why → Why-Not → Commit → Timestamp
**Status:** Decided
**Date:** March 30, 2026
**Position in Hierarchy:** Derived — depends on C2-013
**Freshness Boundary:** Active. Expires if any data collection is introduced.
**Source:** Operator-supplied. Interview with AI, March 30, 2026.

---

## Capture

Full COPPA compliance is achieved by designing YY's World so COPPA has nothing to regulate. No data collected. No consent surface. No liability target on the back.

This is not a compliance architecture. It is elimination of the regulatory surface entirely.

---

## Why

The operator previously worked on a kids virtual world and learned COPPA from the inside — the audits, the consent flows, the liability exposure, the ongoing compliance overhead. That experience produced a clear decision: in this venture, don't be fettered by it.

The way to not be fettered by COPPA is to structure the site so that COPPA's jurisdiction never attaches. COPPA regulates the collection and use of personal information from children under 13. A site that collects nothing has nothing for COPPA to regulate.

The creative goal — the vast ocean of possibilities, the freedom to explore, the genealogical artifact — requires creative attention and energy. A constant compliance target consumes that energy. Elimination removes the target permanently so the creative work can proceed without that overhead.

---

## Why-Not

**Why not use a standard COPPA consent flow with age gate?**
An age gate requires verifying age, which requires data. A consent flow requires parental identity, which requires more data. Both solutions create new compliance surface while solving the existing compliance problem. Elimination solves it by removing the surface.

**Why not privacy-preserving analytics?**
Even aggregated analytics create a relationship between user behavior and a third-party service. On a children's site, this creates potential COPPA exposure regardless of whether PII is collected. The elimination approach avoids this entirely.

**Why not rely on policy rather than architecture?**
Policies can be violated. Architectures that collect nothing cannot accidentally start collecting. The structural approach is more reliable than the policy approach — a lesson from prior COPPA experience.

---

## Breaks If

Any data collection is introduced. Any third-party JavaScript that could create a user-behavior relationship is added. Any form accepts submission. Any cookie is set by application code.

---

## Commit

**Decision:** COPPA by elimination. Prior experience with a kids virtual world produced a clear lesson: design so COPPA has nothing to grab. Creative freedom requires no target on the back.

**Confidence:** High — grounded in direct prior experience.
