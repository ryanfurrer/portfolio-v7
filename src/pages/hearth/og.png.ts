import type { APIRoute } from "astro";
import { renderHearthOgCard } from "@/lib/og/hearth-card";

export const GET: APIRoute = async () => {
  const png = await renderHearthOgCard();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
