import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { codeToTokens, type ThemeRegistrationRaw } from "shiki";
import {
  DEFAULT_FLAVOR,
  EDITOR_SAMPLES,
  FLAVORS,
  HEARTH_KICKER,
  HEARTH_TAGLINE,
} from "@/lib/hearth/flavors";
import { hearthOrbSvg } from "@/lib/hearth/mark";
import { ogFonts } from "./fonts";
import { h, type Node } from "./vdom";

/**
 * The Hearth landing's own share card.
 *
 * The site's generic card (render-card.ts) is a title over a lede; that says
 * nothing about a product whose entire pitch is its colors. So this one is the
 * theme demonstrating itself: the page's hero copy beside a Hearth Dark editor
 * pane running the same TypeScript sample the page shows, tokenized by Shiki
 * with the vendored theme JSON. Every color below is read out of that JSON —
 * nothing here is a hand-picked approximation of it.
 */

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 72;

const flavor = FLAVORS.find(({ id }) => id === DEFAULT_FLAVOR);
if (!flavor) throw new Error("The default Hearth flavor is missing");

const theme = flavor.themes.dark as ThemeRegistrationRaw;
const ui = theme.colors as Record<string, string>;

const sample = EDITOR_SAMPLES.find(({ id }) => id === "typescript");
if (!sample) throw new Error("The TypeScript editor sample is missing");
const { code: SAMPLE_CODE, lang: SAMPLE_LANG, file: SAMPLE_FILE } = sample;

// Shiki's fontStyle is a bitmask; it ships no runtime enum to import.
const ITALIC = 1;
const BOLD = 2;

// Spelled out so the note reads as prose, but counted from FLAVORS so it can't
// outlive a flavor being added or dropped.
const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six"];
const spell = (n: number) => COUNT_WORDS[n] ?? String(n);
const VARIANT_NOTE = `${spell(FLAVORS.length * 2)} variants across ${spell(
  FLAVORS.length,
)} flavors`.replace(/^./, (first) => first.toUpperCase());

const MARK_SIZE = 56;
const MARK_SRC = `data:image/svg+xml;base64,${Buffer.from(
  hearthOrbSvg({ id: "hearth-orb-og", size: MARK_SIZE }),
).toString("base64")}`;

// The pane bleeds off the bottom and right edges: an editor that carries on
// past the frame reads as a screenshot of real work, and it lets the sample run
// its full length instead of being trimmed to fit a box.
const PANE = { x: 580, y: PADDING, width: 660, radius: 18 } as const;
const COLUMN_GAP = 60;
const CODE_SIZE = 19;
const CODE_LINE = Math.round(CODE_SIZE * 1.62);
const GUTTER_WIDTH = 44;

const codeLine = (
  tokens: Array<{ content: string; color?: string; fontStyle?: number }>,
  index: number,
) =>
  h(
    "div",
    { style: { display: "flex", height: `${CODE_LINE}px` } },
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          width: `${GUTTER_WIDTH}px`,
          marginRight: "18px",
          color: ui["editorLineNumber.foreground"],
        },
      },
      String(index + 1),
    ),
    ...tokens.map(({ content, color, fontStyle = 0 }) =>
      h(
        "span",
        {
          style: {
            whiteSpace: "pre",
            color: color ?? ui["editor.foreground"],
            fontWeight: fontStyle & BOLD ? 700 : 400,
            fontStyle: fontStyle & ITALIC ? "italic" : "normal",
          },
        },
        content,
      ),
    ),
  );

const editorPane = (
  lines: Awaited<ReturnType<typeof codeToTokens>>["tokens"],
) =>
  h(
    "div",
    {
      style: {
        position: "absolute",
        left: `${PANE.x}px`,
        top: `${PANE.y}px`,
        width: `${PANE.width}px`,
        // Taller than the canvas on purpose — the crop is the composition.
        height: `${HEIGHT}px`,
        display: "flex",
        flexDirection: "column",
        borderRadius: `${PANE.radius}px`,
        overflow: "hidden",
        border: `1px solid ${ui["editorWidget.border"]}`,
        backgroundColor: ui["editor.background"],
      },
    },
    // Hearth Dark paints the tab strip the same color as the editor; its ember
    // tab rule is drawn as an underline here — the landing page's own tab
    // treatment — overlapping the strip divider like the site's tabs do.
    h(
      "div",
      {
        style: {
          display: "flex",
          borderBottom: `1px solid ${ui["titleBar.border"]}`,
          fontFamily: "Berkeley Mono",
          fontSize: 20,
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            padding: "14px 22px 12px",
            marginBottom: "-1px",
            borderBottom: `3px solid ${ui["tab.activeBorderTop"]}`,
            color: ui["tab.activeForeground"],
          },
        },
        SAMPLE_FILE,
      ),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          padding: "22px 26px",
          fontFamily: "Berkeley Mono",
          fontSize: CODE_SIZE,
        },
      },
      ...lines.map(codeLine),
    ),
  );

const copyColumn = () =>
  h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: `${PANE.x - PADDING - COLUMN_GAP}px`,
        height: "100%",
      },
    },
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Berkeley Mono",
            fontSize: 19,
            letterSpacing: "0.025em",
            textTransform: "uppercase",
            color: ui["sideBarTitle.foreground"],
          },
        },
        HEARTH_KICKER,
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "22px 0 20px",
          },
        },
        h("img", { src: MARK_SRC, width: MARK_SIZE, height: MARK_SIZE }),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 58,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: ui["tab.activeForeground"],
            },
          },
          "Hearth",
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "block",
            fontSize: 25,
            lineHeight: 1.45,
            color: ui.descriptionForeground,
          },
        },
        HEARTH_TAGLINE,
      ),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "18px" } },
      // One dot per flavor, in its own dark-mode accent — the variant count
      // made visible rather than asserted.
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: "14px" } },
        h(
          "div",
          { style: { display: "flex", gap: "8px" } },
          ...FLAVORS.map(({ accent }) =>
            h("div", {
              style: {
                display: "flex",
                width: "13px",
                height: "13px",
                borderRadius: "13px",
                backgroundColor: accent.dark,
              },
            }),
          ),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 20,
              color: ui.descriptionForeground,
            },
          },
          VARIANT_NOTE,
        ),
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Berkeley Mono",
            fontSize: 21,
            color: ui["tab.inactiveForeground"],
          },
        },
        "hearth.ryanfurrer.com",
      ),
    ),
  );

export async function renderHearthOgCard(): Promise<Buffer> {
  const { tokens } = await codeToTokens(SAMPLE_CODE, {
    lang: SAMPLE_LANG,
    theme,
  });

  const tree: Node = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        padding: `${PADDING}px`,
        // The sidebar surface, one step up from the editor, so the pane below
        // reads as a pane rather than dissolving into the canvas.
        backgroundColor: ui["sideBar.background"],
        fontFamily: "Google Sans",
      },
    },
    // The editor's flat surfaces alone read cold for a theme named Hearth.
    h("div", {
      style: {
        display: "flex",
        position: "absolute",
        left: 0,
        top: 0,
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        backgroundImage: `radial-gradient(46% 46% at 10% 16%, ${ui["tab.activeBorderTop"]}1c, ${ui["tab.activeBorderTop"]}00)`,
      },
    }),
    copyColumn(),
    editorPane(tokens),
  );

  const svg = await satori(tree as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: ogFonts,
  });

  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
    .render()
    .asPng();
}
