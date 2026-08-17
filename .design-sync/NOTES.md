# design-sync notes

Claude Design project: **portfolio-v7 Tokens**
`https://claude.ai/design/p/3fc2c50b-5af2-489c-afe2-b0e35a569c24`

## What this is

A hand-authored **tokens + patterns** sync (not the standard component
converter — this repo is an Astro app, not a component library). The uploaded
bundle lives in `ds-bundle/` and mirrors the site's design language so the
Claude Design agent produces designs that are 1:1 with the site.

`ds-bundle/` is the source of truth for what's uploaded; it is derived by hand
from `src/styles/global.css` + `public/assets/fonts`. Keep them in step when the
design system changes (see below).

## When the design system changes

The site's CSS is now split into partials under `src/styles/`. If you edit
tokens/patterns there (colors, type, `.lead`/`.prose`, radius, motion) or swap
fonts, update the matching file under `ds-bundle/` by hand, then re-run
`/design-sync` — it reads `.design-sync/config.json`, finds the pinned project,
and re-uploads.

Mapping (site `src/styles/*` → bundle):
- `tokens.css` (`:root` / `.dark` / `@theme inline` color vars) → `ds-bundle/tokens/colors.css`
- `fonts.css` + `tokens.css` `--font-*`  → `ds-bundle/tokens/typography.css`
- `tokens.css` `--radius`/`--shadow-elevated`/`--ease-*` → `ds-bundle/tokens/radius-elevation.css`
- `base.css` `::selection` / focus ring / headings / squircle + `unlayered.css` body links → `ds-bundle/patterns/base.css`
- `components.css` `.lead` / `.small-heading` / `.quiet-link` / `.card-raised` / `.font-mono-custom` → `ds-bundle/patterns/components.css`
- `prose.css` (+ typography-plugin base, reproduced) → `ds-bundle/patterns/prose.css`

## Re-sync 2026-07-27 — PR #35 redesign (viridian)

Re-derived the whole bundle to match the post-PR-#35 site (the bundle had
drifted since 2026-07-09). Key shifts captured:
- **New `--brand` (viridian)**: `oklch(0.64 0.135 164.8)` / #00a577 light,
  `oklch(0.71 0.124 164.8)` / #44b98e dark. The system is NO LONGER "no brand
  hue" — viridian is the one reserved hue (logo, signature, `::selection` tint;
  never for text). Updated the narrative in `colors.css`, `styles.css`, README.
- **Off-white canvas + raised cards**: `--background` white → `oklch(0.971)`;
  `--surface`/`--surface-hover` dropped to `0.955`/`0.94` (recessed BELOW the
  canvas); new `--surface-raised`(+`-shadow`) and `--nav-hover-shadow`; new
  `.card-raised` pattern (white card lifts off the gray ground).
- On-surface shadcn `*-foreground` tokens now alias `--foreground(-muted)`.
- `--foreground-muted` light nudged `#6e6e73` → `#6b6b70`.
- `.small-heading` is now a **Berkeley Mono** 13px/400 eyebrow (was Geist
  uppercase 12px/500); `--tracking-label` `0.06em` → `0.025em`.
- Inline code (`prose.css`) got a deeper fill (`oklch(0.925)`) + hairline ring
  in light, with a dark override.
- Body links: `text-underline-offset` 2px → 3px, added `text-decoration-thickness: 1.5px`.

Local render reference: `ds-bundle/_preview/index.html` (open in a browser,
add `class="dark"` to `<html>` for dark). NOT uploaded (outside the write globs).
`radius-elevation.css` and the 7 font files were unchanged — not re-uploaded.

## Re-sync 2026-08-17 — orange-brand / Google-Sans redesign

Re-derived the whole bundle from the split `src/styles/` partials; it had drifted
badly since the 2026-07-27 viridian re-sync. Key shifts captured:
- **Brand: viridian → orange** `oklch(0.659 0.194 37.5)` / #F05A29, the SAME hue
  in both themes. `::selection` is now a **solid brand fill + dark ink** (was a
  color-mix tint).
- **Neutrals are slightly COOL** now (neutral×zinc mix at hue 286, both themes) —
  the ramp carries a faint blue undertone; chroma 0.003–0.008.
- **Canvas: off-white → pure white** in light (`--background`/`--card`/`--popover`
  all `oklch(1 0 0)`); separation now comes from a recessed `--muted` container
  step + hairlines + shadow. The old `--surface`/`--surface-raised`/`--badge`/
  `--link*`/`--nav-active`/`--foreground-subtle` tokens were DELETED upstream and
  removed from the bundle.
- **Text tiers renamed**: `--foreground-muted` → `--subtle-foreground` (mid tier,
  AA-safe small), plus `--muted-foreground` (light tier, sub-AA small). `.lead`/
  `.small-heading`/`.quiet-link`/prose body sit at `--subtle-foreground`.
- **`.badge` deleted** (dead upstream) — removed the pattern + all README/preview refs.
- **Headings 800 → 600**, radius `0.375rem → 0.5rem`.
- **Fonts: Geist → Google Sans.** The site loads Google Sans via the Astro Google
  provider (no local woff2), so the bundle ships the two static weights it renders
  (400 Regular + 600 SemiBold, copied from `src/assets/og/fonts`). 500/700 snap to
  the nearest. Deleted the two Geist variable woff2. Berkeley Mono (4 faces, PAID)
  + Permanent Marker unchanged.
- **`.no-underline` is now DEFINED** in the bundle (`color: inherit; text-decoration:
  none`). It's a Tailwind utility on the site, but in the standalone bundle a bare
  `<a class="no-underline">` was falling back to UA blue+underline (caught in the
  headless render). This makes card/nav/CTA anchors inherit the surrounding ink.

Verified via headless-Chrome render of `_preview/index.html` (light + dark) —
fonts load, cards read neutral, brand + selection are orange, dark ramp correct.
NOT uploaded (outside the write globs; open it locally, add `class="dark"` to
`<html>` for dark).

## Deliberately not synced

- **Tailwind utilities** — the site's layout/spacing is Tailwind; the design
  agent has its own Tailwind, so only the brand tokens/patterns are shipped.
- **JS-driven effects** — entrance reveal (`[data-reveal]`) and traveling-
  highlight hover (`[data-dir-hover-list]`) need scripts; omitted on purpose.
- **shadcn React components** — not CSS; rebuild in Claude Design from tokens.
- **Fonts trimmed** to the ones actually used — Google Sans 400/600 (static ttf),
  4 static Berkeley Mono (Regular/Bold × upright/oblique), and Permanent Marker.
  Google Sans is bundled locally instead of `@import`ed so the bundle is
  self-contained and can't silently fall back to Inter in the design environment.
- **shadcn `--chart-*` / `--sidebar-*`** — dormant token sets that ship on the
  site but render on no surface; omitted from the bundle to keep the vocabulary
  to what the agent should actually reach for.
