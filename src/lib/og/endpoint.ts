import type { APIRoute } from "astro";
import { sanityClient } from "sanity:client";
import { renderOgCard } from "./render-card";

/**
 * Factory for a per-content OG image route. Each content type points a
 * `src/pages/og/<section>/[slug].png.ts` endpoint at this with its "cards"
 * query; the endpoint prerenders one PNG per entry into dist at build time.
 */

interface OgCardItem {
  slug: string;
  title: string;
  description?: string;
}

export function createOgRoute(query: string, section: string) {
  async function getStaticPaths() {
    const items = await sanityClient.fetch<OgCardItem[]>(query);
    return items
      .filter((item) => item.slug && item.title)
      .map((item) => ({
        params: { slug: item.slug },
        props: {
          title: item.title,
          description: item.description,
          // Show only the section (ryanfurrer.com/writing), not the full slug —
          // keeps the URL to one line and matches the section cards.
          path: section,
        },
      }));
  }

  const GET: APIRoute = async ({ props }) => {
    const png = await renderOgCard(
      props as { title: string; description?: string; path: string },
    );
    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  };

  return { getStaticPaths, GET };
}
