/**
 * The Hearth orb — the extension's icon rebuilt as a transparent radial
 * gradient, so a baked-in background never fights the surface it sits on.
 *
 * Shared as a markup string because two very different renderers need the same
 * mark: the inline `<HearthMark>` component and the build-time OG card, which
 * runs through Satori and can only take an SVG data URI.
 */
const STOPS = [
  { offset: "0%", color: "#ff9a63" },
  { offset: "46%", color: "#f05a29" },
  { offset: "100%", color: "#bf3f18" },
];

interface OrbOptions {
  /** Gradient id — must be unique per document; duplicates collapse onto the first. */
  id: string;
  class?: string;
  /** Omit for a fluid mark sized by CSS; set it for standalone/data-URI use. */
  size?: number;
}

export function hearthOrbSvg({ id, class: className, size }: OrbOptions) {
  const attrs = [
    'xmlns="http://www.w3.org/2000/svg"',
    'viewBox="0 0 24 24"',
    'role="img"',
    'aria-label="Hearth"',
    className && `class="${className}"`,
    size && `width="${size}" height="${size}"`,
  ]
    .filter(Boolean)
    .join(" ");

  const stops = STOPS.map(
    ({ offset, color }) => `<stop offset="${offset}" stop-color="${color}"/>`,
  ).join("");

  return `<svg ${attrs}><defs><radialGradient id="${id}" cx="42%" cy="36%" r="66%">${stops}</radialGradient></defs><circle cx="12" cy="12" r="10" fill="url(#${id})"/></svg>`;
}
