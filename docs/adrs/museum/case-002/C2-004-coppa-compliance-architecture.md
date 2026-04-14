# C2-004: COPPA Compliance Architecture
**Method:** YY Method™ Home Edition v2.3 — Capture → Why → Why-Not → Commit → Timestamp
**Status:** Decided
**Date:** March 30, 2026
**Position in Hierarchy:** Derived — depends on C2-003 (Data Posture)
**Freshness Boundary:** Active. Expires if COPPA regulations change materially, or if any technology listed in Breaks If is introduced.

---

## Capture

COPPA compliance is achieved through structural elimination of data collection — not through consent flows, privacy policies, age verification gates, or parental consent mechanisms. The site has nothing to comply with because it collects nothing.

The specific architectural choices that achieve this:

1. **Next.js static export** — all pages pre-rendered to HTML at build time. No server receives user requests at runtime. No request logs containing IP addresses or session data are created.
2. **Vercel CDN delivery** — static assets served from edge nodes. Vercel's standard CDN does not create user-identifying behavioral profiles.
3. **Zero third-party JavaScript** — no analytics SDK, no tracking pixel, no chat widget, no social share button, no embedded player. Every third-party JS library is a potential data collection point. None are permitted.
4. **No cookies set by application code** — the site does not set cookies of any kind. Browser defaults are not overridden.
5. **No forms** — no submission endpoint exists. Nothing to POST to.
6. **No user accounts** — no authentication layer of any kind.

---

## Why

The standard COPPA compliance path involves consent infrastructure: age gates, parental consent flows, privacy policies, data minimization commitments, retention limits. These are all correct responses to the problem of data collection. But they are responses to a problem this site has decided not to create.

Consent flows can be bypassed. Privacy policies can be violated. Data minimization commitments can drift. An architecture that collects nothing is immune to all of these failure modes.

The deeper reason: the site's purpose is to give without extracting. COPPA compliance through consent infrastructure implicitly accepts the premise that data collection is the default and consent is the safeguard. YY's World rejects the premise. The architecture enforces the rejection.

---

## Why-Not

**Why not use a standard COPPA consent flow with age gate?**
An age gate requires verifying age, which requires data. A consent flow requires parental identity, which requires more data. Both solutions solve the compliance problem by adding complexity that itself creates new compliance surface. The structural approach solves it by eliminating the surface.

**Why not use privacy-preserving analytics (e.g., Plausible, Fathom)?**
Even privacy-preserving analytics aggregate user behavior — page views, referrers, session counts. They do not collect PII but they do collect behavioral data. On a children's site, even aggregated behavioral data creates a relationship between the user and a third-party service. The outward-only posture (C2-003) forbids this regardless of COPPA status.

**Why not server-side rendering with careful logging controls?**
SSR creates request logs by default. Even with logging disabled, SSR infrastructure can drift — a dependency update, a platform change, a misconfiguration. Static export cannot accidentally start logging because it generates no runtime server.

---

## Breaks If

Any third-party JavaScript is added (verify all `<Script>` tags and package.json additions). SSR or API routes are enabled that receive user requests. Cookies are set. A form of any kind is added. A CMS with user authentication is introduced. Vercel analytics is enabled (even the first-party version creates page-level event data). Any npm package that phones home is added.

---

## Tribal Context

**Operator supplied:** The insight that structural non-collection is more reliable than consent-based compliance.

**Session supplied:** The enumeration of specific architectural choices that enforce the posture.

---

## Commit

**Decision:** COPPA compliance via structural elimination. Static export, zero third-party JS, no forms, no cookies, no accounts. The most COPPA-compliant system is one with nothing to comply about.

**Confidence:** High.
