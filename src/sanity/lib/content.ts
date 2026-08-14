import type {SanityClient} from "@sanity/client";
import {slugify} from "@/lib/utils";
import {PUBLISHED_DOCUMENT_IDS_QUERY} from "@/sanity/lib/queries";

/**
 * Shared helpers for the three content detail pages (post / project /
 * appearance), which previously each inlined identical copies of this
 * heading-extraction and description-prepend logic.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface HeadingBlock {
  _type: string;
  style?: string;
  children?: Array<{text?: string}>;
}

interface DocumentIdentity {
  _id: string;
  originalId: string;
}

/**
 * Return the IDs of draft-backed documents that have never been published.
 * The second, explicitly published query is what distinguishes them from
 * published documents that merely have pending edits.
 */
export async function getUnpublishedDocumentIds(
  client: SanityClient,
  documents: DocumentIdentity[],
) {
  const draftBackedIds = documents
    .filter((document) => document.originalId.startsWith("drafts."))
    .map((document) => document._id);

  if (draftBackedIds.length === 0) return new Set<string>();

  const publishedIds = await client.fetch<string[]>(
    PUBLISHED_DOCUMENT_IDS_QUERY,
    {ids: draftBackedIds},
    {perspective: "published"},
  );
  const publishedIdSet = new Set(publishedIds);

  return new Set(draftBackedIds.filter((id) => !publishedIdSet.has(id)));
}

/** Pull h2/h3/h4 headings out of a Portable Text body for the ToC. */
export function extractHeadings(body: unknown): TocHeading[] {
  const blocks = (Array.isArray(body) ? body : []) as HeadingBlock[];
  return blocks
    .filter(
      (b) => b._type === "block" && ["h2", "h3", "h4"].includes(b.style ?? ""),
    )
    .map((b) => {
      const text = (b.children ?? []).map((c) => c.text ?? "").join("");
      return {
        id: slugify(text),
        text,
        level: parseInt((b.style ?? "h2").replace("h", ""), 10),
      };
    });
}

/**
 * Group dated content into buckets by publication year, returning the
 * buckets plus the years sorted newest-first. Shared by the three
 * index pages.
 */
export function groupByYear<T extends {publishedAt?: string | null}>(items: T[]) {
  const byYear = items.reduce<Record<number, T[]>>((acc, item) => {
    const year = item.publishedAt
      ? new Date(item.publishedAt).getFullYear()
      : 0;
    (acc[year] ??= []).push(item);
    return acc;
  }, {});
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);
  return {byYear, years};
}

/**
 * Turn a slugs query result into Astro `getStaticPaths` entries,
 * dropping any rows without a usable slug so params are always strings.
 */
export function toStaticPaths(rows: Array<{params: {slug: string | null}}>) {
  return rows
    .filter((row): row is {params: {slug: string}} => Boolean(row.params.slug))
    .map((row) => ({params: {slug: row.params.slug}}));
}
