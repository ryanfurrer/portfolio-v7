import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";

/**
 * Build-time Open Graph card renderer (Satori → SVG → resvg → PNG).
 *
 * A fixed near-black canvas: the ryanfurrer wordmark + URL across the top, then
 * a big Google Sans title over a muted description. Content pages feed their own
 * title/description here so every share card is on-brand and generated — no
 * per-entry image to hand-author. See [og-generator memory].
 *
 * Satori only accepts static ttf/otf fonts (NOT woff2 or variable fonts), so we
 * ship single-weight Google Sans ttfs (400 + the site's 600 heading weight) +
 * Berkeley Mono otfs under src/assets/og/fonts (see that dir).
 */

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Derived from the site's dark theme tokens (Satori can't read CSS vars/OKLCH,
// so these are the resolved sRGB values): --background, --foreground, and
// --muted-foreground, plus the orange --brand for the wordmark's dot.
const COLORS = {
  background: "#0a0a0b", // --background
  title: "#fafafb", // --foreground
  muted: "#a4a4a9", // --muted-foreground
  brand: "#f05a29", // --brand
} as const;

// The wordmark, inlined so its fills can be pinned to the card's palette (the
// component version uses currentColor + a .fill-brand class). Kept in sync with
// src/components/Wordmark.astro: the first path is the brand dot, the rest are
// the "ryanfurrer" letters.
const WORDMARK_DOT =
  "M96.78 12.15C96.78 14.083 95.213 15.65 93.28 15.65C91.347 15.65 89.78 14.083 89.78 12.15C89.78 10.217 91.347 8.65 93.28 8.65C95.213 8.65 96.78 10.217 96.78 12.15Z";
