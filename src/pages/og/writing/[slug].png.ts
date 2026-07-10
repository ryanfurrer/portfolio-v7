import { createOgRoute } from "@/lib/og/endpoint";
import { POST_OG_CARDS_QUERY } from "@/sanity/lib/queries";

const route = createOgRoute(POST_OG_CARDS_QUERY, "writing");
export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
