import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Font faces registered with Satori for every OG card.
 *
 * Satori only accepts static ttf/otf (NOT woff2 or variable fonts), so we ship
 * single-weight Google Sans ttfs (400 + the site's 600 heading weight) and the
 * four Berkeley Mono otfs under src/assets/og/fonts. All four mono faces are
 * needed: the Hearth card highlights real code, and the theme styles tokens
 * bold and italic.
 *
 * These routes are prerendered during `astro build`, whose cwd is the project
 * root — resolve from there. (import.meta.url can't be used: the endpoints are
 * bundled into dist/chunks, so relative paths shift.)
 */
const read = (file: string) =>
  readFileSync(join(process.cwd(), "src/assets/og/fonts", file));

const face = (
  name: string,
  file: string,
  weight: 400 | 600 | 700,
  style: "normal" | "italic" = "normal",
) => ({ name, data: read(file), weight, style }) as const;

// Read once at module load — endpoints render many cards per build.
export const ogFonts = [
  face("Google Sans", "GoogleSans-Regular.ttf", 400),
  face("Google Sans", "GoogleSans-SemiBold.ttf", 600),
  face("Berkeley Mono", "BerkeleyMono-Regular.otf", 400),
  face("Berkeley Mono", "BerkeleyMono-Bold.otf", 700),
  face("Berkeley Mono", "BerkeleyMono-Oblique.otf", 400, "italic"),
  face("Berkeley Mono", "BerkeleyMono-Bold-Oblique.otf", 700, "italic"),
];
