**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-001 (Product Thesis), YYBW-020 (Public/Private Key)

---

# ADR 001 — Manifest as Highest Authority

## Status
accepted

## Human Anchor
“I want my kids to be able to look at this and see what I was thinking.”

## Context
The system is intended to be a long-term artifact of thought, not just a technical system. Without a stable philosophical anchor, architectural decisions drift toward convenience, optimization, or novelty.

The manifest defines the non-negotiable purpose, constraints, and values of the system.

## Decision
The Manifest v0.1 is the highest authority in the system.

- All ADRs must conform to the manifest
- ADRs may refine or implement, but not override
- Any conflict between ADR and manifest invalidates the ADR

Changes to the manifest must:
- be explicit
- be versioned
- be rare

## Consequences

### Positive
- Prevents architectural drift
- Keeps system aligned with original intent
- Ensures long-term coherence

### Negative
- Slows down certain changes
- Requires deliberate thinking before modification
