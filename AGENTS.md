# AGENTS.md

## Cursor Cloud specific instructions

Astro 5 + React + Sanity CMS portfolio site (single app, pnpm). Deploys to Vercel.

- Run dev: `pnpm dev` (serves `http://localhost:4321/`). This sets `SANITY_PREVIEW_DRAFTS=true`; without a `SANITY_API_READ_TOKEN` in `.env` it prints a warning and gracefully falls back to published content — the site still fully works. Use `pnpm dev:published` to skip draft preview.
- Sanity `projectId`/`dataset` are committed (public) in `src/sanity/lib/config.ts`, so content loads from the live `production` dataset with no secrets. A `SANITY_API_READ_TOKEN` (Viewer role) is only needed to preview unpublished drafts locally; see `.env.example`.
- Embedded Sanity Studio is served at `/admin` (in-app), but signing in requires Sanity Cloud credentials for project `z2j0j9ei`.
- Lint/typecheck: `pnpm astro check`. Build: `pnpm build`. Type gen from Sanity schema: `pnpm typegen` (regenerates the committed `src/sanity/sanity.types.ts`).
- `.npmrc` sets `enable-pre-post-scripts=true` and `pnpm-workspace.yaml` allows builds for `esbuild`/`sharp`; a plain `pnpm install` handles native deps non-interactively.
- The `astro check` output has one harmless hint (unused type in `SocialLinks.astro`); vite may warn about `react-compiler-runtime`/`lodash/startCase.js` optimizeDeps — both are non-fatal.
