// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import sanity from "@sanity/astro";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "./src/sanity/lib/config";

// astro.config runs before Astro injects .env, so parse the file ourselves.
// Inline vars (e.g. `SANITY_PREVIEW_DRAFTS=true pnpm dev`) win over the file.
function readEnvFile(path) {
  try {
    const out = {};
    for (const line of readFileSync(path, "utf8").split("\n")) {
      if (/^\s*#/.test(line)) continue;
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) out[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

const env = { ...readEnvFile(".env"), ...process.env };

// Draft preview (see `pnpm preview:drafts`): point the site's Sanity client
// at the `drafts` perspective with a read token so unpublished/edited entries
// render with the real styling. OFF for normal dev and all production builds,
// which stay on published content only.
const previewDrafts = env.SANITY_PREVIEW_DRAFTS === "true";
const readToken = env.SANITY_API_READ_TOKEN;
if (previewDrafts && !readToken) {
  throw new Error(
    "Draft preview is on but SANITY_API_READ_TOKEN is missing. Add a Viewer " +
      "token to .env (see .env.example), then rerun `pnpm preview:drafts`.",
  );
}

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
      perspective: previewDrafts ? "drafts" : "published",
      token: previewDrafts ? readToken : undefined,
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
