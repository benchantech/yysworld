**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-010 (Compute Strategy)

---

# ADR 006 — Model Provenance & Role Separation

## Status
accepted

## Human Anchor
“Human first, AI second.”

## Context
The system depends on LLMs for generation, evaluation, and transformation. However, different models and configurations can produce materially different results.

Without explicit tracking:
- outputs become non-reproducible
- differences become unexplainable
- authority boundaries blur

## Decision
Model provenance is a first-class part of every artifact.

Each artifact MUST include a `model_profile` containing:
- provider
- model_id
- model_version (if available)
- role
- key parameters

If multiple models are used, each must be recorded separately by role.

### Role Separation
- generator → produces structured outputs
- evaluator → compares or ranks outputs
- summarizer → derives human-readable surfaces

Models may propose outputs.

Models may not:
- define canon
- modify schema
- override packages

## Consequences

### Positive
- Enables reproducibility
- Allows meaningful comparison across model changes
- Reinforces human authority over system

### Negative
- Adds verbosity to artifacts
- Requires disciplined tracking of model changes
