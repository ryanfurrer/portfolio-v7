import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { sanityClient } from "sanity:client";

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

export interface ResponsiveImage {
  src: string;
  srcset: string;
}

const articleHeaderWidths = [640, 960, 1280, 1600];
const articleHeaderAspectRatio = 550 / 310;

/**
 * Header images fill the article column, so serve enough pixels for high-density
 * displays without making every reader download the largest source.
 */
export function articleHeaderImage(source: SanityImageSource): ResponsiveImage {
  const urlAtWidth = (width: number) =>
    urlForImage(source)
      .width(width)
      .height(Math.round(width / articleHeaderAspectRatio))
      .fit("crop")
      .auto("format")
      .url();

  return {
    src: urlAtWidth(960),
    srcset: articleHeaderWidths
      .map((width) => `${urlAtWidth(width)} ${width}w`)
      .join(", "),
  };
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
