# ADR 007 — Daily Surface: SMS/Emoji, Mobile-First, Glanceable

- **ID:** YYBW-007
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-001, YYBW-002, YYBW-005
- **Supersedes / clarifies:** Clarifies the low-cost interaction layer

## Context

The surface evolved through several forms: rich narrative logs, SNES dialog, then SMS/emoji. Cost and usability converged on a mobile-first daily check-in product. The site should be fast to open, instantly readable, and usable on any phone.

## Decision

Default user-facing reactions are short, SMS-style messages with selective emoji support. The primary interface is mobile-first, glanceable, and designed for 10–30 second daily check-ins.

## Why

This yields:
- low token cost
- high emotional clarity
- easy comparison
- mobile-native behavior
- family-shareable simplicity without childishness

## Alternatives considered

1. **Long daily prose everywhere** — rejected due to cost and readability.
2. **Purely visual/no text** — rejected because text is the causal legibility layer.
3. **Heavy game-like UI** — rejected because the product is a daily reading/check-in ritual, not a gameplay session.

## Reversals / scars preserved

- SNES dialog was a meaningful intermediate insight.
- Zork/text-adventure and Calvin-and-Hobbes references remain useful stylistic North Stars.
- Emoji were a late addition that improved compression and speed.

## Consequences

- The UI should optimize for feed + compare + timeline, not forms or dashboards.
- Rich text should be reserved for highlights, weekly recaps, or premium/artifact layers.
- Voice guidelines must avoid both sterile enterprise speech and overly juvenile phrasing.

## Invariants preserved

Compression and Explainability are the point; Discipline via short-form default; Survivability through text-first artifacts.

## Freshness boundary

Stable for MVP; can layer richer prose later.
