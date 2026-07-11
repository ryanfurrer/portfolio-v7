export function formatFollowerCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Harden a new-tab link: default `rel` to `noopener noreferrer` when a link
// opens in a new tab, unless the caller set one. Returns undefined for
// same-tab links so the attribute is omitted.
export function externalRel(
  target: string | null | undefined,
  rel?: string | null,
): string | undefined {
  if (rel) return rel;
  return target === "_blank" ? "noopener noreferrer" : undefined;
}
