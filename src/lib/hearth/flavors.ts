import darkAzure from "@/lib/shiki/hearth-dark-azure.json";
import darkDuotone from "@/lib/shiki/hearth-dark.json";
import darkTeal from "@/lib/shiki/hearth-dark-teal.json";
import lightAzure from "@/lib/shiki/hearth-light-azure.json";
import lightDuotone from "@/lib/shiki/hearth-light.json";
import lightTeal from "@/lib/shiki/hearth-light-teal.json";

export type FlavorId = "duotone" | "teal" | "azure";

export interface Flavor {
  id: FlavorId;
  /** Short switcher label. */
  name: string;
  /** Full theme family name as it appears in VS Code. */
  fullName: string;
  /** What its accent hue does, in one line. */
  tagline: string;
  /** The signature accent — functions and types are the only roles flavors recolor. */
  accent: { light: string; dark: string };
  /** Shiki dual-theme pair; light ships inline, dark rides the --shiki-dark vars. */
  themes: { light: unknown; dark: unknown };
}

// Hearth first — the namesake, where every accent is the orange ember and
// functions/types stay neutral. Teal and Azure add one cool hue on top of that
// same warm base, so switching between them reads as a single dial turning.
export const FLAVORS: Flavor[] = [
  {
    id: "duotone",
    name: "Hearth",
    fullName: "Hearth",
    tagline: "Duotone. One orange ember, functions and types left neutral.",
    accent: { light: "#b23c00", dark: "#f87c49" },
    themes: { light: lightDuotone, dark: darkDuotone },
  },
  {
    id: "azure",
    name: "Azure",
    fullName: "Hearth Azure",
    tagline: "Warm base, a brighter blue on functions and types.",
    accent: { light: "#007da3", dark: "#2eb3e5" },
    themes: { light: lightAzure, dark: darkAzure },
  },
  {
    id: "teal",
    name: "Teal",
    fullName: "Hearth Teal",
    tagline: "Warm base, teal functions and types for a second axis to scan.",
    accent: { light: "#008472", dark: "#4cd0b8" },
    themes: { light: lightTeal, dark: darkTeal },
  },
];

export const DEFAULT_FLAVOR: FlavorId = "duotone";

// Distribution — README and marketplace listing are the source of truth.
export const EXTENSION_ID = "RyanFurrer.hearth";
export const MARKETPLACE_URL = `https://marketplace.visualstudio.com/items?itemName=${EXTENSION_ID}`;
export const GITHUB_URL = "https://github.com/ryanfurrer/hearth-theme";
export const CLI_INSTALL = `code --install-extension ${EXTENSION_ID}`;

// The centerpiece sample leans on every role the palette tints: keywords and
// control flow (orange), strings and templates, a comment, numbers, and the
// function/type names that carry each flavor's accent.
export const EDITOR_SAMPLE = `import type { Ember } from "./hearth";

// Warm syntax: orange for keywords, one accent hue for functions & types.
export function kindle(embers: Ember[], intensity = 1.5): Ember[] {
  return embers.map((ember) => {
    const heat = ember.temperature * intensity;
    return { ...ember, heat, glowing: heat > 400 };
  });
}

const lit = kindle(hearth.embers).filter((e) => e.glowing);
console.log(\`\${lit.length} embers still glowing\`);
`;

// A tighter snippet for the six gallery cards, where vertical space is scarce.
export const GALLERY_SAMPLE = `type Theme = "light" | "dark";

export function warmth(theme: Theme): number {
  const base = theme === "dark" ? 0.1 : 0.98;
  return Math.round(base * 100);
}
`;

export interface PaletteRow {
  label: string;
  note: string;
  light: string;
  dark: string;
}

// Values read straight from the vendored theme JSON — the shared base is
// identical across all three flavors; only functions & types change.
export const BASE_PALETTE: PaletteRow[] = [
  { label: "Background", note: "editor surface", light: "#ffffff", dark: "#0a0a0b" },
  { label: "Foreground", note: "plain text", light: "#2d2d33", dark: "#d7d7db" },
  { label: "Comment", note: "muted, low-contrast", light: "#717178", dark: "#626269" },
  { label: "Keyword", note: "the orange ember", light: "#b23c00", dark: "#f87c49" },
  { label: "String", note: "warm brown", light: "#89552a", dark: "#dfbda0" },
  { label: "Constant", note: "numbers & literals", light: "#9f2e00", dark: "#f66335" },
];
