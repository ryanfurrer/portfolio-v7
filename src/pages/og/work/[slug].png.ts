import { createOgRoute } from "@/lib/og/endpoint";
import { PROJECT_OG_CARDS_QUERY } from "@/sanity/lib/queries";

const route = createOgRoute(PROJECT_OG_CARDS_QUERY, "work");
export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
