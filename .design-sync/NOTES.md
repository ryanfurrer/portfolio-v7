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

If you edit tokens/patterns in `src/styles/global.css` (colors, type scale,
`.lead`/`.badge`/`.prose`, radius, motion) or swap fonts, update the matching
file under `ds-bundle/` by hand, then re-run `/design-sync` — it reads
`.design-sync/config.json`, finds the pinned project, and re-uploads.

Mapping (site → bundle):
- `:root` / `.dark` color vars          → `ds-bundle/tokens/colors.css`
- fonts + `--font-*` + type scale       → `ds-bundle/tokens/typography.css`
- `--radius*`, `--shadow-elevated`, `--ease-*` → `ds-bundle/tokens/radius-elevation.css`
- headings / focus ring / body links / `::selection` → `ds-bundle/patterns/base.css`
- `.lead` / `.small-heading` / `.badge` / `.quiet-link` / `.card-raised` → `ds-bundle/patterns/components.css`
- `.prose` article system               → `ds-bundle/patterns/prose.css`

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

## Deliberately not synced

- **Tailwind utilities** — the site's layout/spacing is Tailwind; the design
  agent has its own Tailwind, so only the brand tokens/patterns are shipped.
- **JS-driven effects** — entrance reveal (`[data-reveal]`) and traveling-
  highlight hover (`[data-dir-hover-list]`) need scripts; omitted on purpose.
- **shadcn React components** — not CSS; rebuild in Claude Design from tokens.
- **Fonts trimmed** to the ones actually used — 2 variable Geist (upright +
  italic), 4 static Berkeley Mono (Regular/Bold × upright/oblique), and
  Permanent Marker — renamed bracket-free so URLs resolve in the design
  environment. (Mono swapped Geist Mono → Berkeley Mono, 2026-07-09, matching
  the site's font change in commit 85407a6.)