const WORDMARK_LETTERS = [
  "M0 14.65V4.39H2.53V6.32L2.23 5.99H2.6C2.78667 5.43 3.15333 4.96667 3.7 4.6C4.24667 4.23333 4.82333 4.05 5.43 4.05C5.61 4.05 5.79667 4.06667 5.99 4.1C6.18333 4.13333 6.43333 4.2 6.74 4.3V6.83C6.32 6.68333 5.99333 6.58667 5.76 6.54C5.52667 6.49333 5.31333 6.47 5.12 6.47C4.40667 6.47 3.81667 6.73333 3.35 7.26C2.88333 7.78 2.65 8.44 2.65 9.24V14.65H0Z",
  "M8.58078 18.98C8.58078 18.9867 8.58078 18.9867 8.58078 18.98L11.1808 13.33L11.2208 14.65L6.71078 4.39H9.47078L11.9008 10.34L12.1908 11.24H12.2508L12.5608 10.32L14.8708 4.39H17.5608L11.3408 18.98C11.3408 18.9867 11.3408 18.9867 11.3408 18.98H8.58078Z",
  "M21.0086 14.99C19.9153 14.99 19.0386 14.69 18.3786 14.09C17.7186 13.49 17.3886 12.6967 17.3886 11.71C17.3886 10.61 17.7853 9.75333 18.5786 9.14C19.3786 8.52 20.4186 8.21 21.6986 8.21C22.2586 8.21 22.7853 8.25667 23.2786 8.35C23.7719 8.43667 24.1853 8.55 24.5186 8.69V8.13C24.5186 7.47667 24.3019 6.96667 23.8686 6.6C23.4353 6.22667 22.8553 6.04 22.1286 6.04C21.4886 6.04 20.9219 6.15667 20.4286 6.39C19.9419 6.62333 19.4819 6.96 19.0486 7.4L17.7286 5.97C18.4686 5.29 19.2053 4.80333 19.9386 4.51C20.6719 4.21667 21.5086 4.07 22.4486 4.07C23.9286 4.07 25.0819 4.42333 25.9086 5.13C26.7419 5.83 27.1586 6.83667 27.1586 8.15V14.65H24.5186V12.35L25.1286 13.15H24.4586C24.1853 13.6633 23.7453 14.1 23.1386 14.46C22.5319 14.8133 21.8219 14.99 21.0086 14.99ZM21.9186 12.97C22.6853 12.97 23.3086 12.7233 23.7886 12.23C24.2753 11.73 24.5186 11.1133 24.5186 10.38V10.34C24.2586 10.1667 23.9319 10.0333 23.5386 9.94C23.1453 9.84667 22.7319 9.8 22.2986 9.8C21.6119 9.8 21.0519 9.94 20.6186 10.22C20.1919 10.5 19.9786 10.9067 19.9786 11.44C19.9786 11.92 20.1586 12.2967 20.5186 12.57C20.8786 12.8367 21.3453 12.97 21.9186 12.97Z",
  "M29.1125 14.65V4.39H31.6425V6.26L31.3525 5.89H31.7125C32.0325 5.33 32.5025 4.88333 33.1225 4.55C33.7492 4.21667 34.3992 4.05 35.0725 4.05C36.2325 4.05 37.1425 4.4 37.8025 5.1C38.4625 5.79333 38.7925 6.74 38.7925 7.94V14.65H36.1525V8.51C36.1525 7.77667 35.9725 7.22 35.6125 6.84C35.2592 6.46 34.7425 6.27 34.0625 6.27C33.4025 6.27 32.8525 6.52333 32.4125 7.03C31.9792 7.53667 31.7625 8.15333 31.7625 8.88V14.65H29.1125Z",
  "M40.0042 6.48V4.39H46.6242V6.48H40.0042ZM41.6542 14.65V3.4C41.6542 2.37333 41.9776 1.55 42.6242 0.929999C43.2709 0.31 44.1409 0 45.2342 0C45.5409 0 45.8342 0.0199997 46.1142 0.0599992C46.3942 0.0999995 46.6809 0.16 46.9742 0.239999V2.37C46.7409 2.30333 46.5176 2.25333 46.3042 2.22C46.0976 2.18667 45.8909 2.17 45.6842 2.17C45.2842 2.17 44.9542 2.29 44.6942 2.53C44.4342 2.76333 44.3042 3.1 44.3042 3.54V14.65H41.6542Z",
  "M51.6123 14.99C50.4057 14.99 49.469 14.6433 48.8023 13.95C48.1357 13.2567 47.8023 12.2767 47.8023 11.01V4.39H50.4523V10.6C50.4523 11.3467 50.6257 11.92 50.9723 12.32C51.319 12.72 51.8123 12.92 52.4523 12.92C53.1257 12.92 53.689 12.6633 54.1423 12.15C54.6023 11.6367 54.8323 11.01 54.8323 10.27V4.39H57.4823V14.65H54.9823V12.05L56.1823 13.25H54.9123C54.6257 13.7633 54.1857 14.1833 53.5923 14.51C53.0057 14.83 52.3457 14.99 51.6123 14.99Z",
  "M59.5141 14.65V4.39H62.0441V6.32L61.7441 5.99H62.1141C62.3007 5.43 62.6674 4.96667 63.2141 4.6C63.7607 4.23333 64.3374 4.05 64.9441 4.05C65.1241 4.05 65.3107 4.06667 65.5041 4.1C65.6974 4.13333 65.9474 4.2 66.2541 4.3V6.83C65.8341 6.68333 65.5074 6.58667 65.2741 6.54C65.0407 6.49333 64.8274 6.47 64.6341 6.47C63.9207 6.47 63.3307 6.73333 62.8641 7.26C62.3974 7.78 62.1641 8.44 62.1641 9.24V14.65H59.5141Z",
  "M67.4148 14.65V4.39H69.9448V6.32L69.6448 5.99H70.0148C70.2015 5.43 70.5682 4.96667 71.1148 4.6C71.6615 4.23333 72.2382 4.05 72.8448 4.05C73.0248 4.05 73.2115 4.06667 73.4048 4.1C73.5982 4.13333 73.8482 4.2 74.1548 4.3V6.83C73.7348 6.68333 73.4082 6.58667 73.1748 6.54C72.9415 6.49333 72.7282 6.47 72.5348 6.47C71.8215 6.47 71.2315 6.73333 70.7648 7.26C70.2982 7.78 70.0648 8.44 70.0648 9.24V14.65H67.4148Z",
  "M79.5959 14.99C77.9959 14.99 76.7093 14.4833 75.7359 13.47C74.7693 12.45 74.2859 11.14 74.2859 9.54C74.2859 7.95333 74.7759 6.64667 75.7559 5.62C76.7359 4.58667 78.0159 4.07 79.5959 4.07C81.0493 4.07 82.2493 4.55667 83.1959 5.53C84.1426 6.49667 84.6159 7.77667 84.6159 9.37C84.6159 9.53667 84.6093 9.68 84.5959 9.8C84.5893 9.92 84.5693 10.08 84.5359 10.28L75.5859 10.29V8.3H82.0459C81.9659 7.68667 81.7126 7.18 81.2859 6.78C80.8593 6.38 80.2926 6.18 79.5859 6.18C78.7859 6.18 78.1359 6.47 77.6359 7.05C77.1359 7.63 76.8859 8.42667 76.8859 9.44C76.8859 10.5267 77.1659 11.3867 77.7259 12.02C78.2859 12.6467 79.0193 12.96 79.9259 12.96C80.5259 12.96 81.0559 12.8333 81.5159 12.58C81.9759 12.32 82.3959 11.92 82.7759 11.38L84.3559 12.63C83.8093 13.41 83.1559 14 82.3959 14.4C81.6426 14.7933 80.7093 14.99 79.5959 14.99Z",
  "M86.068 14.65V4.39H88.598V6.32L88.298 5.99H88.668C88.8546 5.43 89.2213 4.96667 89.768 4.6C90.3146 4.23333 90.8913 4.05 91.498 4.05C91.678 4.05 91.8646 4.06667 92.058 4.1C92.2513 4.13333 93.4726 4.29 93.7793 4.39V6.83C91.828 6.52539 92.0613 6.58667 91.828 6.54C91.5946 6.49333 91.3813 6.47 91.188 6.47C90.4746 6.47 89.8846 6.73333 89.418 7.26C88.9513 7.78 88.718 8.44 88.718 9.24V14.65H86.068Z",
];

