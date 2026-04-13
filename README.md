# YY Branching World — Case Overview

This package captures the full reasoning chain for the proposed YY branching-world site using a YY-Method-style ADR archive.

## Core thesis

A mobile-first, outward-facing, mostly static site where people follow different versions of YY across shared event timelines. The surface is warm, literary, and family-shareable. The substrate is rigorous: versioned canon, immutable event ledger, cached diffs, manifests, and a database of truth.

## Through-line

The concept began as a broad creature/world-builder idea and progressively clarified into a finite, inspectable branching system:

1. Static combinatorial "creature creation" was rejected as the center of gravity.
2. The core shifted to following one being over time.
3. Branching became rooted in the same character under different capability acquisitions.
4. Crossings were first embraced, then stripped away for clean measurement, then restored only as a separate "chaos lab".
5. The visual/UI layer narrowed from rich generative worlds to SMS/emoji, mobile-first, low-cost pages.
6. The data model hardened into append-only truth, cached projections, versioned canon, and future attestability.

## YY Method alignment

This package tries to preserve the six YY Method invariants in every major decision:

- Compression
- Scars
- Survivability
- Explainability
- Timestamping
- Discipline

## Package contents

- `docs/adrs/` — decision records preserving the reasoning chain, alternatives, reversals, and implications.
- `PLAN.md` — execution and operational plan for the new site.
- `ARCH_MAP.md` — infrastructure map for Vercel + Neon Postgres, with hobby-safe constraints and future hooks.
- `CLAUDE.md` — execution process, operating principles, invariants, and AI-agent guardrails.
