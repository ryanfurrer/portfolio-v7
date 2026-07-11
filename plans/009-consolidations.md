# 009 — Structural consolidations (readability-first)

**Batch:** 3 (engineering) · **Effort:** ~2-3 hr · **User input:** none, but commit each sub-item separately for easy revert

> Line refs from `main` @ `e647f5e`. Re-grep before editing.

## Owner's readability rules (hard constraints for every sub-item)

1. Explicit beats generic — no clever polymorphism, no factories/metaprogramming.
2. A page file must remain understandable WITHOUT opening the shared file: "here's my data, here's my extras."
3. If a shared abstraction needs a comment to explain a prop, the prop is wrong.
4. Consolidation is a means; if the shared version is harder to read than the duplication, keep the duplication.

## 9a — Shared article layout (biggest win: ~250 duplicated lines)

`writing/[slug].astro`, `work/[slug].astro`, `appearances/[slug].astro` are ~95% identical (same getStaticPaths shape, header-image URL builder `.width(550).height(310)`, published/updated badge, ToC wiring, back-link pair, PortableText body). Extract `src/layouts/ArticleLayout.astro` (or a `ContentArticle.astro` component) taking the common data as plain props and **named slots** for the extras:
- `work` extra: projectUrl/GitHub block + the referrer-aware back script (`work/[slug].astro:51-61, 148-150` — the comments there are load-bearing, keep them with the code wherever it lands).
- Each page keeps its own `getStaticPaths` + query — data fetching stays visible in the page file.
- Verify by diffing built HTML for one page of each type before/after (`pnpm build`, diff the three files) — output should be byte-identical or trivially explainable.

## 9b — Collapse H2/H3/H4Block

`src/components/sanity/H2Block.astro`, `H3Block.astro`, `H4Block.astro` are byte-identical except the tag. One `HeadingBlock.astro` with a plain `level: 2 | 3 | 4` prop and a visible tag switch (Astro: `const Tag = \`h${level}\``). Boring on purpose. Update the PortableText component map; delete the three files.

## 9c — Single social-links source of truth

Two divergent sources: `src/lib/social-links.ts` (3 links, text-only; feeds `SocialLinks.astro` + Footer) vs the inline 6-link array in `links/index.astro:44-99` (icons, follower counts, brand backgrounds). Merge into `src/lib/social-links.ts` as a superset: each entry gets optional `icon`, `followerLabel`, `iconBackground`, `iconFill`, and a `showInFooter` (or `footer: boolean`) flag. `SocialLinks.astro` filters; `links/index.astro` consumes all. Keep the data file dumb and literal — a human should edit a follower count without reading any code.

## 9d — Shared `rel` helper

`target="_blank"` → `rel="noopener noreferrer"` logic is copy-pasted in `Link.astro:12-16` (→ `CtaLink` after plan 008), `Item.astro:28`, `ui/Button.astro:61-65`. Extract `src/lib/link-rel.ts` (one small pure function, e.g. `externalRel(target, rel)`), use in all three. Skip if plan 008 hasn't landed yet in only-Link's case — apply wherever the logic lives now.

## 9e — Shared `EmptyState`

"Nothing here yet — check back soon." duplicated at `uses/index.astro:84`, `now/index.astro:81`, variant at `work/index.astro:88-91`. One `EmptyState.astro` with a message slot/prop (default message = the common string). Small; do last.

## Acceptance criteria (each sub-item)

- `astro check` + `pnpm build` clean.
- 9a: built-HTML diff for one writing/work/appearance page each = no unexplained change; referrer back behavior intact.
- Zero remaining imports of deleted files (grep).
- Line count of `src/` meaningfully down; each page file reads top-to-bottom without indirection puzzles.

## Verify

Dev server smoke pass: one writing post, one work post (via company hub for referrer path), one appearance, /uses, /now, /links, Footer links.
