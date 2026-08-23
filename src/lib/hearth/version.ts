import { EXTENSION_ID, GITHUB_URL, MARKETPLACE_URL } from "./flavors";

const LATEST_RELEASE_URL = `${GITHUB_URL}/releases/latest`;

const MARKETPLACE_QUERY_API =
  "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery";

export interface HearthVersion {
  version: string;
  href: string;
}

async function fetchLatestReleaseTag(): Promise<string | undefined> {
  // GitHub redirects this stable URL to /releases/tag/<version>. Following the
  // public redirect avoids the unauthenticated API quota shared by hosted
  // builds, while still making the latest published release authoritative.
  const response = await fetch(LATEST_RELEASE_URL);
  if (!response.ok) return undefined;
  const match = new URL(response.url).pathname.match(
    /\/releases\/tag\/v?([^/]+)\/?$/,
  );
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

async function fetchMarketplaceVersion(): Promise<string | undefined> {
  const response = await fetch(MARKETPLACE_QUERY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json;api-version=3.0-preview.1",
    },
    body: JSON.stringify({
      filters: [{ criteria: [{ filterType: 7, value: EXTENSION_ID }] }],
      flags: 1,
    }),
  });
  if (!response.ok) return undefined;
  const result = (await response.json()) as {
    results?: Array<{
      extensions?: Array<{ versions?: Array<{ version?: string }> }>;
    }>;
  };
  return result.results?.[0]?.extensions?.[0]?.versions?.[0]?.version;
}

// Resolved once per static build and memoized so the hero and footer share a
// single lookup. GitHub releases are the primary source; until the first
// release exists (or when the API is rate-limited), the Marketplace listing —
// the build users actually install — stands in. Any failure must hide the
// badge rather than fail the build, and the link follows the source so it
// never 404s.
let pending: Promise<HearthVersion | undefined> | undefined;

export function fetchHearthVersion(): Promise<HearthVersion | undefined> {
  pending ??= resolveHearthVersion();
  return pending;
}

async function resolveHearthVersion(): Promise<HearthVersion | undefined> {
  try {
    const tag = await fetchLatestReleaseTag();
    if (tag) return { version: tag, href: `${GITHUB_URL}/releases/latest` };
    const marketplace = await fetchMarketplaceVersion();
    if (marketplace) return { version: marketplace, href: MARKETPLACE_URL };
    return undefined;
  } catch {
    return undefined;
  }
}
