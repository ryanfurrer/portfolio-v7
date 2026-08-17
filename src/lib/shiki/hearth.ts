// Hearth editor theme, vendored for Shiki-highlighted code blocks. VS Code themes
// are valid Shiki themes, so these are the same JSON files published at
// github.com/ryanfurrer/hearth-theme — re-copy from there if the theme changes.
//
// To switch the on-page flavor, change HEARTH_FLAVOR below. Each flavor is a
// light/dark pair: light ships inline, dark rides the parallel --shiki-dark vars
// and swaps in under .dark (see prose.css). Only the callables differ — Teal and
// Azure tint functions/types, Duotone leaves them neutral.
import darkDuotone from "./hearth-dark.json";
import lightDuotone from "./hearth-light.json";
import darkTeal from "./hearth-dark-teal.json";
import lightTeal from "./hearth-light-teal.json";
import darkAzure from "./hearth-dark-azure.json";
import lightAzure from "./hearth-light-azure.json";

const FLAVORS = {
  duotone: { light: lightDuotone, dark: darkDuotone },
  teal: { light: lightTeal, dark: darkTeal },
  azure: { light: lightAzure, dark: darkAzure },
} as const;

export type HearthFlavor = keyof typeof FLAVORS;

export const HEARTH_FLAVOR: HearthFlavor = "azure";

export const hearthThemes = FLAVORS[HEARTH_FLAVOR];
