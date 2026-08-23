import darkAzure from "@/lib/shiki/hearth-dark-azure.json";
import darkDuotone from "@/lib/shiki/hearth-dark.json";
import darkTeal from "@/lib/shiki/hearth-dark-teal.json";
import lightAzure from "@/lib/shiki/hearth-light-azure.json";
import lightDuotone from "@/lib/shiki/hearth-light.json";
import lightTeal from "@/lib/shiki/hearth-light-teal.json";

// The hero's own words, shared with the OG card so the share image can never
// drift from the page it links to.
export const HEARTH_KICKER = "Theme for VS Code, Cursor, and more";
export const HEARTH_TAGLINE =
  "A warm color theme that keeps the interface calm and lets a single accent pick out the code worth scanning.";

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
// Cursor has no Open VSX listing to install from yet, and the Marketplace site
// offers no download control, so the release asset is the only public source for
// the file. The asset ships unversioned, so this URL never needs bumping.
export const VSIX_URL = `${GITHUB_URL}/releases/latest/download/hearth-latest.vsix`;
export const CLI_INSTALL = `code --install-extension ${EXTENSION_ID}`;

// Keep each sample focused enough that visitors can compare the syntax roles at
// a glance instead of reading an entire program.
export const EDITOR_SAMPLES = [
  {
    id: "typescript",
    file: "hearth.ts",
    label: "TypeScript",
    lang: "ts",
    code: `import type { Ember } from "./hearth";

// Warm syntax: orange plus one accent.
export function kindle(
  embers: Ember[],
  intensity = 1.5,
): Ember[] {
  return embers.filter((ember) => {
    const heat =
      ember.temperature * intensity;
    return heat > 400;
  });
}

const lit = kindle(hearth.embers);
console.log(\`\${lit.length} glowing\`);`,
  },
  {
    id: "python",
    file: "hearth.py",
    label: "Python",
    lang: "python",
    code: `from dataclasses import dataclass

@dataclass
class Ember:
    temperature: float
    glowing: bool = False

def kindle(
    embers: list[Ember],
    intensity: float = 1.5,
) -> list[Ember]:
    for ember in embers:
        heat = (
            ember.temperature
            * intensity
        )
        ember.glowing = heat > 400
    return embers`,
  },
  {
    id: "rust",
    file: "hearth.rs",
    label: "Rust",
    lang: "rust",
    code: `#[derive(Debug)]
struct Ember {
    temperature: f32,
    glowing: bool,
}

fn kindle(
    embers: &mut [Ember],
    intensity: f32,
) {
    for ember in embers {
        let heat = ember.temperature
            * intensity;
        ember.glowing = heat > 400.0;
    }
}`,
  },
  {
    id: "go",
    file: "hearth.go",
    label: "Go",
    lang: "go",
    code: `package hearth

type Ember struct {
	Temperature float64
	Glowing     bool
}

func Kindle(
	embers []Ember,
	intensity float64,
) []Ember {
	for i := range embers {
		temp := embers[i].Temperature
		heat := temp * intensity
		embers[i].Glowing = heat > 400
	}
	return embers
}`,
  },
  {
    id: "css",
    file: "hearth.css",
    label: "CSS",
    lang: "css",
    code: `:root {
  --ember: oklch(0.659 0.194 37.5);
  --hearth: oklch(0.2 0.01 60);
}

.hearth {
  color: var(--ember);
  background: var(--hearth);
  border-radius: 0.75rem;
}

@media (hover: hover) {
  .ember {
    opacity: 0.9;
  }
}`,
  },
] as const;

export const DEFAULT_EDITOR_LANGUAGE = EDITOR_SAMPLES[0].id;

// A tighter snippet for the six gallery cards, where vertical space is scarce.
export const GALLERY_FILE = "warmth.ts";
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
  {
    label: "Background",
    note: "editor surface",
    light: "#ffffff",
    dark: "#0a0a0b",
  },
  {
    label: "Foreground",
    note: "plain text",
    light: "#2d2d33",
    dark: "#d7d7db",
  },
  {
    label: "Comment",
    note: "muted, low-contrast",
    light: "#717178",
    dark: "#626269",
  },
  {
    label: "Keyword",
    note: "the orange ember",
    light: "#b23c00",
    dark: "#f87c49",
  },
  { label: "String", note: "warm brown", light: "#89552a", dark: "#dfbda0" },
  {
    label: "Constant",
    note: "numbers & literals",
    light: "#9f2e00",
    dark: "#f66335",
  },
];
