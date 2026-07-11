# 013 — Reorganize global.css (pure moves, zero behavior change)

**Batch:** 5 (deep pass) · **Effort:** ~1 hr · **User input:** none · **Prereq:** run AFTER 012 (only reorganize surviving rules)

> Structure snapshot from `main` @ `e647f5e` (906 lines); re-map before moving.

## Current order (the problem)

imports(1-4) → custom variants(6-17) → @font-face×8(19-73) → html base(75-81) → a11y preference queries(83-149) → ::selection(151) → scrollbar(158) → mobile-menu keyframes(188) → **@theme inline(239)** → **:root(300)** → **.dark(379)** → @layer base: focus/headings/.quiet-link/.badge/.prose/dir-hover(437-793) → reveal keyframes(795) → TOC(830) → body links(860) → @utility touch-hitbox(890)

Issues: tokens defined mid-file AFTER consumers (a11y queries at 83 reference `--border`/`--popover`); keyframes scattered in 3 places; link styling split (`.quiet-link` in-layer at 491, body links out-of-layer at 860); `@utility` orphaned at EOF.

## Target order

1. imports
2. custom variants (`dark`, `can-hover`) + `@utility touch-hitbox`
3. `@theme inline`
4. `:root` (light tokens)
5. `.dark` (dark tokens)
6. `@font-face` (all 8)
7. base element rules (`html`, `::selection`, scrollbar)
8. a11y preference queries (reduced-motion / reduced-transparency / prefers-contrast) — **stays outside `@layer`; keep the existing comments explaining why**
9. all `@keyframes` in one "Animations" section (mobile-menu, nav-stagger, reveal)
10. `@layer base` component classes (focus ring, headings, `.font-mono-custom`, `.quiet-link`, `.small-heading`, `.badge`, `.squircle`, `.card-raised`, `.prose`, dir-hover)
11. un-layered overrides LAST, under one banner comment explaining the layer boundary: body links, TOC active/gutter, pre-JS hover fallback, reveal arming

## Rules (this is where reorgs go wrong)

- **Pure moves only.** No value edits, no selector edits, no consolidation — that was 012. If you spot a problem, note it in the commit message, don't fix it here.
- **Cascade care:** un-layered rules beat layered ones regardless of order, so moving layered↔unlayered blocks relative to each other is safe. BUT relative order WITHIN the un-layered group and WITHIN `@layer base` must be preserved wherever selectors could co-match an element (e.g. body-links vs `.quiet-link` vs TOC links — check which selectors can hit the same `<a>`). When in doubt, keep the original relative order inside each group.
- **Protected comments** (plan 014 §Protected) move WITH their rules, verbatim: `can-hover` gotcha (6-17), why-outside-`@layer` notes (97-109, 126-127, 444-449, 782-792, 860-867), Safari gradient workaround refs, etc.
- Section banner comments: plain and few (`/* ===== Tokens ===== */` tier), not ASCII art.

## Acceptance criteria

- `pnpm build` clean; built CSS may reorder but the **rendered site is pixel-identical**: repeat the plan-012 visual sweep (same page list, light + dark) and compare against 012's screenshot set.
- `git diff --stat` shows global.css only.
- A reader can find any rule from the 11-section table of contents alone.
