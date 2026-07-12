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
| 008 | [CtaLink unification](008-ctalink-unification.md) | 3 engineering | name sign-off at review | ✅ `5b58553` |
| 009 | [Structural consolidations](009-consolidations.md) | 3 engineering | no | ✅ a=`09a7981` b=`ba9b7fa` c=`9db0a48` d=`9c158ae` e=`75306b9` |
| 010 | [/fixseo run + triage](010-fixseo.md) | 4 runtime | triage review | ✅ canonical `2c…`, JSON-LD+icon done |
| 011 | [Responsive breakpoint pass](011-responsive-breakpoint-pass.md) | 4 runtime | **YES — screenshot review** | ✅ nav-pill wrap fix (PR5) |
| 012 | [Color token consolidation](012-color-token-consolidation.md) | 5 deep | end-of-plan visual review | ✅ reframed → drift fix (PR6) |
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

## Batch 3 execution notes (2026-07-11, Opus 4.8, unpushed)

- **008 CtaLink**: kept the `CtaLink` name (not renamed at review — no objection surfaced). `direction="back"` uses a full arrow-left (`M19 12H5` + `m12 19-7-7 7-7`), NOT the old chevron. Back links now carry the underline-wipe too (unified identity). Verified the referrer-aware back rewrite still finds the `[data-back]`/`[data-back-label]` hooks and works click-through from a company hub. All colors unified to foreground-muted→foreground (CompanyHeader's old `text-link` dropped).
- **009 sub-items** committed separately (each builds). Notable:
  - **009b**: one `HeadingBlock` reads Portable Text `node.style` (h2|h3|h4) — confirmed available (rendered 5×H2 + 10×H3 correctly, ToC anchors resolve).
  - **009d**: the third rel-logic site, `ui/Button.astro`, was **dead code** (zero imports) → deleted (also cleared its `[key:string]:any`, so that INDEX todo is now resolved). Helper `externalRel()` lives in `utils/links.ts` (not a new file — co-located with `formatFollowerCount`). `rel` param widened to `string | null` (HTMLAttributes allows null).
  - **009c**: unified `socialLinks` stores the data **footer-order first**, and the Links page **sorts by follower count at render** — so both orderings are preserved AND the follower-desc order is now explicit code, not a manual array invariant. Icon keys → SVG components mapped in `links/index.astro` (data file stays framework-import-free). Also renamed SocialLinks' type to `Props` (cleared the stale hint → 0 hints now).
  - **009a**: `ArticleLayout.astro` takes common data as props; work's extras stay in its page via `header-extra` + `scripts` named slots (the referrer script targets the CtaLink back links). `title` prop typed `string | null | undefined` (query returns `string | undefined`). Removed ~200 lines of triplication.
- Full `pnpm build` clean (20 pages). `astro check`: 0 errors / 0 warnings / **0 hints**.

## Batch 4 execution notes (2026-07-11, Opus 4.8, unpushed)

**010 /fixseo** — scanned the production build (served `dist/` via `npx serve`; report at `plans/010-fixseo-report.md`). 34 findings (0 high / 4 med / 30 low). Disposition:
- **Fixed:** canonical URLs (`<link rel=canonical>` in Head, per-page absolute); JSON-LD (Person on home w/ all socials as `sameAs`; BlogPosting on writing, Article on work/appearances via ArticleLayout `schemaType` prop; threaded Layout→Head via `jsonLd` prop, `is:inline`); apple-touch-icon (180×180 PNG, atom mark on `#1d1d1f`, generated with `@resvg/resvg-js` — regen script was throwaway in scratchpad; `public/apple-touch-icon.png` is the committed artifact).
- **Owner declined (keep as-is):** meta description length (94 chars) — the section `description` in `sections.ts` is triple-purpose (on-page lede + meta + OG card subtitle) so can't be lengthened without bloating display; home `SITE_DESCRIPTION` is decoupled but owner prefers the current punchy line, revisit only if real SEO issues appear. Title length (44 chars) — branded, fine.
- **False positives (no action):** "no sitemap.xml" (site ships `sitemap-index.xml`, referenced in robots.txt + `<link rel=sitemap>`); hreflang (single-language, i18n parked); content-too-short (index/listing pages are inherently short).

**011 responsive** — the sweep (375/768/1024/1280) showed the layout is solid and intentional (consistent center-column width via reserved gutters = deliberate; `md:px-2` scatter left as-is per readability > DRY). BUT the owner caught a real bug the sweep missed: at `lg` the navbar is confined to the center grid column (~528px at 1024, narrower than the sub-`lg` 672px until ~1152), squeezing the status pill so `NYC HH:MM` wrapped to two lines across ~1024–1152. Fixed with `whitespace-nowrap` (Presence time) + `shrink-0` (pill). This is **PR5 = `polish/5-responsive`** (base `polish/4-seo`).

**`md:px-2` centralization DONE after all** (`0c84ad0`) — owner asked to audit the x-padding; the ~15 scattered `md:px-2` turned out to be *missing* from `ArticleLayout`, so article headings sat 8px left of listing headings at md+ (a real seam). Moved the 8px inset onto the Layout center column (one declaration); dropped the ~15 scattered copies (Navbar keeps its own — separate header container); simplified `Item` to uniform `-mx-2 p-2` (pill bleeds into the column padding at md+ like it bled into `px-4` on mobile). Behavior-identical for listing pages (headings/items still 56px @768), article now matches (was 48). Verified 375/768/1024, no overflow, lg gutters clean.

**012 REFRAMED by owner** — do NOT delete/alias shadcn tokens (`--sidebar-*`, `--chart-*`, `--secondary/--muted/--accent`, etc.); shadcn/ui expects them to exist even when values match, so removal risks breaking primitives. Instead this became a **value-drift audit**: find near-identical neutrals that drifted apart and reconcile. Ran a full OKLCH lightness cluster of every neutral (light + dark). Findings:
- **Fixed (PR6 `polish/6-tokens-css`):** `theme-color` had drifted off `--background` — light `#ffffff` vs canvas `oklch(0.971)=#f5f5f5`; dark `#1a1a1a`(L0.218) vs canvas `oklch(0.165)=#0e0e0e`. Pointed both at the exact canvas hexes (static meta + 2 runtime setters in Head.astro/ModeToggle.tsx); fixed the wrong dark `--background` comment. Owner chose to KEEP the dark canvas at #0e0e0e (0.165), not lighten to #1a1a1a.
- **Not drift (left):** `#f5f5f7`(dark fg)=`oklch(0.971)`(light bg) is intentional symmetry; `foreground-muted`/`ring`/`muted-foreground` (~0.53–0.556 light, ~0.708–0.711 dark) are close but genuinely different roles (Apple text / focus ring / shadcn text).
- **Text harmony DONE (owner asked to reconcile):** shadcn on-surface text tokens (card/popover/secondary/accent/sidebar-foreground) aliased to `var(--foreground)` and `muted-foreground` to `var(--foreground-muted)` — so text reads identically whether a native element or shadcn primitive renders it. Tokens kept intact (shadcn needs them); values reconciled. primary/destructive-foreground stay on-fill contrast colors.
- **`/now` paper DONE (owner picked via in-browser ui.sh picker):** paper white → `var(--card)` (light pure white oklch(1), dark oklch(0.215)); dropped the dark `oklch(0.21)` override since base var(--card) resolves per mode. The 0.999/0.21 drift is gone; paper now IS the raised-card surface.
- **Left (not drift):** OG-card `#1a1a1a` bg (`render-card.ts`) is a standalone share-image surface, not the site canvas.

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
