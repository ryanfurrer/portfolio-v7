# 011 — Responsive breakpoint audit & consolidation

**Batch:** 4 (runtime audits) · **Effort:** ~2 hr · **User input:** YES — owner reviews screenshots of the 768–1023 range before/after; taste calls flagged inline

> Line refs from `main` @ `e647f5e`. Re-grep before editing.

## Diagnosis (2026-07-11 audit)

Only `sm:`(24) `md:`(39) `lg:`(27) are used; no `xl:`/`2xl:`; no width `@media` in CSS (all preference queries). The structure:

- **The one big jump:** `Layout.astro:76,93` — single column until `lg:` (1024), then `lg:grid-cols-[12rem_1fr_12rem]`; both gutters `hidden lg:block` (`:96,:117`). The 768–1023 tablet range shows a narrow `max-w-2xl` column with big empty margins.
- **Mixed-breakpoint concerns:**
  - Nav switches desktop/mobile at `sm:` (`Navbar.astro:65,100`) while the grid engages at `lg:`. Probably fine (intentional), but evaluate.
  - **`md:px-2` copy-pasted ~15×** across page headers/sections (`index.astro:27`, `writing/index.astro:22,35`, `work/index.astro:41`, `uses/index.astro:27,40`, `about/index.astro:22`, `now/index.astro:23,31`, `Footer.astro:20`, `Navbar.astro:38`) with `Item.astro:30,32,64` using `md:mx-0`/`md:p-2` to offset a `-mx-2` bleed. The nudge engages at 768 but the grid it aligns to engages at 1024 — misaligned by a whole breakpoint tier, and the value is scattered.
  - Item rows reflow (stack→flex, connector rule, meta indent) at `md:` (`Item.astro:36,57,64`) — independent of the `lg` grid.
  - Links grid `grid-cols-2 md:grid-cols-3` (`links/index.astro:123`) — cards get very wide ≥1024.
- Container widths are consistent (`max-w-280` everywhere) — no action.

## Changes (in order of confidence)

1. **Centralize `md:px-2`:** move the inset to `Layout.astro` (one wrapper class or a named utility, e.g. `@utility page-inset`) so the value lives in one place; delete the ~15 scatter sites. Behavior-preserving first — same breakpoint, same value — THEN evaluate step 2.
2. **Reconcile the md/lg mismatch:** with the inset centralized, try moving it (and possibly the Item-row reflow) to `lg:` to match the grid, OR leave at `md:` if the 768–1023 range looks better with it. **Screenshot both options at 768/834/1024 and show the owner — taste call.**
3. **Links grid:** evaluate `sm:grid-cols-2 md:grid-cols-3` vs adding an `lg:` cap or max-width on cards at desktop. Screenshot options — taste call.
4. Verify the `sm:` nav switch feels right at 640–767 (hamburger vs row) — likely no change; flag only if broken.

## Method

Dev server + browser resize sweep: 375, 640, 768, 834 (iPad), 1024, 1120, 1440 — screenshot each on home, a writing post (ToC gutter), /links, /uses. Compare before/after per change. Re-run the CLS check from plan 002 at 768 (images sized per-viewport).

## Acceptance criteria

- `grep -rn "md:px-2" src/` → ≤1 site (the central one).
- No mid-range (768–1023) layout looks accidentally half-engaged; owner has approved the screenshot set.
- No new breakpoint tiers introduced without cause (`xl:` stays unused unless a screenshot proves need).
