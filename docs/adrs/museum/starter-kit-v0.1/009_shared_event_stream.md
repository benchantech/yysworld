**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-005 (Shared Event Stream)

---

# ADR 009 — Shared Event Stream

## Status
accepted

## Human Anchor
“Same being, different path.”

## Context
For divergence to be meaningful, all branches must originate from a shared baseline of events. If each branch experiences a different world, comparison loses value.

## Decision
All branches within a root operate on a shared event stream.

The event stream:
- is defined per root
- is applied consistently across all branches
- represents the external world context

Branches may differ in:
- interpretation of events
- timing of reactions
- internal state
- decisions taken

Branches may NOT differ in:
- the existence of events
- the ordering of events

### Event Properties
Each event must be:
- timestamped
- structured
- versioned
- replayable

### Rules
- events are part of canonical state
- events must not be mutated per branch
- any change to event definition requires a new root or version

## Consequences

### Positive
- Enables meaningful comparison across branches
- Preserves causal baseline
- Supports replay and analysis

### Negative
- Limits narrative flexibility
- Requires careful event design
