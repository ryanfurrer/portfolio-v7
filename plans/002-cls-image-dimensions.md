# 002 — Eliminate image-driven CLS (article header + Portable Text images)

**Batch:** 1 (mechanical) · **Effort:** ~30 min · **User input:** none

> Line refs are from `main` @ `e647f5e` (2026-07-11). Re-grep before editing.

## Diagnosis

No `astro:assets`/`<Image>` usage anywhere — all images are raw `<img>`. Two classes of CLS bug:

1. **Article header images** — `writing/[slug].astro:63`, `work/[slug].astro:82`, `appearances/[slug].astro:70`. The Sanity URL is built with `.width(550).height(310)` (each `[slug].astro:31-35`) but the `<img>` has **no `width`/`height` attributes**, and `.prose img { display:block; width:100% }` (`global.css:706-708`) provides no aspect-ratio. The page shifts when each header image decodes — top-of-article, so high CLS impact.
2. **Portable Text body images** — `src/components/sanity/PortableTextImage.astro:17` renders `<img class="responsive__img">` with no dimensions. Same shift per inline image. `responsive__img` is a **dead class** (zero CSS rules define it anywhere — grep-verified).

Good reference pattern already in the codebase: `links/index.astro:184-189` reserves space with `aspect-1200/630` + `loading="lazy"`. Also `CompanyHeader.astro:25-32` correctly sets `width="40" height="40"`.

## Changes

1. **Header images (3 slug pages):** add `width="550" height="310"` attributes to the `<img>` (matching the URL builder params). Since `.prose img` forces `width:100%`, the attributes still fix the aspect ratio for layout reservation. Alternatively add `class="aspect-[550/310]"` — prefer the plain HTML attributes (simplest, matches CompanyHeader precedent).
2. **PortableTextImage.astro:**
   - Extend the image data to include intrinsic dimensions. Sanity assets expose `asset->metadata.dimensions{width,height,aspectRatio}` — check the GROQ projection in `src/sanity/lib/queries.ts` and add it to the Portable Text image projection if absent. Run `pnpm typegen` after any query/schema change (house rule).
   - Render `width`/`height` attributes from metadata (fall back gracefully if absent — guard like the other PT renderers do for incomplete drafts).
   - Remove the dead `responsive__img` class while there.
3. Confirm `loading="lazy"` on below-the-fold images (PT body images: yes; header images are above-fold — leave eager, consider `fetchpriority="high"` on the header image).

## Acceptance criteria

- Loading any article with a header image on a throttled connection produces no visible layout jump when the image arrives.
- `astro check` clean; `pnpm typegen` run if queries changed.
- No `responsive__img` remains in the codebase.

## Verify

Dev server → open a writing post and a work post with header images; DevTools → Performance insights / Layout Shifts (or Network throttle + reload) to confirm no shift region over the article. Check a post containing body images too.
