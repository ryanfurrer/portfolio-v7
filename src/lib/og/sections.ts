/**
 * Single source of truth for each section's title + lede.
 *
 * Two consumers read from here so a card can never drift from its page:
 *   1. the section pages (writing/work/…) use `description` for the on-page
 *      lede AND the meta/OG description;
 *   2. the OG card generator (src/pages/og/[section].png.ts) renders the same
 *      title + lede onto the share card.
 *
 * About and Uses are editable in Sanity — their pages (and the generated card)
 * prefer the Sanity value and fall back to the lede here.
 */

export interface SectionMeta {
  /** Big headline on the card + the page's <h1>-adjacent label. */
  title: string;
  /** The lede — on-page standfirst, meta description, and card subtitle. */
  description: string;
}

export const SECTION_META = {
  writing: {
    title: "Writing",
    description: "Notes on the craft — code, design, and everything between.",
  },
  work: {
    title: "Work",
    description: "A collection of my projects, code snippets, and more.",
  },
  appearances: {
    title: "Appearances",
    description:
      "Talks, podcasts, and places I’ve shown up to share what I’ve learned.",
  },
  now: {
    title: "Now",
    description:
      "What I’m focused on at the moment — projects, reading, and life.",
  },
  links: {
    title: "Links",
    description:
      "Everywhere I show up online — follow along, say hello, or catch what I've made lately.",
  },
  about: {
    title: "About",
    description: "The short version of a longer story.",
  },
  uses: {
    title: "Uses",
    description: "The tools, toys, and setup I rely on daily.",
  },
} satisfies Record<string, SectionMeta>;

export type SectionSlug = keyof typeof SECTION_META;
