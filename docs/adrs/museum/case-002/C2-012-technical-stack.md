# C2-012: Technical Stack — Static-First, Zero Extraction Surface
**Method:** YY Method™ Home Edition v2.3 — Capture → Why → Why-Not → Commit → Timestamp
**Status:** Decided
**Date:** March 30, 2026
**Position in Hierarchy:** Derived — depends on C2-004 (COPPA Compliance Architecture)
**Freshness Boundary:** Active. Expires if the static-first constraint is revisited or if Vercel's CDN delivery model changes materially.

---

## Capture

**Stack:** Next.js static export · Vercel CDN · TypeScript strict · Tailwind v4 · shadcn/ui new-york dark · zero third-party scripts · no runtime user state · no server-side rendering · no database · no authentication layer.

Every page is pre-rendered HTML at build time. No server receives user requests at runtime. Content lives in markdown files alongside the code. Deployment is a static asset push to Vercel's CDN.

This is the same stack as home.yymethod.com — familiar tooling, consistent deployment target, no new infrastructure to learn or operate.

---

## Why

The stack is derived from the data posture (C2-003) and COPPA architecture (C2-004). Static export means the compliance architecture is structural rather than policy-dependent — there is no runtime to misconfigure, no logging to accidentally enable, no session infrastructure to drift toward data collection.

The secondary reason is operational simplicity. A static site has no server to go down, no database to maintain, no secrets to rotate, no runtime dependencies that can fail. Content changes are version-controlled alongside the code. Deployment is predictable. The operator can focus on content — the only variable that matters for the site's purpose.

The dark mode + shadcn/ui choice continues the visual language of home.yymethod.com. Consistency across the YY universe allows readers who encounter both sites to recognize the same design grammar, even if they do not consciously connect them.

---

## Why-Not

**Why not a headless CMS with a public content API?**
A CMS introduces a separate system to maintain, credentials to manage, and a potential API endpoint that could log request data. For content that changes rarely and is authored by a single operator, a CMS adds complexity without benefit. Markdown files in the repo are the correct CMS for this use case.

**Why not a database-backed dynamic site?**
Dynamic rendering creates request logs, session infrastructure, and runtime dependencies — all of which create potential extraction surface. None of the site's use cases require dynamic data. There is no user state, no personalization, no content that changes per-request.

**Why not React without Next.js (e.g., Vite + React)?**
Next.js static export provides automatic routing, static params generation, and the same deployment path as home.yymethod.com. No new tooling. The familiarity benefit is real — the operator has already built one production site with this stack in a single session.

**Why not light mode?**
The YY universe is dark mode. home.yymethod.com is dark mode. The visual consistency is a quiet signal of continuity for readers who encounter both sites. Light mode would also require a separate design decision for a children's site that isn't warranted by the content type — YY's World is not editorial or content-first in the way that warrants light mode defaults.

---

## Breaks If

Any `<Script>` tag is added with `src` pointing to a third-party domain. SSR or API routes are introduced. A database or CMS with user session infrastructure is added. `next export` is disabled in favor of server-side rendering. Any npm package is added that phones home with behavioral data. `vercel analytics` or any analytics integration is enabled.

---

## Tribal Context

**Operator supplied:** The stack selection — continuation of the home.yymethod.com stack, familiarity as a real benefit.

**Session supplied:** The derivation of stack from data posture — every technical choice is a consequence of the outward-only constraint, not an independent preference.

---

## Commit

**Decision:** Next.js static export on Vercel. Same stack as home.yymethod.com. Zero extraction surface by construction. Content in markdown. No runtime. No database. No third-party scripts.

**Confidence:** High.
