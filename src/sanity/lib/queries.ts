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
  `*[_type == "project" && defined(slug.current)]|order(publishedAt desc){_id, title, slug, publishedAt, "company": company->{name, "slug": slug.current}}`,
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

// --- Links page (single latest of each) ---

export const LINKS_LATEST_QUERY = defineQuery(`{
  "post": *[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0]{_id, title, slug},
  "project": *[_type == "project" && defined(slug.current)]|order(publishedAt desc)[0]{_id, title, slug},
  "appearance": *[_type == "appearance" && defined(slug.current)]|order(publishedAt desc)[0]{_id, title, slug}
}`);

// --- Detail pages (full document by slug) ---

export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]`,
);

export const PROJECT_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{
    ...,
    "company": company->{name, "slug": slug.current}
  }`,
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

// --- OG card data (slug + title + description per entry, for the build-time
//     Open Graph image generator at /og/<section>/[slug].png) ---

export const POST_OG_CARDS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current, title, description}`,
);

export const PROJECT_OG_CARDS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)]{"slug": slug.current, title, description}`,
);

export const APPEARANCE_OG_CARDS_QUERY = defineQuery(
  `*[_type == "appearance" && defined(slug.current)]{"slug": slug.current, title, description}`,
);

// --- About (singleton) ---

export const ABOUT_QUERY = defineQuery(
  `*[_type == "about"][0]{title, description, body}`,
);

// --- Uses (singleton — gear/software, grouped by category) ---

export const USES_QUERY = defineQuery(
  `*[_type == "uses"][0]{title, description, categories[]{title, items[]{name, description, url, icon}}}`,
);

// --- Now (newest = "Now" card, rest = "Previously") ---

export const NOW_QUERY = defineQuery(
  `*[_type == "now"]|order(publishedAt desc){_id, publishedAt, body, media}`,
);

// --- Work tag hubs (one per company + a derived "personal" bucket) ---

export const WORK_HUBS_QUERY = defineQuery(`{
  "companies": *[_type == "company" && defined(slug.current)]|order(name asc){
    name,
    "slug": slug.current,
    url,
    logo,
    description,
    "projects": *[_type == "project" && references(^._id) && defined(slug.current)]|order(publishedAt desc){_id, title, slug, publishedAt}
  },
  "personal": *[_type == "project" && !defined(company) && defined(slug.current)]|order(publishedAt desc){_id, title, slug, publishedAt}
}`);
