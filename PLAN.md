# PLAN.md

## Objective

Launch a small, hobby-safe, outward-facing YY branching-world site that proves one thing before anything else:

> People want to return daily to compare how the same being responds differently to the same world under different paths.

This plan favors signal over scale, static publishing over live inference, and clean roots over open-ended complexity.

---

## 1. Product shape at launch

### Launch unit
- 1 canonical YY
- 1 current monthly root
- 2–4 branches
- 1 shared event stream
- daily reactions in SMS/emoji style
- root/branch comparison
- cached branch diffs
- mobile-first timeline browsing

### What the user can do
- open the latest month
- see today's event(s)
- compare branch reactions
- bookmark/follow a branch
- jump back to root
- scrub the timeline
- inspect branch-vs-root diffs
- inspect which YY version powers the story

### What the user cannot do at first
- create their own roots
- inject their own branches
- upload data
- message the system
- alter the world live

This preserves outward-facing simplicity and hobby qualification.

---

## 2. Phases

## Phase 0 — Seed canon and templates
Deliverables:
- canonical YY v1.0 profile
- event schema
- branch schema
- diff schema
- tone guide
- first month theme
- first static wireframes

Success criteria:
- the product is describable in one sentence
- one sample timeline can be rendered end to end

## Phase 1 — Measurement-lab MVP
Deliverables:
- one monthly root
- limited branches
- nightly build job
- Neon truth DB
- Vercel static site
- mobile timeline/feed
- bookmark/follow local state or basic account later
- cached branch-vs-root diffs

Success criteria:
- site loads fast on phone
- user can understand root vs branch in under 10 seconds
- daily content can be generated and published reliably

## Phase 2 — Distribution loop
Deliverables:
- YouTube Shorts export
- one reusable Shorts template
- daily or several-times-weekly post cadence
- opt-in email updates for followed branches
- archive page for older months

Success criteria:
- strangers can understand the concept from a short
- some people return to site repeatedly
- some people opt into follow behavior

## Phase 3 — Deeper comparisons
Deliverables:
- branch-to-branch diff pages
- YY version diff pages
- richer narrative explanations on selected pages
- progress bars on incomplete explanation layers

Success criteria:
- users explore comparison depth voluntarily
- explanation layers improve perceived richness without requiring live compute

## Phase 4 — Extended arcs / premium experiments
Deliverables:
- one 60–90 day special arc
- stronger recap artifacts
- selective premium surfaces
- historical replay roots

Success criteria:
- deeper arcs feel meaningfully different from monthly arcs
- premium/deeper exploration is clearly more than “just more days”

## Phase 5 — Optional chaos lab
Deliverables:
- separate or clearly scoped chaos mode
- branch encounters / interference
- entropy twins
- cross-branch ecology

Success criteria:
- measurement lab remains clean
- chaos lab does not contaminate baseline understanding

---

## 3. Daily operating rhythm

### Night
- select or ingest event seeds
- normalize them into YY-world event abstractions
- advance active branches
- write immutable ledger events
- refresh projections/manifests
- compute/cache relevant diffs
- optionally generate selected premium summaries
- publish static pages and JSON

### Day
- users read static pages
- users scrub timelines and compare branches
- distribution channels point back to the site
- no heavy live generation required

This rhythm is intentionally newspaper-like.

---

## 4. Content/editorial operating principles

### Default
- one event
- one reaction per branch
- one clear difference
- one clear consequence

### Keep
- subtle divergence
- warmth
- clarity
- inspectability
- real date anchors

### Avoid
- lore inflation
- too many branches
- abstract jargon on the surface
- childish overstyling
- endless text

---

## 5. Success metrics for early hobby stage

Primary:
- repeat visits
- time to first understanding
- branch follow/bookmark rate
- root-vs-branch compare rate

Secondary:
- archive exploration
- clickthrough from Shorts
- email opt-in rate
- return rate from email

Non-goals:
- broad feature depth
- user-generated content
- deep personalization
- immediate monetization

---

## 6. Scope controls

To remain hobby-safe:
- one active monthly root at a time
- very small branch counts
- limited media
- no real-time compute dependency
- static pages first
- no broad account system at launch
- no child-specific data collection

Any feature that threatens these should be delayed.

---

## 7. Decision checkpoints

Reassess after:
- first full month live
- first 10 Shorts published
- first meaningful repeat audience appears
- first requests for custom branches become common
- first signs that hobby/free limits or commercial posture are being exceeded

---

## 8. Strategic north star

This is not a sandbox first.

It is a readable, replayable, branching YY artifact that teaches causality through comparison.
