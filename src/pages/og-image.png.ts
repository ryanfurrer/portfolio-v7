import type { APIRoute } from "astro";
import { SITE_DESCRIPTION } from "@/consts";
import { renderOgCard } from "@/lib/og/render-card";

export const GET: APIRoute = async () => {
  const png = await renderOgCard({
    title: "Ryan Furrer",
    description: SITE_DESCRIPTION,
    path: "",
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
