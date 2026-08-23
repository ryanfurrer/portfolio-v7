// The Hearth landing is served from two hosts: this subdomain (via the routing
// middleware in middleware.ts) and www.ryanfurrer.com/hearth (the real Astro
// route). The subdomain is the promoted address — it's what the Marketplace
// listing and the README link to — so it's the canonical one, and the page and
// the sitemap both have to say so.
//
// Kept apart from flavors.ts because astro.config.mjs imports this to rewrite
// the sitemap entry, and it can't resolve the `@/` aliases that file uses.
export const HEARTH_ORIGIN = "https://hearth.ryanfurrer.com";

export const HEARTH_CANONICAL = `${HEARTH_ORIGIN}/`;

/** The www path the subdomain root rewrites to, as it appears in the sitemap. */
export const HEARTH_ROUTE = "/hearth/";
