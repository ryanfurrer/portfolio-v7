// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "./src/sanity/lib/config";

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  integrations: [
    react(),
    sitemap(),
    sanity({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      studioBasePath,
    }),
  ],
  site: "https://ryanfurrer.com/",
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
    // @ts-expect-error - Vite version mismatch between Astro (v6) and @tailwindcss/vite (v7)
    // The plugin works at runtime despite the type incompatibility
    plugins: [tailwindcss()],
  },
});