// The mark is 97×19; render it at 30px tall (≈153 wide) as an SVG data-URI img
// — Satori renders that far more reliably than a deep inline <svg> subtree.
const WORDMARK_HEIGHT = 30;
const WORDMARK_WIDTH = Math.round((WORDMARK_HEIGHT * 97) / 19);
const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="97" height="19" viewBox="0 0 97 19" fill="none"><path d="${WORDMARK_DOT}" fill="${COLORS.brand}"/>${WORDMARK_LETTERS.map((d) => `<path d="${d}" fill="${COLORS.title}"/>`).join("")}</svg>`;
const WORDMARK_SRC = `data:image/svg+xml;base64,${Buffer.from(wordmarkSvg).toString("base64")}`;

// These routes are prerendered during `astro build`, whose cwd is the project
// root — resolve the committed font files from there. (import.meta.url can't be
// used: the endpoint is bundled into dist/chunks, so relative paths shift.)
const fontPath = (file: string) =>
  join(process.cwd(), "src/assets/og/fonts", file);

// Read once at module load — endpoints render many cards per build.
const fonts = [
  {
    name: "Google Sans",
    data: readFileSync(fontPath("GoogleSans-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Google Sans",
    data: readFileSync(fontPath("GoogleSans-SemiBold.ttf")),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Berkeley Mono",
    data: readFileSync(fontPath("BerkeleyMono-Regular.otf")),
    weight: 400 as const,
    style: "normal" as const,
  },
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
  /** The big foreground statement — a section name or an entry's title. */
  title: string;
  /** Muted standfirst under the title (a section's lede or entry description). */
  description?: string;
  /** Path shown top-right, e.g. "writing/my-post" → "ryanfurrer.com/writing/my-post". */
  path: string;
}

export async function renderOgCard({
  title,
  description,
  path,
}: OgCard): Promise<Buffer> {
  // Just the section path (e.g. "/writing") — the domain is implied, and this
  // stays short whether it's a section card or a post within that section.
  const url = `/${path}`.replace(/\/$/, "") || "/";
  const titleSize = titleFontSize(title);
  const descriptionGap = titleSize >= 104 ? 16 : 24;

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
        fontFamily: "Google Sans",
      },
    },
    // Top row: wordmark (left) + URL (right)
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
      h("img", {
        src: WORDMARK_SRC,
        width: WORDMARK_WIDTH,
        height: WORDMARK_HEIGHT,
        style: { flexShrink: 0, marginRight: "48px" },
      }),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Berkeley Mono",
            fontSize: 25,
            color: COLORS.muted,
            textAlign: "right",
          },
        },
        url,
      ),
    ),
    // Bottom block, anchored lower-left: a big foreground title (the section
    // name or entry title) over a muted standfirst, echoing the site's headers.
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: titleSize,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
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
                display: "block",
                marginTop: `${descriptionGap}px`,
                fontSize: 34,
                lineHeight: 1.35,
                color: COLORS.muted,
                maxWidth: "860px",
                lineClamp: 3,
                textOverflow: "ellipsis",
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
