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
- headings / focus ring / body links    → `ds-bundle/patterns/base.css`
- `.lead` / `.small-heading` / `.badge` / `.quiet-link` → `ds-bundle/patterns/components.css`
- `.prose` article system               → `ds-bundle/patterns/prose.css`

## Deliberately not synced

- **Tailwind utilities** — the site's layout/spacing is Tailwind; the design
  agent has its own Tailwind, so only the brand tokens/patterns are shipped.
- **JS-driven effects** — entrance reveal (`[data-reveal]`) and traveling-
  highlight hover (`[data-dir-hover-list]`) need scripts; omitted on purpose.
- **shadcn React components** — not CSS; rebuild in Claude Design from tokens.
- **Fonts trimmed** to the 4 actually used (3 variable Geist + Permanent
  Marker), renamed bracket-free so URLs resolve in the design environment.
