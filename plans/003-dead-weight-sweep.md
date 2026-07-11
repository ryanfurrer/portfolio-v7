# 003 — Dead tokens, stale comments, commented-out code, loose typing

**Batch:** 1 (mechanical) · **Effort:** ~20 min · **User input:** none

> Line refs are from `main` @ `e647f5e` (2026-07-11). Re-grep before editing — especially if 001/002 landed first.

All items below were grep-verified to have **zero consumers** in `src/` on 2026-07-11. Re-verify each with a grep before deleting (cheap insurance).

## Deletions in `src/styles/global.css`

1. `--link-underline: #bbb;` (line ~347) — unused; body links compute their underline via `color-mix` on `--foreground` (line ~871), not this token.
2. `--card-foreground-muted: #6e6e73;` (line ~331) — unused.
3. `--popover-foreground-muted: var(--color-neutral-600);` (line ~334) — unused AND broken (references a Tailwind palette var not defined in this sheet).
4. Stale comment `/* custom red-orange */` (line ~335) — sits above `--primary: oklch(0.205 0 0)`, a neutral near-black. Wrong and misleading.
5. Commented-out duplicate token at line ~278: `/* --color-accent-foreground: var(--accent-foreground); */` (live definition exists ~19 lines below).
6. Commented-out CSS block at lines ~438-441 inside `* {}`: dead `border-color`/`outline-color` `color-mix` lines above the live `@apply border-border outline-ring/50`.
7. **Collapse `--nav-hover-shadow` into `--surface-raised-shadow`** — byte-identical in both modes (light: lines ~322 vs ~324; dark: ~400 vs ~401). Keep `--surface-raised-shadow`, delete `--nav-hover-shadow`, and update its consumers (grep `nav-hover-shadow`; known: `global.css` ~733, ~759, ~790, plus `NavMenu.tsx` if plan 001 already landed).

**Do NOT touch in this plan** (deferred to plan 012, needs `src/components/ui/` consumer grep): `--sidebar-*` block, `--chart-1..5`, the `--secondary`/`--muted`/`--accent` triplet, `--card`/`--popover`/`--surface-raised` overlap.

**Protected comments** — do not delete any comment on the keep-list in plan 014 §Protected (e.g. the `can-hover` gotcha at `global.css:6-17`, the outside-`@layer` explanations).

## Typing fix in `src/components/Link.astro`

- Line ~7: replace `[key: string]: any` in Props with `HTMLAttributes<'a'>` from `astro/types` (interface extends it; keep explicit named props).
- Line ~12: delete the comment `// Handle rel attribute for external links` — restates the code below it.
- Note: plan 008 rewrites this component entirely. If executing 008 in the same session, skip the Link.astro part here.

## Acceptance criteria

- `grep -rn "nav-hover-shadow\|link-underline\|card-foreground-muted\|popover-foreground-muted" src/` returns nothing.
- `astro check` clean; site visually unchanged light + dark (tokens deleted were unused; the shadow collapse is value-identical).
