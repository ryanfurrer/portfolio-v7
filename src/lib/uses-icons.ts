/**
 * Curated icon set for the Uses page — the single source of truth shared by
 * BOTH the frontend (src/pages/uses/index.astro) and the Studio icon picker
 * (src/sanity/components/UsesIconInput.tsx). Add an entry here and it shows up
 * in the Studio picker AND renders on the site — no other file to touch.
 *
 * Each `svg` is the INNER markup of a Lucide icon (lucide-react v0.575),
 * rendered inside a shared <svg stroke="currentColor"> so it inherits the
 * current text color and works in both light and dark mode. Kept as a small,
 * consistent family on purpose (a Uses page reads better with one icon set than
 * a grab-bag of mismatched favicons).
 */
export interface UsesIcon {
  /** Stored value + map key (Lucide icon name). */
  name: string;
  /** Human label shown in the Studio picker tooltip. */
  label: string;
  /** Inner SVG markup (paths only). */
  svg: string;
}

export const USES_ICONS: UsesIcon[] = [
  {
    name: "laptop",
    label: "Laptop / Computer",
    svg: '<path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"/><path d="M20.054 15.987H3.946"/>',
  },
  {
    name: "monitor",
    label: "Monitor / Display",
    svg: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  },
  {
    name: "smartphone",
    label: "Phone",
    svg: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  },
  {
    name: "tablet",
    label: "Tablet",
    svg: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>',
  },
  {
    name: "mouse",
    label: "Mouse",
    svg: '<rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/>',
  },
  {
    name: "keyboard",
    label: "Keyboard",
    svg: '<path d="M10 8h.01"/><path d="M12 12h.01"/><path d="M14 8h.01"/><path d="M16 12h.01"/><path d="M18 8h.01"/><path d="M6 8h.01"/><path d="M7 16h10"/><path d="M8 12h.01"/><rect width="20" height="16" x="2" y="4" rx="2"/>',
  },
  {
    name: "headphones",
    label: "Headphones",
    svg: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  },
  {
    name: "speaker",
    label: "Speaker",
    svg: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 6h.01"/><circle cx="12" cy="14" r="4"/><path d="M12 14h.01"/>',
  },
  {
    name: "webcam",
    label: "Camera / Webcam",
    svg: '<circle cx="12" cy="10" r="8"/><circle cx="12" cy="10" r="3"/><path d="M7 22h10"/><path d="M12 22v-4"/>',
  },
  {
    name: "square-code",
    label: "Editor / IDE",
    svg: '<path d="m10 9-3 3 3 3"/><path d="m14 15 3-3-3-3"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
  },
  {
    name: "terminal",
    label: "Terminal",
    svg: '<path d="M12 19h8"/><path d="m4 17 6-6-6-6"/>',
  },
  {
    name: "pen-tool",
    label: "Design",
    svg: '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  },
  {
    name: "cpu",
    label: "Chip / Hardware",
    svg: '<path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/><path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/><path d="M20 12h2"/><path d="M20 17h2"/><path d="M20 7h2"/><path d="M7 20v2"/><path d="M7 2v2"/><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  },
  {
    name: "hard-drive",
    label: "Storage",
    svg: '<path d="M10 16h.01"/><path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M21.946 12.013H2.054"/><path d="M6 16h.01"/>',
  },
  {
    name: "sparkles",
    label: "AI / Agent",
    svg: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  },
  {
    name: "globe",
    label: "Browser / Web",
    svg: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  },
  {
    name: "square-kanban",
    label: "Project / Tasks",
    svg: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 7v7"/><path d="M12 7v4"/><path d="M16 7v9"/>',
  },
  {
    name: "command",
    label: "Launcher / Command",
    svg: '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>',
  },
  {
    name: "file-text",
    label: "Documents / Notes",
    svg: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  },
  {
    name: "calendar",
    label: "Calendar",
    svg: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  },
  {
    name: "music",
    label: "Music",
    svg: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  },
  {
    name: "audio-waveform",
    label: "Audio / Focus",
    svg: '<path d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"/>',
  },
  {
    name: "crop",
    label: "Screenshot / Capture",
    svg: '<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>',
  },
  {
    name: "key-round",
    label: "Password / Security",
    svg: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  },
  {
    name: "package",
    label: "Other",
    svg: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  },
];

/** Fast lookup: icon name → inner SVG markup. */
const USES_ICON_SVG: Record<string, string> = Object.fromEntries(
  USES_ICONS.map((icon) => [icon.name, icon.svg]),
);

/**
 * Fallback map: role label (the item `description`, e.g. "Computer" / "IDE") →
 * icon name. Used only when an item has no explicit `icon` picked in Studio, so
 * existing entries still get a sensible glyph. Keyed on the lowercased role.
 */
const ROLE_TO_ICON: Record<string, string> = {
  computer: "laptop",
  laptop: "laptop",
  monitor: "monitor",
  display: "monitor",
  phone: "smartphone",
  tablet: "tablet",
  mouse: "mouse",
  keyboard: "keyboard",
  headphones: "headphones",
  speaker: "speaker",
  camera: "webcam",
  webcam: "webcam",
  ide: "square-code",
  editor: "square-code",
  code: "square-code",
  terminal: "terminal",
  design: "pen-tool",
  chip: "cpu",
  storage: "hard-drive",
  earphones: "headphones",
  "coding agent": "sparkles",
  ai: "sparkles",
  browser: "globe",
  web: "globe",
  documents: "file-text",
  notes: "file-text",
  calendar: "calendar",
  music: "music",
  "password manager": "key-round",
  security: "key-round",
};

/**
 * Resolve the inner SVG for an item: an explicitly picked `icon` wins, else the
 * role label is mapped, else the `package` fallback. Always returns valid SVG.
 */
export function resolveUsesIcon(
  icon?: string | null,
  role?: string | null,
): string {
  if (icon && USES_ICON_SVG[icon]) return USES_ICON_SVG[icon];
  const fromRole = ROLE_TO_ICON[(role ?? "").trim().toLowerCase()];
  return USES_ICON_SVG[fromRole ?? "package"] ?? USES_ICON_SVG.package;
}
