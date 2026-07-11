# 012 — Color token consolidation

**Batch:** 5 (deep pass) · **Effort:** ~1.5 hr · **User input:** review the visual sweep at the end; no upfront decisions

> Line refs from `main` @ `e647f5e`. Re-grep before editing. Plan 003 already removed `--link-underline`, `--card-foreground-muted`, `--popover-foreground-muted` and merged `--nav-hover-shadow` — don't re-do.

## Diagnosis (token audit 2026-07-11, `src/styles/global.css`)

Duplicate clusters (light values shown; dark mirrors the same duplication):
- `--secondary` = `--muted` = `--accent` = `oklch(0.97 0 0)` (lines ~338/340/342) — shadcn leftovers.
- `--card` = `--popover` = `--surface-raised` = `oklch(1 0 0)` (~329/332/321); `--card-foreground` = `--popover-foreground` (~330/333).
- `--primary` = `--secondary-foreground` = `--accent-foreground` = `oklch(0.205 0 0)`.
- Whole `--sidebar-*` (10 tokens, ~369+) and `--chart-1..5` (~364+) blocks: zero references in app code.

## Method (safety first — shadcn primitives are the trap)

1. **Grep `src/components/ui/` for every candidate token's Tailwind utilities** (`bg-accent`, `text-accent-foreground`, `bg-secondary`, `bg-muted`, `text-muted-foreground`, `bg-popover`, `bg-card`, `bg-sidebar`, `chart-`) — sheet.tsx and any other primitives consume tokens via classes, not `var()`. Anything consumed stays defined (but may be *aliased*).
2. Delete outright: `--sidebar-*` and `--chart-*` **if and only if** step 1 finds zero consumers. Also remove their `@theme inline` mappings (~lines 239-298).
3. For consumed-but-duplicate tokens, alias instead of fork: e.g. keep `--muted` as the real value and set `--secondary: var(--muted); --accent: var(--muted);` (or delete the utility mapping if only one is consumed). Goal: one source of truth per *visual role*, tokens for *component compatibility* become aliases. Keep the semantic distinction `--surface-raised` (app concept) vs `--card`/`--popover` (shadcn concepts) via aliasing, not triplicated literals.
4. **Theme-color meta alignment:** `Head.astro:28,43` + `ModeToggle.tsx:36` hardcode `#ffffff`/`#1a1a1a` while the actual light canvas is `#f5f5f7` (`--background` ≈ oklch(0.971 0 0)). Set light theme-color to `#f5f5f7` (all three places; they must stay in sync — add a one-line comment in Head.astro pointing at ModeToggle.tsx and vice versa). Dark `#1a1a1a` ≈ oklch(0.165) — verify and keep.
5. Known intentional non-tokens — leave alone: `now/index.astro` scoped note-card oklch values, `Callout.astro` semantic palette classes, `links/index.astro` brand tile colors, `Presence.tsx` emerald status dot, black/white opacity scrims.
6. `--brand` from plan 007: if it exists by now, it's the ONLY chromatic token — make sure it reads as such (placed with links/nav tokens, commented with its consumers).

## Acceptance criteria

- No two tokens hold identical literals in both modes (aliases OK — that's the point).
- `grep -c "oklch(0.97 0 0)"` etc. → 1 per unique value per mode.
- `astro check` + `pnpm build` clean.
- **Full visual sweep, light + dark**: home, writing index+post, work index+post+company hub, /uses, /links, /now, /about, mobile nav open, mode toggle popover, a sheet/dialog if reachable. Screenshot set for owner review — zero intended visual change.
