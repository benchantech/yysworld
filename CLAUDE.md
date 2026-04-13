# CLAUDE.md

## Purpose of this file

This file tells AI executors and future collaborators how to work on the YY Branching World project without breaking canon, provenance, or hobby-stage discipline.

The project is not just a site. It is a provenance-preserving, versioned, branching YY artifact.

---

## 1. Operating posture

### Primary rule
Preserve truth before polish.

### Secondary rule
Do not mutate the past silently.

### Tertiary rule
Prefer static, inspectable, rebuildable systems over live magical ones unless a strong reason exists.

---

## 2. What this project is

A mobile-first branching YY world where:
- each root is a finite arc
- branches emerge from explicit causes
- events align to real dates but are abstracted
- user-facing content is lightweight and glanceable
- the substrate is rigorous and immutable

---

## 3. Canonical invariants

Every serious change should preserve these invariants.

### 1. Canon integrity
- YY versions are explicit
- old roots keep the YY version they originally used
- no silent retroactive canon rewrites

### 2. Immutable truth
- ledger entries are append-only
- corrections are new events
- projections may be rebuilt; truth may not be overwritten

### 3. Root clarity
- each root has a bounded time horizon
- roots are independent by default
- the user can always identify where a root begins and ends

### 4. Branch legibility
- branch causes are explicit
- branch drift should be gradual unless intentionally exceptional
- root comparison remains one tap away

### 5. Event alignment
- events keep real-date anchors
- surface events remain abstracted enough to be universal
- story date and generation date must not be conflated

### 6. Surface simplicity
- default user-facing output is short and clear
- the product must remain mobile-first
- readability beats richness unless the moment truly warrants richness

### 7. Build determinism
- nightly pipelines should be reproducible
- manifests should make work explicit
- avoid hidden state and side effects

### 8. Audience discipline
- the product is adult-facing and family-shareable, not child-directed
- avoid toy-like drift in language or visuals

---

## 4. YY Method lens

When making a new artifact, ask whether it preserves:

- Compression
- Scars
- Survivability
- Explainability
- Timestamping
- Discipline

If not, the artifact is incomplete or suspect.

---

## 5. AI executor responsibilities

An AI executor working on this project should:

1. Read canon and manifests first.
2. Determine whether the task changes truth, projection, or presentation.
3. Never overwrite source truth in place.
4. When uncertain, create a proposal artifact rather than mutating canon.
5. Preserve timestamps and provenance metadata.
6. Prefer structured outputs over long prose unless prose is explicitly required.
7. Track which YY version, root, branch, and event any generated artifact belongs to.
8. Mark stale outputs clearly when dependencies change.
9. Avoid widening scope casually.
10. Leave a scar record when reversing a previous assumption.

---

## 6. Change taxonomy

Use the correct change type.

### Canon change
Examples:
- YY v1.1 is introduced
- voice profile changes
- baseline trait model refined

Action:
- append new canonical version
- compute YY version diff
- do not rewrite old roots silently

### Story change
Examples:
- new monthly root
- new branch
- new event day
- branch extension

Action:
- append ledger events
- refresh projections
- compute diffs as needed

### Projection change
Examples:
- a branch comparison page is improved
- a manifest is refreshed
- a feed card layout changes

Action:
- rebuild projection/artifact
- preserve dependency metadata

### Correction
Examples:
- a generated branch day was wrong
- a diff was stale or malformed

Action:
- append correction/supersession events
- rebuild affected projections
- preserve the original

---

## 7. Diff policy

### Always valuable
- branch vs root
- YY version vs previous YY version

### Often valuable
- sibling branch vs sibling branch
- selected historical comparisons

### Optional / lazy
- rare pairwise branch comparisons not yet viewed or featured

Diffs are artifacts. Cache them.

---

## 8. Nightly pipeline principles

When running a nightly build:

1. Load latest world manifest
2. Confirm active root(s)
3. Normalize event seeds
4. Advance branches in structured form
5. Write immutable ledger events
6. Refresh projections
7. Compute priority diffs
8. Render publishable artifacts
9. Write/update build + publish manifests
10. Record all timestamps

Nightly builds should produce a frozen snapshot the daytime site can serve quickly.

---

## 9. What not to do

Do not:
- make the product a general sandbox too early
- let users create arbitrary roots at launch
- couple the site to expensive live inference
- store only prose and lose structured truth
- turn every interaction into a blockchain problem
- silently collapse Measurement Lab and Chaos Lab
- optimize for scale before proving daily return behavior
- make the tone childish to chase family shareability

---

## 10. Quality bar for user-facing artifacts

A user-facing artifact is ready when:
- it is tied to a root/branch/version/date
- its provenance can be traced
- its language is simple and legible
- it loads quickly on phone
- it adds understanding, not decorative noise

---

## 11. Suggested file and record naming conventions

### IDs
- `yyv_001`
- `root_2026_04`
- `branch_2026_04_helper`
- `event_2026_04_12_resource_pressure`
- `diff_root_vs_helper_2026_04`

### Slugs
Use stable, human-readable slugs where practical for published artifacts.

### Timestamps
Always store full timestamps in UTC; render local/story time separately.

---

## 12. Future-proofing hooks

Leave room for:
- payload hashes
- signatures
- attestation backends
- collaborator authorship
- richer media artifact types
- replay/export pipelines

Do not let those future hooks drive present complexity.

---

## 13. Final operator principle

> The project should feel gentle on the surface and exacting underneath.

That tension is not a bug. It is the design.
