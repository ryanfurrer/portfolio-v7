# Site polish plans — index & execution contract

Created 2026-07-11 from a full diagnostic (3 parallel code audits + icon inventory) and a design review against: Emil Kowalski design-engineering, Rauno web-interface guidelines, make-interfaces-feel-better, and OKLCH color skills. Line refs throughout are from `main` @ `e647f5e` — **re-grep before every edit**.

## Execution contract (applies to every plan)

- **One plan = one commit** (009 = one commit per sub-item), conventional-commit style. Work on `main` or a branch per owner's word at the time.
- **NEVER `git push` without the owner's explicit OK.** Commit freely when asked; pushing deploys via Vercel.
- After schema/query changes: `pnpm typegen`. Before every commit: `astro check`. Verify in the real browser (dev server via `.claude/launch.json`; binds IPv6 `[::1]`) — never ask the owner to check manually; screenshot proof.
- Plans marked "user input" BLOCK on the owner — present options/screenshots and wait.
- Motion no-gos from prior sessions: do NOT re-gate the reveal cascade to once-per-session; do NOT introduce Astro View Transitions (both tried and rejected).

## Order & status

| # | Plan | Batch | Blocks on owner? | Status |
|---|------|-------|------------------|--------|
| 001 | [Me nav hover shadow](001-nav-me-hover-shadow.md) | 1 mechanical | no | ✅ `ad7e716` |
| 002 | [CLS image dimensions](002-cls-image-dimensions.md) | 1 mechanical | no | ✅ `dd4d3ee` |
| 003 | [Dead-weight sweep](003-dead-weight-sweep.md) | 1 mechanical | no | ✅ `9579148` |
| 004 | [Lucide icon standardization](004-lucide-icon-standardization.md) | 2 decided | no | ✅ `0865192` |
| 005 | [Underline metrics unification](005-underline-metrics-unification.md) | 2 decided | no | ✅ `4a07fde` |
| 006 | [/links logo fix](006-links-logo-fix.md) | 2 decided | only for NEW logos | ✅ `0865192` (with 004) |
| 007 | [Brand color exploration](007-brand-color-exploration.md) | 2 taste | **YES — owner picks** | ☐ |
| 008 | [CtaLink unification](008-ctalink-unification.md) | 3 engineering | name sign-off at review | ☐ |
| 009 | [Structural consolidations](009-consolidations.md) | 3 engineering | no | ☐ |
| 010 | [/fixseo run + triage](010-fixseo.md) | 4 runtime | triage review | ☐ |
| 011 | [Responsive breakpoint pass](011-responsive-breakpoint-pass.md) | 4 runtime | **YES — screenshot review** | ☐ |
| 012 | [Color token consolidation](012-color-token-consolidation.md) | 5 deep | end-of-plan visual review | ☐ |
| 013 | [global.css reorg](013-global-css-reorg.md) | 5 deep | no (after 012) | ☐ |
| 014 | [Comment + quality sweep](014-comment-and-quality-sweep.md) | 5 deep, LAST | no | ☐ |

Dependencies: 013 after 012 · 014 last · 004↔008 overlap on CompanyHeader (008 supersedes; see notes in both) · 007 can run anytime the owner is available · 012 notes what 003 already removed.

## Batch 1 execution notes (2026-07-11, Opus 4.8, unpushed)

Two intentional deviations from the plans as written — both improvements, verified in-browser:
- **003 shadow:** instead of deleting `--nav-hover-shadow` and repointing consumers to `--surface-raised-shadow`, **aliased** it (`--nav-hover-shadow: var(--surface-raised-shadow)`) — DRY *and* keeps the semantic name at the nav call sites; also let the redundant dark `--nav-hover-shadow: none` line be dropped (inherits none via the alias). Verified: light = whisper+ring, dark = none, both match siblings.
- **002 body-image dimensions:** the POST/APPEARANCE queries are bare `[0]` projections, so rather than restructure them to expand `asset->metadata.dimensions`, added `imageDimensions()` in `url-for-image.ts` that **parses w×h from the Sanity asset `_ref`** (`image-{id}-{w}x{h}-{fmt}`). No query/typegen change; verified real varied dimensions render with `aspect-ratio` reserved.
- `Button.astro:19` still has `[key: string]: any` — deliberately left for plan 009d (Button rel helper) to keep commits scoped.

## Batch 2 execution notes (2026-07-11, Opus 4.8, unpushed)

- **004 + 006 co-committed** (`0865192`): both edit `links/index.astro`, and the LinkedIn logo swap (delete `linkedin2.svg` + change import) must land together or an intermediate commit wouldn't build. Kept 005 separate (`4a07fde`).
- **005 caught a latent bug:** the body-link `text-decoration-color` used `color-mix(var(--color-foreground) 25%, transparent)` — missing the `in <colorspace>` argument, so the whole declaration was invalid and links fell back to a full-strength currentColor underline instead of the intended faint 25%. Fixed to `color-mix(in oklch, …)` as part of the underline-metrics work. Verified: computes to `oklch(… / 0.25)`.
- **MobileNav** now uses `lucide-react` `Menu`/`X` at `size={20} strokeWidth={1.75}` (matches the old custom-glyph 1.5px-rendered weight). Semantic arrow convention applied: `arrow-up-right` = external on /uses, /links, CompanyHeader.
- **Dev-server gotcha:** deleting `linkedin2.svg` + rapid edits left vite's in-memory module graph with a stale css-analysis edge to the deleted file → console spammed `Failed to fetch dynamically imported module` + `Failed to reload global.css`. NOT a code bug (astro check clean, disk clean). A `preview_stop`→`preview_start` restart cleared it; fresh server logs clean, all modules 200. If this recurs after deleting an imported asset, restart the dev server rather than debugging the code.

## Decisions already made (do not relitigate)

- **`.quiet-link` stays quiet** — the "give it the Cta treatment" idea was reviewed and REJECTED (hierarchy: the underline-wipe is the CTA's emphasis affordance; ToC/footer are high-frequency secondary chrome). Plan 005 is the replacement scope.
- **Semantic arrows:** `arrow-up-right` = external, `arrow-right` = forward, `arrow-left` = back. All icons Lucide except brand logos (site is already ~95% there; 5 swaps in plan 004).
- **BackLink chevron → arrow**, merged into `CtaLink` with `direction` prop (008). Human-readability rules are hard constraints (≤5 props, no polymorphism/factories; see 008/009).
- **Brand color: OPEN** — owner may change hue entirely; resolve via plan 007's in-context comparison, never by fiat. `::selection` + signature decisions hang off it.

## Diagnostic facts worth keeping at hand

- "Me" hovers flat in light mode because the Radix trigger misses `--nav-hover-shadow` (NavMenu.tsx:51 vs global.css:750-768).
- Old logo color: `stroke="#ed3f1c"` (commit `2129f89`), removed in `b01256f` ("indigo rebrand"). No brand token exists anywhere today.
- Biggest CLS: article header images (3 slug pages) + PortableTextImage — raw `<img>`, no dimensions. Good in-repo reference: `links/index.astro:184-189`.
- The "Cta" is `src/components/Link.astro` (no CSS class); third hand-rolled CTA clone hides in `CompanyHeader.astro:46-59`.
- `linkedin2.svg` is a Lucide *outline* among 5 solid simple-icons marks — the /links mismatch.
- Two divergent social-link data sources (lib/social-links.ts: 3 vs links/index.astro inline: 6).
- Breakpoint smell: `md:px-2` ×15 engages at 768 but the grid it aligns to engages at 1024.
