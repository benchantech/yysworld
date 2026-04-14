# ADR 005 — Shared Event Stream: Real-World Anchored, Abstracted, Rewindable

- **ID:** YYBW-005
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-003, YYBW-004
- **Supersedes / clarifies:** Clarifies use of real dates and historical replay
- **Museum lineage:** [SK-009](./museum/starter-kit-v0.1/009_shared_event_stream.md)

## Context

The event engine evolved from generic world events to a stronger idea: use real-world events as seeds, abstracted enough to remain universal but still tied to actual dates. Later, historical rewind emerged: start in a past month or period, seed the world through known history, and replay to today.

## Decision

Each root uses a shared event stream tied to real dates. Events are abstracted from real-world conditions, but keep a real date anchor for inspection. The system must support historical rewind/replay from selected prior periods.

## Why

This adds:
- shared temporal reference
- inspectability against lived history
- stronger narrative pacing
- a way to ask 'what would YY have done during that period?' 
- high replay value

## Alternatives considered

1. **Completely fictional event streams** — rejected as less resonant and less inspectable.
2. **Literal news reproduction** — rejected because it narrows the world and creates brittle specificity.
3. **No rewind, forward-only** — rejected because history offers immediate depth and controlled experiments.

## Reversals / scars preserved

- Early excitement about 'the world rolls the dice today' remains central.
- A later refinement insisted on abstraction instead of raw literal news.
- The historical-replay addition turned the system from only live simulation into backtestable causality.

## Consequences

- Event records need real_date, story_day, abstraction layer, and source provenance.
- Users should be able to inspect events by date and compare reactions across branches.
- Content moderation/editorial curation remains important because real-world events can be heavy.

## Invariants preserved

Timestamping is explicit; Explainability through event alignment; Survivability through abstracted storage; Discipline through abstraction boundaries.

## Freshness boundary

Requires periodic editorial judgment as real-world event sourcing evolves.
