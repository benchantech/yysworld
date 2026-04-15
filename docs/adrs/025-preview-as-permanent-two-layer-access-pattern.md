# ADR 025 — ?preview as Permanent Two-Layer Access Pattern

- **ID:** YYBW-025
- **Status:** Decided
- **Date:** 2026-04-14
- **Scope:** YY Branching World
- **Depends on:** YYBW-020, YYBW-024
- **Supersedes / clarifies:** Formalizes the `?preview` mechanism first added as an easter egg (commit 268257f); promotes it to a permanent design decision under YYBW-020

---

## Context

YYBW-020 established a public/private two-layer architecture: the private layer holds source truth; the public layer holds the rendered, gated surface. The distinction between "what the pipeline has processed" and "what visitors can see" was described in principle but not specified in implementation.

On 2026-04-14, `?preview` was added as an undocumented easter egg — appending it to any day URL would reveal content before midnight. One commit later it was promoted into `GatedArticle` and `GatedComparison` as the explicit bypass mechanism for the time gate described in YYBW-024.

The question this ADR answers: is `?preview` a temporary scaffold or a permanent feature? And what are its rules?

---

## Decision

### 1. ?preview is a permanent, named bypass for the publication gate

`?preview` is not an easter egg. It is the designated mechanism for accessing time-gated content before its public release time. It is permanent, named, and documented.

The gate logic in `GatedArticle` and `GatedComparison`:

```
visible = (?preview in query string) OR (Date.now() >= new Date(releaseAt).getTime())
```

Both conditions produce identical rendered output. `?preview` does not fetch different data — the artifact content is identical. It only suppresses the "Available after midnight" placeholder.

### 2. ?preview is not linked and not indexed

`?preview` URLs are not:
- linked from any navigation element
- included in `sitemap.xml`
- included in `llms.txt`
- annotated with `<meta name="robots" content="noindex">`

The absence of links and sitemap inclusion is sufficient. Search engines do not crawl unlinked, unsitemapped URLs at scale. The content is not a secret (see YYBW-024 §"The gate is a UX boundary, not an auth boundary"), but the product surface should not proactively surface tomorrow's content to general visitors.

### 3. ?preview is for author verification, not reader distribution

The intended use case: the author or pipeline operator opens `?preview` after the pipeline runs to verify the artifact rendered correctly before midnight. It is an inspection tool, not a reader feature.

Sharing a `?preview` URL is not prohibited — the content is not access-controlled. But `?preview` is not marketed, documented in the user-facing UI, or mentioned on the site. It is discoverable only by reading this ADR or the source code.

### 4. The pattern applies to all gated surfaces

`?preview` applies uniformly across:
- Day artifact pages: `/yy/{runDate}/{branch}/day/{day}?preview`
- Branch comparison pages: `/yy/{runDate}/vs/{...comparison}/day/{day}?preview`

Any future gated surface should implement the same pattern rather than inventing a new bypass mechanism. The query parameter name `preview` is fixed — it must not be renamed per-surface.

### 5. The gate will move to auth; ?preview will move with it

`GatedArticle`'s inline comment documents the intended trajectory:

> "The gate will be replaced with proper auth when moving to Vercel."

When auth is introduced, `?preview` will become an authenticated preview — either a signed token, a role-based header, or an equivalent mechanism. The user-facing query parameter may be preserved as the entry point even when the underlying check changes. That transition requires a new ADR at the time.

---

## Why

**Named over implicit:** An undocumented easter egg has no rules. A named bypass has rules: what it does, who it's for, where it appears, and how it will evolve. Naming it transforms it from technical debt into intentional design.

**Uniform pattern over per-surface invention:** `GatedArticle` and `GatedComparison` share the same check. Adding a third gated surface later should not require deciding whether to use `?preview`, `?draft`, `?peek`, or some other name. One name, everywhere.

**Not indexable, not linked, not secret:** The three-part stance — not indexed, not linked, not a secret — is the correct posture for an inspection tool. Hiding it would make operator verification harder. Advertising it would surface unfinished content. The middle path is correct.

---

## Alternatives considered

1. **A separate `/preview` route with its own page.** Separating preview from the canonical URL means the rendered output might differ (different component tree, different CSS state). The author verifies something that looks slightly different from what visitors will see. Rejected — the canonical URL with `?preview` guarantees identical rendering.

2. **A build-time `NEXT_PUBLIC_PREVIEW` flag.** Only one mode per build — either preview is on for everyone or off for everyone. Cannot support per-URL inspection. Rejected.

3. **Rely on artifact JSON directly for inspection.** The raw JSON is inspectable at `/yy/data/...`, but it does not exercise the rendering pipeline. Verifying JSON fields is not the same as verifying the rendered page. Both are useful; only `?preview` covers the rendering path.

4. **Keep it as an undocumented easter egg permanently.** No rules, no stability guarantee, may be removed without notice. Rejected — it is already relied on by the operator as a verification tool.

---

## Consequences

- All future gated surfaces must implement the same `?preview` check pattern.
- `sitemap.ts` and `llms.txt` generation must never include `?preview` URLs.
- When auth is introduced, this ADR must be amended to describe the new gate mechanism, and the `GatedArticle` / `GatedComparison` comment must be updated.
- The `?preview` parameter name is stable. Renaming it is a breaking change for any operator tooling or scripts that reference it.

---

## Invariants preserved

Surface simplicity — `?preview` is invisible to general visitors; Author access — verification is always one query parameter away; Consistency — the same bypass mechanism applies to every gated surface; Honesty — the rendered output with `?preview` is identical to what visitors will see after midnight.

---

## Freshness boundary

Revisit when auth is introduced. At that point this ADR should be amended with the authenticated preview mechanism, and the `GatedArticle` / `GatedComparison` comment should be removed.
