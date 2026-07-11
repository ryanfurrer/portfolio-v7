# 004 — Lucide everywhere + semantic arrow convention

**Batch:** 2 (small design decisions, already decided) · **Effort:** ~45 min · **User input:** none (convention approved 2026-07-11)

> Line refs from `main` @ `e647f5e`. Re-grep before editing.

## Directive (owner decision)

Every icon on the public site comes from **Lucide**, except brand logos. A full inventory (2026-07-11) found the site is already ~95% Lucide; exactly **5 render sites** need swapping.

**Semantic arrow convention (approved):**
- `arrow-up-right` (diagonal) = link **leaves the site** (external)
- `arrow-right` (horizontal) = **forward** within the site
- `arrow-left` = **back** within the site

**Exempt (do not touch):** the 6 simple-icons brand glyphs in `src/assets/icons/`, the personal monogram in `Navbar.astro:45-63`, Sanity Studio's `@sanity/icons` (admin-only), the Presence status dot (CSS, not an icon), OG render code.

## How Lucide is consumed here (follow these patterns)

- React islands: `import { Foo } from "lucide-react"` (v0.575 installed; e.g. ModeToggle, NavMenu).
- `.astro` files: hand-inline the icon's **inner path markup** in a `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">` wrapper — the documented house pattern (`src/lib/uses-icons.ts`, `Callout.astro`).

## The 5 swaps

| Location | Current | Replace with |
|---|---|---|
| `MobileNav.tsx:44-57` | custom hamburger SVG (20×20, `M3 6h14M3 10h14M3 14h14`) | lucide-react `Menu` |
| `MobileNav.tsx:72-85` | custom ✕ SVG (20×20) | lucide-react `X` |
| `Item.astro:47-54` | unicode `↗` span | inline Lucide `arrow-up-right` (`<path d="M7 7h10v10"/><path d="M7 17 17 7"/>`) |
| `CompanyHeader.astro:46-59` | unicode `→` span ("Visit website" — external) | inline Lucide `arrow-up-right` |
| `links/index.astro:143-151` | unicode `→` span (social cards — external) | inline Lucide `arrow-up-right` |

## Motion spec (one spec for all external arrows)

Use the existing /uses treatment (`Item.astro:47-54`) as canon:
`transition-[color,translate] duration-200 ease-out`, hover/focus-visible moves `translate-x-0.5 -translate-y-0.5` and color shifts `foreground-subtle → foreground`. All hover motion gated behind the `can-hover:` variant (house rule — see comment `global.css:6-17`). Keep each site's existing group scope (`group/item`, `group/cta`, plain `group`).

## Craft details

- **Optical weight:** the custom MobileNav glyphs were drawn lighter than Lucide's default `stroke-width=2` at 24px. Match the previous optical size: render `Menu`/`X` at `size={20}` and try `strokeWidth={2}` first; if visibly heavier than before, drop to `1.75`. Judge by eye in the browser, not by numbers.
- **Item.astro sizing:** the `↗` was `text-xs` (~12px glyph within a 16px line). Size the replacement SVG `size-3` or `size-3.5` — compare against the old rendering; it should not get louder, it's a whisper affordance.
- Preserve the `aria-hidden="true"` / decorative treatment on all swapped icons (they accompany visible text).
- **Ordering note:** plan 008 rebuilds CompanyHeader's CTA into the shared `CtaLink` component. If 008 executes in the same session, skip the CompanyHeader row here and let 008 handle it (with `direction="external"`).

## Acceptance criteria

- `grep -rn "↗\|→" src/ --include="*.astro" --include="*.tsx"` finds no icon-duty unicode arrows (prose/comment usage OK).
- No custom-geometry SVGs remain in MobileNav.
- Hover/focus motion on /uses rows, /links cards, and CompanyHeader identical in kind (diagonal nudge + color).
- `astro check` clean.

## Verify

Dev server: /uses (rows), /links (cards), a company hub page, mobile nav open/close at mobile viewport. Screenshot before/after of the mobile nav icons for the weight check. Test one touch-emulated tap on /uses to confirm `can-hover` gating still prevents sticky hover.
