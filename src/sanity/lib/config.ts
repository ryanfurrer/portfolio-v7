/**
 * Single source of truth for the Sanity project connection.
 *
 * Imported by astro.config.mjs (which wires the `sanity:client`
 * integration), sanity.config.ts (Studio) and sanity.cli.ts, so these
 * values live in one place instead of being duplicated across all three.
 *
 * projectId/dataset are not secrets (they ship to the browser), so they
 * are committed here. To make them environment-overridable later, read
 * them from env in each consumer and fall back to these constants.
 */
export const projectId = "z2j0j9ei";
export const dataset = "production";
export const apiVersion = "2024-12-01";
export const studioBasePath = "/admin";
