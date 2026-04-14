**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-007 (Daily Surface), YYBW-013 (Manifests and Projections)

---

# ADR 012 — Output Rendering Layer

## Status
accepted

## Context
The system produces structured state, but humans engage with text, short-form content, and UI representations. Without a clear separation, rendering logic risks contaminating canonical state.

## Decision
Introduce a strict Output Rendering Layer.

This layer:
- consumes canonical state + artifacts
- produces human-facing outputs
- does not modify or define state

### Output Types
- narrative summaries
- branch comparisons
- short-form content
- visualizations

### Rules
- outputs are always derived, never canonical
- rendering must reference artifact_id and package_id
- rendering logic may evolve independently of state

## Consequences

### Positive
- Preserves clean separation between state and presentation
- Allows iteration on storytelling without breaking system
- Supports multiple output formats

### Negative
- Requires duplication of logic
- Adds abstraction layer
