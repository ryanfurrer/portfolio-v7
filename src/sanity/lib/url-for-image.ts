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
  /** Uncropped hi-res variant for click-to-zoom (the header `src` is cropped). */
  zoomSrc: string;
}

export interface ResponsiveBodyImage extends ResponsiveImage {
  width?: number;
  height?: number;
}

const articleHeaderWidths = [640, 960, 1280, 1600];
const articleHeaderAspectRatio = 550 / 310;
const articleBodyWidths = [480, 768, 960, 1280, 1600, 2000];

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
    // Zoom reveals the whole photo, so drop the 550/310 crop and serve wide.
    zoomSrc: zoomImageUrl(source),
  };
}

/**
 * Body images share the article column but keep their authored aspect ratio.
 * Cap the candidate list at the source width so every `w` descriptor remains
 * truthful and the CDN never receives an upscale request.
 */
export function articleBodyImage(
  source: SanityImageSource,
): ResponsiveBodyImage {
  const size = imageDimensions(source);
  const widths = size
    ? [...articleBodyWidths.filter((width) => width < size.width), size.width]
    : articleBodyWidths;
  const fallbackWidth = Math.min(960, size?.width ?? 960);
  const urlAtWidth = (width: number) =>
    urlForImage(source).width(width).fit("max").auto("format").url();

  return {
    src: urlAtWidth(fallbackWidth),
    srcset: widths.map((width) => `${urlAtWidth(width)} ${width}w`).join(", "),
    zoomSrc: zoomImageUrl(source),
    width: size?.width,
    height: size?.height,
  };
}

/**
 * Enlarged variant for click-to-zoom: wide enough to reward filling the screen
 * on high-density displays, but `fit("max")` caps it at the source so we never
 * upscale. Fetched only when the reader opens the lightbox.
 */
export function zoomImageUrl(source: SanityImageSource): string {
  return urlForImage(source).width(2000).fit("max").auto("format").url();
}

// A Sanity image asset `_ref` encodes its intrinsic size, e.g.
// `image-abc123-1200x630-jpg`. Parsing it and applying the authored crop lets us
// reserve the rendered aspect ratio without expanding `asset->metadata.dimensions`
// in every GROQ projection.
export function imageDimensions(
  source: SanityImageSource | undefined | null,
): { width: number; height: number } | null {
  if (!source) return null;

  const asset =
    typeof source === "object" && "asset" in source ? source.asset : source;
  const id =
    typeof asset === "string"
      ? asset
      : "_ref" in asset
        ? asset._ref
        : asset._id;
  const match = id?.match(/-(\d+)x(\d+)-/);
  if (!match) return null;

  const crop =
    typeof source === "object" && "crop" in source ? source.crop : undefined;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return {
    width: Math.round(width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))),
    height: Math.round(height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))),
  };
}
