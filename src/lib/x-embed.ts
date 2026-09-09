export function parseXEmbedUrl(
  value?: string,
): { kind: "post" | "broadcast"; id: string; url: string } | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^(?:www\.|mobile\.)/, "");
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !["x.com", "twitter.com"].includes(host) ||
      url.username ||
      url.password ||
      url.port
    )
      return null;

    const broadcast = url.pathname.match(/^\/i\/broadcasts\/([a-z0-9]+)\/?$/i);
    const post = url.pathname.match(
      /^\/(?:[a-z0-9_]+|i\/web)\/status\/(\d+)(?:\/.*)?$/i,
    );
    if (broadcast) {
      return {
        kind: "broadcast",
        id: broadcast[1],
        url: `https://x.com/i/broadcasts/${broadcast[1]}`,
      };
    }
    if (post) {
      return {
        kind: "post",
        id: post[1],
        url: `https://x.com${url.pathname}`,
      };
    }
    return null;
  } catch {
    return null;
  }
}
