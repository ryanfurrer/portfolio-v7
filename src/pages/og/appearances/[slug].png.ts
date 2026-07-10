import { createOgRoute } from "@/lib/og/endpoint";
import { APPEARANCE_OG_CARDS_QUERY } from "@/sanity/lib/queries";

const route = createOgRoute(APPEARANCE_OG_CARDS_QUERY, "appearances");
export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
