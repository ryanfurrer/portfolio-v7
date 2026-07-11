# 010 — Run /fixseo, triage, apply

**Batch:** 4 (runtime audits) · **Effort:** scan ~15 min; fixes unknown until scanned · **User input:** triage review before applying non-obvious fixes

## Steps

1. Invoke the **`fixseo` skill** (Skill tool) — it scans a website and produces a detailed SEO issue report. Give it the local site: start the dev server via `.claude/launch.json` (binds IPv6 `[::1]`) or better, `pnpm build && pnpm preview` for production-accurate HTML (OG images are build-time Satori — a build catches them, dev may not).
2. Save the report to `plans/010-fixseo-report.md`.
3. Triage into: (a) mechanical fixes — apply immediately (missing meta, broken canonical, sitemap issues, alt text, heading order); (b) content/taste calls — list for the owner (title phrasing, description copy); (c) false positives for a static Astro portfolio — note and skip with one-line reasons.
4. Apply (a); commit as `fix(seo): …` with the report reference.

## Context the scanner won't know

- OG image generation is DONE and live (PR #31): build-time Satori, per-page images incl. 7 section cards. If the scanner flags OG images on dev, verify against a real build before "fixing".
- Site is fully static (Vercel); no SSR runtime.
- `src/components/Head.astro` is the central head component — most meta fixes land there.
- Known pre-existing nit: `<meta name="theme-color">` is `#ffffff` while the actual canvas is `#f5f5f7` (`Head.astro:28,43`, `ModeToggle.tsx:36`) — in scope for plan 012, don't double-fix.

## Acceptance criteria

- Report saved; every finding dispositioned (fixed / owner-review / skipped-with-reason).
- `pnpm build` clean after fixes.
