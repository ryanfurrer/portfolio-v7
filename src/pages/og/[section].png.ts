import type { APIRoute } from "astro";
import { sanityClient } from "sanity:client";
import { renderOgCard } from "@/lib/og/render-card";
import { SECTION_META } from "@/lib/og/sections";
import { ABOUT_QUERY, USES_QUERY } from "@/sanity/lib/queries";
import type {
  ABOUT_QUERY_RESULT,
  USES_QUERY_RESULT,
} from "@/sanity/sanity.types";

export async function getStaticPaths() {
  // About and Uses ledes live in Sanity — prefer those so the card matches the
  // page; the rest are static in SECTION_META.
  const [about, uses] = await Promise.all([
    sanityClient.fetch<ABOUT_QUERY_RESULT>(ABOUT_QUERY),
    sanityClient.fetch<USES_QUERY_RESULT>(USES_QUERY),
  ]);
  const sanityLede: Partial<Record<string, string | undefined>> = {
    about: about?.description ?? undefined,
    uses: uses?.description ?? undefined,
  };

  return Object.entries(SECTION_META).map(([slug, meta]) => ({
    params: { section: slug },
    props: {
      title: meta.title,
      description: sanityLede[slug] ?? meta.description,
      path: slug,
    },
  }));
}

export const GET: APIRoute = async ({ props }) => {
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
