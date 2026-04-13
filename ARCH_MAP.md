# ARCH_MAP.md

## Architecture map

This document explains the intended launch architecture, why it fits Vercel Hobby + Neon Postgres Free, and what hooks are preserved for later expansion.

---

## 1. Core architecture pattern

### Source of truth
- Neon Postgres
- append-only immutable event ledger
- versioned YY canon
- roots, branches, branch days, events, diffs, artifacts, jobs

### Read layer
- materialized projections / query tables
- manifests for build and publish control
- cached diff artifacts

### Delivery layer
- Vercel-hosted static pages and lightweight route handlers where needed
- static JSON payloads for timeline/feed views
- no heavy server-side generation required for normal browsing

### Media layer
- minimal at launch
- prefer static assets, sprite systems, simple composables
- avoid blob-heavy usage until concept is proven

---

## 2. Why this qualifies for early hobby use

### Vercel Hobby fit
The launch version is mostly:
- static pages
- cached JSON
- very small dynamic surfaces
- modest build cadence
- low traffic expectations early

This minimizes:
- function invocations
- duration
- memory usage
- server complexity

### Neon Free fit
The launch version stores mostly:
- structured text/JSON
- timestamps
- version pointers
- diffs
- manifests
- job metadata

It explicitly avoids:
- heavy binary asset storage
- broad user-generated content
- large attachment workflows

---

## 3. Data model

## Canon entities

### `yy_versions`
Tracks canonical YY revisions.

Fields:
- `yy_version_id` (pk)
- `version_label` (`v1.0`, `v1.1`, ...)
- `created_at`
- `supersedes_yy_version_id` (nullable)
- `summary`
- `traits_json`
- `voice_profile_json`
- `rationale`
- `payload_hash` (optional future)
- `schema_version`

### `yy_version_diffs`
Precomputed diffs between YY versions.

Fields:
- `yy_version_diff_id`
- `from_yy_version_id`
- `to_yy_version_id`
- `computed_at`
- `structural_diff_json`
- `narrative_diff_md`
- `completeness_level`
- `stale_status`

---

## Story entities

### `roots`
Each monthly or special arc.

Fields:
- `root_id`
- `title`
- `root_type` (`monthly`, `extended`)
- `month_key` (`2026-04`)
- `start_date`
- `end_date`
- `yy_version_id`
- `status`
- `created_at`

### `branches`
Each variation under a root.

Fields:
- `branch_id`
- `root_id`
- `branch_name`
- `branch_kind` (`baseline`, `skill`, `language`, `entropy`, ...)
- `divergence_day`
- `divergence_event_id` (nullable)
- `branch_cause_summary`
- `is_featured`
- `created_at`

### `world_events`
Shared events by day/date.

Fields:
- `world_event_id`
- `root_id`
- `story_day`
- `real_date`
- `source_label`
- `source_ref` (optional external note/reference)
- `abstract_event_type`
- `abstract_payload_json`
- `created_at`

### `branch_days`
Canonical day-level reaction records.

Fields:
- `branch_day_id`
- `branch_id`
- `world_event_id`
- `story_day`
- `real_date`
- `yy_version_id`
- `reaction_text`
- `reaction_emoji`
- `decision_matrix_json`
- `state_delta_json`
- `accumulation_delta_json`
- `created_at`
- `superseded_by_event_id` (nullable read helper only; truth lives in ledger)

### `state_snapshots`
Periodic snapshots for faster replay/rebuild.

Fields:
- `snapshot_id`
- `branch_id`
- `story_day`
- `real_date`
- `snapshot_json`
- `created_at`

---

## Diff entities

### `branch_diffs`
Precomputed comparisons.

Fields:
- `branch_diff_id`
- `root_id`
- `branch_a_id`
- `branch_b_id`
- `comparison_type` (`branch_vs_root`, `sibling`, `custom`)
- `first_divergence_day`
- `first_meaningful_divergence_day`
- `structural_diff_json`
- `narrative_diff_md`
- `distance_score`
- `computed_at`
- `completeness_level`
- `stale_status`

---

## Build / provenance entities

### `ledger_events`
Immutable append-only events.

Fields:
- `ledger_event_id`
- `event_type`
- `entity_type`
- `entity_id`
- `effective_story_date` (nullable)
- `created_at`
- `payload_json`
- `parent_event_ids_json`
- `supersedes_ledger_event_id` (nullable)
- `author_type` (`operator`, `local_model`, `remote_model`, `system`)
- `author_id` (nullable)
- `payload_hash`
- `signature` (nullable future)
- `schema_version`

