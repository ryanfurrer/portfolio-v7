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
/**
 * @param {string} path
 * @returns {Record<string, string>}
 */
function readEnvFile(path) {
  try {
    /** @type {Record<string, string>} */
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

/** @type {Record<string, string | undefined>} */
const env = { ...readEnvFile(".env"), ...process.env };

// Draft preview: point the site's Sanity client at the `drafts` perspective
// with a read token so unpublished/edited entries render with the real styling.
// `pnpm dev` turns this on; production builds never do (they stay published).
// A missing token degrades gracefully to published rather than breaking dev.
const wantsDrafts = env.SANITY_PREVIEW_DRAFTS === "true";
const readToken = env.SANITY_API_READ_TOKEN;
const previewDrafts = wantsDrafts && Boolean(readToken);
if (wantsDrafts && !readToken) {
  console.warn(
    "[sanity] Draft preview is on but SANITY_API_READ_TOKEN is missing — " +
      "showing published content. Add a Viewer token to .env (see .env.example).",
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
    // Pre-bundle the embedded Studio's heavy dependency set at dev-server start.
    // Vite only discovers these when /admin is first visited, and that late
    // re-optimize rewrites the dep cache and 404s chunks the content routes
    // already loaded (the recurring "/admin failed to fetch dynamically imported
    // module"). Pinning them keeps a single stable optimized set across routes.
    optimizeDeps: {
      include: [
        "sanity",
        "sanity/structure",
        "@sanity/vision",
        "@sanity/icons",
        "@sanity/code-input",
      ],
    },
    // @ts-expect-error - Vite version mismatch between Astro (v6) and @tailwindcss/vite (v7)
    // The plugin works at runtime despite the type incompatibility
    plugins: [tailwindcss()],
  },
});
