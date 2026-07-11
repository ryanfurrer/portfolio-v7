import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";

/**
 * Build-time Open Graph card renderer (Satori → SVG → resvg → PNG).
 *
 * The layout deliberately mirrors the hand-made section cards in
 * `public/og/*.png`: a fixed near-black canvas, a mono eyebrow + URL across
 * the top, then a big Geist-Bold title over a muted Geist description. Content
 * pages feed their own title/description here so every share card is on-brand
 * and generated — no per-entry image to hand-author. See [og-generator memory].
 *
 * Satori only accepts static ttf/otf/woff fonts (NOT woff2 or variable fonts),
 * so we ship single-weight Geist woffs under src/assets/og/fonts (see that dir).
 */

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Tokens copied from the dark theme in global.css so the card matches the site
// exactly: bg oklch(0.165 0 0), and the near-white / muted / subtle ink ramp.
const COLORS = {
  background: "#1a1a1a",
  title: "#f5f5f7",
  description: "#a1a1a6",
  meta: "#86868b",
  // The mono URL is thinner than the bold eyebrow, so at the eyebrow's own hex
  // it reads dimmer — one step brighter makes the two visually match.
  metaBright: "#94949a",
} as const;

// These routes are prerendered during `astro build`, whose cwd is the project
// root — resolve the committed font files from there. (import.meta.url can't be
// used: the endpoint is bundled into dist/chunks, so relative paths shift.)
const fontPath = (file: string) =>
  join(process.cwd(), "src/assets/og/fonts", file);

// Read once at module load — endpoints render many cards per build.
const fonts = [
  { name: "Geist", data: readFileSync(fontPath("Geist-Regular.woff")), weight: 400 as const, style: "normal" as const },
  { name: "Geist", data: readFileSync(fontPath("Geist-Bold.woff")), weight: 700 as const, style: "normal" as const },
  { name: "Berkeley Mono", data: readFileSync(fontPath("BerkeleyMono-Regular.otf")), weight: 400 as const, style: "normal" as const },
];

/** Minimal hyperscript so we can build Satori's VDOM without JSX in a .ts file. */
type Node = { type: string; props: Record<string, unknown> };
const h = (
  type: string,
  props: Record<string, unknown> = {},
  ...children: Array<Node | string>
): Node => ({
  type,
  props: { ...props, children: children.length === 1 ? children[0] : children },
});

/**
 * Scale the title to fill the card without overflowing. Short section names
 * ("Work") read huge; long post titles step down and wrap to a few lines.
 */
const titleFontSize = (title: string) => {
  const len = title.length;
  if (len <= 12) return 128;
  if (len <= 20) return 104;
  if (len <= 32) return 82;
  if (len <= 48) return 64;
  return 52;
};

export interface OgCard {
  /** Big headline — the entry (or section) title. */
  title: string;
  /** Muted standfirst under the title (usually the entry description). */
  description?: string;
  /** Path shown top-right, e.g. "writing/my-post" → "ryanfurrer.com/writing/my-post". */
  path: string;
  /** Constant brand label top-left. */
  eyebrow?: string;
}

export async function renderOgCard({
  title,
  description,
  path,
  eyebrow = "DESIGN ENGINEER",
}: OgCard): Promise<Buffer> {
  // Just the section path (e.g. "/writing") — the domain is implied, and this
  // stays short whether it's a section card or a post within that section.
  const url = `/${path}`.replace(/\/$/, "") || "/";

  const tree = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: COLORS.background,
        padding: "72px 80px",
        fontFamily: "Geist",
      },
    },
    // Top row: brand eyebrow (left) + URL (right)
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Berkeley Mono",
          fontSize: 25,
          color: COLORS.meta,
        },
      },
      h(
        "div",
        {
          style: {
            letterSpacing: "0.08em",
            fontWeight: 700,
            fontFamily: "Geist",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginRight: "48px",
          },
        },
        eyebrow,
      ),
      h("div", { style: { textAlign: "right", color: COLORS.metaBright } }, url),
    ),
    // Bottom block: title + description, anchored to the lower-left
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: titleFontSize(title),
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: COLORS.title,
            maxWidth: "1000px",
          },
        },
        title,
      ),
      description
        ? h(
            "div",
            {
              style: {
                display: "flex",
                marginTop: "28px",
                fontSize: 34,
                lineHeight: 1.35,
                color: COLORS.description,
                maxWidth: "860px",
              },
            },
            description,
          )
        : "",
    ),
  );

  const svg = await satori(tree as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: OG_WIDTH },
  })
    .render()
    .asPng();

  return png;
}
