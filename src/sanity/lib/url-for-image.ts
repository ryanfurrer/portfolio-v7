import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { sanityClient } from "sanity:client";

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

// A Sanity image asset `_ref` encodes its intrinsic size, e.g.
// `image-abc123-1200x630-jpg`. Parsing it lets us set width/height on <img>
// (reserving layout space, so images don't shift the page as they load)
// without expanding `asset->metadata.dimensions` in every GROQ projection.
export function imageDimensions(
  asset: { _ref?: string } | undefined | null,
): { width: number; height: number } | null {
  const match = asset?._ref?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}
