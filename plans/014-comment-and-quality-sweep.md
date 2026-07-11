# 014 — Final comment cleanup + code-quality sweep

**Batch:** 5 (deep pass, run LAST) · **Effort:** ~45 min · **User input:** none

> Run after everything else — earlier plans already remove several offenders (003: global.css stale/commented-out; 008: Link.astro comment; 002: dead class). This is the residue pass.

## Protected comment list — NEVER delete (load-bearing why-explanations)

- `global.css:6-17` — `can-hover` custom-variant gotcha (touch sticky-hover trap)
- `global.css:97-102, 105-109, 126-127` — why a11y overrides live outside `@layer`
- `global.css:444-449` — focus ring "deliberately NOT `:where()`"
- `global.css:782-792` — pre-JS hover fallback rationale
- `global.css:860-867` — why body-link styles are un-layered (the old `.prose a !important` history)
- `Layout.astro:54-58, 65-70` — will-change / backdrop-filter iOS compositing rationale
- `Presence.tsx:83-85` — tabular-nums CLS placeholder rationale
- `TocMobile.tsx:61-63` — Escape-returns-focus a11y note
- `work/[slug].astro:51-61, 148-150` — referrer-aware back-link rationale (may have moved into ArticleLayout via plan 009a — protect wherever it lives)
- `now/index.astro:104-107` — Safari repeating-linear-gradient bug workaround
- `work/companies/[company].astro:11-14` — why routes are nested (Astro two-bare-param build error)
- `uses-icons.ts` header — documents the inline-Lucide pattern
- (Line refs from `e647f5e`; these will have drifted — match by content.)

Borderline-keep: `Callout.astro` `// lucide: info` etc. — they identify icon provenance; keep.

## Removal criteria (fresh grep across src/ — earlier plans changed many files)

Delete a comment only if it: restates the adjacent code in English, is stale/wrong about current behavior, or is commented-out code. When unsure, keep. Match the codebase's existing comment density — this repo comments *why*, sparsely; new code from plans 008/009 should already follow that.

## Quality residue checklist (verify each; most fixed by earlier plans)

- [ ] No unused exports in `src/lib/` (knip-style manual grep of each export)
- [ ] No leftover imports of deleted components (BackLink, Link, H2/H3/H4Block, linkedin2.svg)
- [ ] No remaining `[key: string]: any` in component Props
- [ ] `plans/` directory itself: once ALL plans are executed and the owner confirms, delete the directory (matches the animation-audit precedent) — ask first.

## Acceptance criteria

- `astro check` + `pnpm build` clean.
- Diff review: every removed comment meets a removal criterion; zero protected comments touched (verify by grepping for 3-4 distinctive phrases from the protected list — they must still exist).
