# AGENTS.md

Astro 7 + React 19 islands + Sanity v6 CMS + Tailwind v4 portfolio (single app, pnpm). Static build, deploys to Vercel. `CLAUDE.md` is a symlink to this file — one source of truth across tools.

## Setup & commands

- Dev: `pnpm dev` (`http://localhost:4321/`, binds IPv6 `[::1]`). Sets `SANITY_PREVIEW_DRAFTS=true`; without a `SANITY_API_READ_TOKEN` in `.env` it warns and falls back to published content — the site still fully works. `pnpm dev:published` skips draft preview.
- Lint/typecheck: `pnpm astro check`. Build: `pnpm build`. Sanity types: `pnpm typegen` (regenerates committed `src/sanity/sanity.types.ts`).
- Sanity `projectId`/`dataset` are committed (public) in `src/sanity/lib/config.ts`; content loads from the live `production` dataset with no secrets. A Viewer `SANITY_API_READ_TOKEN` is only needed to preview drafts locally (`.env.example`). Embedded Studio at `/admin` (project `z2j0j9ei`).
- `.npmrc` `enable-pre-post-scripts=true` + `pnpm-workspace.yaml` build allowlist (`esbuild`/`sharp`) let a plain `pnpm install` handle native deps non-interactively.
- Known-harmless noise: one `astro check` hint (unused type in `SocialLinks.astro`); vite optimizeDeps warnings for `react-compiler-runtime` / `lodash/startCase.js`.

## Working style (read this first)

- **Ask before every commit and every push, naming what's included.** "Do X" / "clean up Y" means do the *work* only — never commit or push it. A "yes" approves exactly the pass in front of you, not the next one. Don't chain approvals across passes.
- Pushing deploys: a push to `main` ships via Vercel; a branch push updates its draft PR. Never push without an explicit OK.
- **Correctness over speed. No "good enough."** Never call something fixed until the real rendered/computed result is confirmed — inspect the actual output, don't assume. When the browser extension is down, fall back to headless Chrome (`--headless=new --screenshot` / `--dump-dom`) or token-value mocks rather than guessing at feel.
- Work on feature branches; the user drives merges to `main`.

## Conventions (non-negotiable)

- **Logical/directional CSS only** — `ms/me`, `ps/pe`, `start/end`, `border-s/-e`, `rounded-s/-e`. Never physical (`ml/mr`, `left/right`), even though no RTL locale ships today.
- **WCAG 2.1 AA** on every user-facing surface: semantic HTML, labelled controls, text alternatives, keyboard operability, visible focus, `prefers-reduced-motion`, contrast minimums.
- **All colors in OKLCH.** Fix contrast by adjusting L only; keep C and H.
- **Comments explain *why*, never *what*.** Default to none; no JSDoc on self-explanatory internals, no layout/section comments.
- **shadcn tokens are the single design vocabulary.** Add a custom token only where shadcn has no concept; never duplicate an existing one. Don't prune the dormant `--chart-*` / `--sidebar-*` tokens.
- **Avoid arbitrary values.** Reach for the design scale and existing tokens/utilities before a one-off Tailwind arbitrary (`text-[...]`, `bg-[...]`, `[clamp(...)]`) or a hard-coded literal. When a value is design-significant or will recur, **discuss adding a token with the user first** rather than introducing an arbitrary value or a new token unilaterally.

## Design system

- **Brand accent:** orange `oklch(0.659 0.194 37.5)` (`#F05A29`) — `--brand`, used for marks / tints / focus rings only; too light for body text. (`--brand-strong` was intentionally removed; there is one brand tier.)
- **Text tiers:** `--foreground` (strong) → `--subtle-foreground` (mid; clears AA at small sizes — utility `text-subtle-foreground`) → `--muted-foreground` (light; deliberately below AA at small sizes, for large/secondary text). Never swap the subtle tier for muted on small text.
- **Neutrals are slightly cool** (neutral×zinc mix at hue 286), both themes. Dark mode is driven by a `.dark` class, not a media query.
- **Motion:** two curves — `--ease-out-curve` (entrances/exits) and `--ease-ios-curve` (`ease-ios`, playful zooms). Principle: **one entrance per container** — a parent fade *plus* staggered children is a double-entry; decouple the surface layer so the frame fades while content staggers (see `Container.astro` + `reveal-panel-surface`). The reveal cascade is gated behind JS+motion (`.reveal-init` added before paint), skipped under `prefers-reduced-motion`, with a 2s CSS failsafe. Motion changes go through the `review-animations` / `improve-animations` bar.
- **Elevation & hover:** page bg → `--muted` container (recessed) → each hover affordance lifts relative to *its own* background. Nav sits on the page, so nav hover recesses to a `--muted` chip defined by `--nav-hover-shadow` (muted-on-white is otherwise too faint). Item rows sit inside a muted container, so they lift to a raised white card (`--item-hover`). Dropdown items sit on the elevated popover (≈ muted in dark), so in dark they lift to `--accent` one tier up. Active nav state is a ghost ring (`ring-1 ring-inset ring-border`), not a solid pill. The traveling hover highlight is the `dir-hover` system (`src/scripts/dir-hover.ts` + `dir-hover.css`), with a pre-JS CSS fallback.
- **CSS is split:** a ~17-line `global.css` entry `@import`s partials in `src/styles/` (tokens / fonts / base / menu / components / prose / image-zoom / dir-hover / unlayered / utils). **Layer rule:** element defaults → `@layer base`; named/feature classes → `@layer components`; utilities → `@utility`; deliberate cascade overrides → unlayered. Import order is load-bearing — don't reorder casually.
- **Fonts:** the site renders **Google Sans** (sans), **Berkeley Mono** (mono, **PAID — link to buy, never redistribute the files**), and **Permanent Marker** (cursive, used sparingly). Geist / Geist Mono still ship in the repo as a not-yet-removed fallback (`--font-sans` lists Geist after Google Sans) but are not the active faces — the bundled GeistMono + static Geist weight files are dead and slated for removal.
- A dev-only `/brand` page (`src/pages/_dev/brand.astro`, route injected only when `command==="dev"`) documents the live tokens, type, motion, and components — the canonical visual reference. Not in the prod build/sitemap/OG until it's made public.

## Sanity

- The Astro client reads **published documents only** — seed/preview docs must be published to appear on the live site.
- Run `pnpm typegen` after any schema or query change; queries live in `src/sanity/lib/queries.ts` via `defineQuery`.
- Single canonical embedded Studio at `/admin` (auto-syncs via Vercel on merge to `main`). Content types: post, project (+ optional company ref), appearance, about (singleton), now, company. Company hubs at `/work/companies/[company]`.
