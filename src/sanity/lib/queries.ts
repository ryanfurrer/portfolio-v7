import {defineQuery} from "groq";

/**
 * All GROQ queries live here, wrapped in `defineQuery` so Sanity
 * TypeGen can generate a typed result for each (see `sanity.types.ts`,
 * `npm run typegen`). Keeping them in one `.ts` module (rather than
 * inline in `.astro` frontmatter) is also what lets TypeGen discover
 * them — its parser scans `.ts`/`.tsx`, not Astro components.
 */

// --- Index / listing pages (all share the same row shape) ---

export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]|order(publishedAt desc){_id, title, slug, publishedAt}`,
);

export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)]|order(publishedAt desc){_id, title, slug, publishedAt}`,
);

export const APPEARANCES_QUERY = defineQuery(
  `*[_type == "appearance" && defined(slug.current)]|order(publishedAt desc){_id, title, slug, publishedAt}`,
);

// --- Home page (latest three of each) ---

export const LATEST_POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt}`,
);

export const LATEST_PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt}`,
);

export const LATEST_APPEARANCES_QUERY = defineQuery(
  `*[_type == "appearance" && defined(slug.current)]|order(publishedAt desc)[0...3]{_id, title, slug, publishedAt}`,
);

// --- Links page (single latest of each, with OG image) ---

export const LINKS_LATEST_QUERY = defineQuery(`{
  "post": *[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0]{_id, title, slug, ogImage},
  "project": *[_type == "project" && defined(slug.current)]|order(publishedAt desc)[0]{_id, title, slug, ogImage},
  "appearance": *[_type == "appearance" && defined(slug.current)]|order(publishedAt desc)[0]{_id, title, slug, ogImage}
}`);

// --- Detail pages (full document by slug) ---

export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]`,
);

export const PROJECT_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]`,
);

export const APPEARANCE_QUERY = defineQuery(
  `*[_type == "appearance" && slug.current == $slug][0]`,
);

// --- Static path generation ---

export const POST_SLUGS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"params": {"slug": slug.current}}`,
);

export const PROJECT_SLUGS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)]{"params": {"slug": slug.current}}`,
);

export const APPEARANCE_SLUGS_QUERY = defineQuery(
  `*[_type == "appearance" && defined(slug.current)]{"params": {"slug": slug.current}}`,
);
