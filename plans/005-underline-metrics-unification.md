# 005 — Unify underline metrics (body links ↔ Cta wipe)

**Batch:** 2 · **Effort:** ~20 min · **User input:** none (this REPLACES the rejected quiet-link change — see below)

> Line refs from `main` @ `e647f5e`. Re-grep before editing.

## Owner decision context (do not revisit)

The original idea — give `.quiet-link` the Cta hover treatment — was **rejected on design review (2026-07-11)**: the Cta's underline-wipe is an emphasis affordance; `.quiet-link` (Footer, SocialLinks, ToC — `global.css:491-516`) is deliberately secondary chrome, and ToC links sit in the highest hover-frequency tier where animation should be reduced, not added. **Leave `.quiet-link` exactly as is** (color-only 150ms shift). Do not add underlines, wipes, or decoration to it.

The approved consistency win instead: links that *already* draw underlines should share one set of metrics.

## Diagnosis

Two underline systems coexist:

1. **Cta** (`src/components/Link.astro:37`): faux underline via `linear-gradient(currentColor,currentColor)` background, `0%_1.5px → 100%_1.5px` wipe, positioned `0 100%`, with `pb-px` giving ~1px gap under the baseline box. Effective: **1.5px thick, ~1px offset**.
2. **Body links** (`:is(main, .prose) a`, `global.css:860-888` — intentionally outside `@layer`; keep it there, the comment explains why): real `text-decoration` with a `color-mix` on `--foreground` for the line color (~line 871).

## Change

In the body-link block (`global.css:860-888`), set explicit metrics to match the Cta's rendered line:

```css
text-decoration-thickness: 1.5px;
text-underline-offset: 3px; /* tune 2-4px by eye against a Cta side-by-side */
```

- Check what's currently set before adding (don't duplicate properties).
- Keep the existing `color-mix` underline color — only thickness/offset are in scope.
- The offset value is the one taste knob: a native underline measures offset from the baseline while the Cta gradient sits at the bottom of the inline box, so equal-looking ≠ equal numbers. Render a body link and a Cta link on the same page (home page has both) and match by eye at 100% and 200% zoom.

## Acceptance criteria

- Body-link underline and Cta hover underline read as the same "pen" — same thickness, same visual gap.
- `.quiet-link` untouched (git diff shows no change to it).
- No change to underline color or hover behavior.

## Verify

Dev server, home page: hover the "Learn more about me" Cta while a prose link is visible; zoom 200%; check light + dark.