### `artifacts`
Published and generated artifacts.

Fields:
- `artifact_id`
- `artifact_type` (`page`, `json`, `email`, `short_script`, `thumbnail`, ...)
- `entity_type`
- `entity_id`
- `path_or_key`
- `build_version`
- `created_at`
- `status`
- `completeness_level`
- `source_hash`

### `artifact_dependencies`
Maps what an artifact depends on.

Fields:
- `artifact_dependency_id`
- `artifact_id`
- `depends_on_entity_type`
- `depends_on_entity_id`
- `depends_on_hash`

### `generation_jobs`
Nightly and ad hoc jobs.

Fields:
- `generation_job_id`
- `job_type`
- `status`
- `started_at`
- `completed_at`
- `input_manifest_hash`
- `output_summary_json`
- `notes`

### `manifests`
Derived operational state.

Fields:
- `manifest_id`
- `manifest_type` (`world`, `build`, `publish`)
- `created_at`
- `manifest_json`
- `source_hash`

---

## 4. Ledger vs projections

## Ledger
Immutable source of truth.
Never edited in place.

## Projections
Fast read models rebuilt from ledger as needed.
Can be replaced, regenerated, or denormalized.

### Why this matters
- corrections preserve scars
- history remains inspectable
- AI can act on explicit change surfaces
- the site can stay fast without sacrificing provenance

---

## 5. Build pipeline

### Nightly pipeline
1. Load current world/build manifests
2. Select active root(s) and branch set
3. Ingest or select event seeds
4. Normalize to abstract events
5. Advance branches
6. Write ledger events
7. Refresh projections
8. Compute or refresh diffs
9. Render static pages and JSON
10. Optionally render email/Shorts artifacts

### Ad hoc pipeline
Triggered when:
- YY canon changes
- a diff is missing
- an explanation is enriched
- a special arc is generated

---

## 6. Vercel-specific map

### Good fits for Vercel Hobby
- static app routing
- prebuilt timeline pages
- asset hosting for lightweight files
- edge/cache delivery
- small API helpers if needed

### Avoid on Hobby
- live heavy generation
- image/video-heavy processing
- broad authenticated app backends
- long-running functions as a normal path

### Suggested app shape
- `/` → latest month landing page
- `/month/[yyyy-mm]` → root archive page
- `/branch/[id]` → branch page
- `/compare/[a]-vs-[b]` → diff page
- `/yy/versions` → YY version history
- `/yy/versions/[id]` → YY version detail/diff
- `/api/*.json` or static JSON under `/data/` for cached payloads

---

## 7. Neon-specific map

### Good fits for Neon Free
- append-only text-heavy ledger
- structured JSON columns where useful
- small query workloads
- versioned content
- build metadata

### Watchouts
- branch explosion
- storing verbose repeated prose instead of structured state
- storing media blobs in Postgres
- excessive ad hoc diff generation

### Operational discipline
- compact schemas
- snapshots for replay
- prune or archive unused projections
- keep truth and artifacts distinct

---

## 8. Early tradeoffs

### Decision: static-first over live
Trade:
- less “alive” moment to moment
+ dramatically better cost, consistency, and hobby viability

### Decision: small branch set over open sandbox
Trade:
- less flexibility
+ stronger comprehension, lower cost, cleaner content signal

### Decision: mobile SMS UI over rich media-first
Trade:
- less visual spectacle
+ lower cost, faster load, easier comparison, better habit loop

### Decision: append-only ledger over mutable CRUD simplicity
Trade:
- more modeling effort
+ long-term trust, auditability, rebuildability, future verifiability

---

## 9. Hooks for expansion

### Near-term expansion
- more roots in archive
- extended premium arcs
- richer diff narratives
- opt-in email layer
- Shorts automation pipeline

### Mid-term expansion
- limited user-created branches
- account system
- richer media moments
- historical replay explorer
- more than one canonical being

### Long-term expansion
- chaos lab
- collaborator authorship
- signatures/hashes as first-class public surfaces
- optional external attestation / blockchain anchoring
- more advanced agents helping maintain canon and build state

---

## 10. Anti-patterns to avoid

- building around infinite live simulation early
- silently mutating canon
- storing only prose and no structured truth
- heavy media dependence on free tiers
- collapsing Measurement Lab and Chaos Lab too early
- making the audience child-directed in product language
- assuming free tiers are permanent production strategy

---

## 11. Guiding infrastructure principle

> Build a ledger-backed, static-first YY world that is cheap, legible, and rebuildable now, while leaving clear hooks for richer compute, richer surfaces, and stronger verification later.
