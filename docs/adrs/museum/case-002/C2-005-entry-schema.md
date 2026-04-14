# C2-005: Entry Schema — The Six Fields
**Method:** YY Method™ Home Edition v2.3 — Capture → Why → Why-Not → Commit → Timestamp
**Status:** Decided
**Date:** March 30, 2026
**Position in Hierarchy:** Foundational — YY's role, anti-smoothing principle, and AI readability all depend on the schema being fixed
**Freshness Boundary:** Active. The schema is inviolable. Expires only if a specific field is found to be structurally incomplete and a formal correction ADR is filed.

---

## Capture

Every entry on YY's World has exactly six fields. The schema is the same for every entry, every domain, every topic.

```
DECISION:   What was chosen.
WHY:        The reasoning behind the choice.
WHY-NOT:    What was seriously considered and rejected, and why.
BREAKS IF:  The conditions under which this decision stops being right.
EXPIRES:    When this entry's reasoning becomes stale.
YY'S TAKE:  What the squirrel thought about it.
```

All six fields appear in every entry. None are optional.

---

## Why

The schema serves two audiences simultaneously.

For a kid reading the entry: the schema is a pattern that repeats until it becomes reflex. DECISION is not interesting alone. WHY is not interesting alone. WHY-NOT is where the real reasoning lives — the shadow of what was rejected. BREAKS IF makes the decision human-scale rather than universal. EXPIRES teaches that reasoning has a shelf life. YY'S TAKE is where the session becomes irreducible — no one else has YY's take.

For an AI reading the site as a lens: the schema provides a queryable structure. An AI can extract: every decision made, every alternative rejected, every constraint on every decision, every expiry condition, every documented squirrel objection. Without a fixed schema, the site is narrative. With the schema, it is a structured knowledge artifact that can be parsed, compared, cross-referenced, and used to reason about patterns across entries.

The WHY-NOT field is the most important and most often skipped in natural documentation. It carries the "negative space" that the YY Method treats as load-bearing. A decision without its rejected alternatives is half a record. The schema enforces completeness.

---

## Why-Not

**Why not flexible structure per entry type?**
Different topics might seem to warrant different formats — a practice session entry differs from a friendship decision entry. But flexible structure means the AI cannot reliably parse the artifact. The schema's uniformity is what makes the site machine-readable as a lens. Topic variation is handled inside the fields, not by varying the fields.

**Why not prose-only entries without explicit field labels?**
Prose is harder to parse and easier to smooth. Field labels force the author to fill each slot explicitly — you cannot accidentally skip WHY-NOT in prose-free form because the field is absent. The labels also train the kid reader: after enough entries, they begin to mentally label everything they encounter.

**Why not five fields, dropping YY'S TAKE?**
YY'S TAKE is the authentication field. It is where the entry proves it came from a specific session with a specific squirrel. It is non-optional precisely because it is the field most tempting to skip — YY doesn't always have a take. When YY has no take, the field says so. That is also information.

**Why not add more fields (e.g., CONFIDENCE, ALTERNATIVES CONSIDERED)?**
Six is the right count for a kids' site. More fields create cognitive overhead for the reader and authoring friction for the operator. WHY-NOT already covers alternatives considered. BREAKS IF already implies confidence (high confidence = narrow BREAKS IF conditions; low confidence = broad ones).

---

## Breaks If

A field is published as optional or absent. Field names drift across entries. The schema is modified without filing a correction ADR. YY'S TAKE is dropped from entries because "YY didn't have a take this time" — the correct response is to write that YY had no objection and note why that itself is unusual.

---

## Tribal Context

**Operator supplied:** The six-field structure, derived from the YY Method's core loop (Capture, Why, Why-Not, Commit, Timestamp) adapted for entry-level content.

**Session supplied:** The framing of YY'S TAKE as the authentication field and WHY-NOT as the most load-bearing field.

---

## Commit

**Decision:** Six fields. All required. Schema inviolable. DECISION → WHY → WHY-NOT → BREAKS IF → EXPIRES → YY'S TAKE.

**Confidence:** High.
