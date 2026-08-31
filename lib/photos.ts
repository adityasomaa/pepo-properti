import photoManifests, { type PhotoEntry } from "@/content/photos";
import type { PhotoRef } from "@/content/listings";

/** The manifest entry behind a reference, or undefined if it does not exist. */
export function photoEntry(ref: PhotoRef): PhotoEntry | undefined {
  return photoManifests[ref.album]?.find((p) => p.slug === ref.slug);
}

/**
 * Resolves a photo reference to a plain file path.
 *
 * The site renders photos through <Photo>, which picks a width and a format per
 * reader. This is for the places that need one fixed URL instead: structured
 * data, Open Graph cards, and the asset audit.
 *
 * The width is a ceiling, not a promise. optimize-photos.mjs never upscales, so
 * a small source has no large sizes — asking for 1200 where the source is 900
 * wide would point at a file that was never written. This returns the largest
 * width that actually exists at or below what was asked for.
 */
export function photoUrl(ref: PhotoRef, width = 1200, ext: "jpg" | "webp" | "avif" = "jpg") {
  const entry = photoEntry(ref);
  const widths = entry?.widths ?? [];
  const best = widths.filter((w) => w <= width).pop() ?? widths[0] ?? width;
  return `/photos/${ref.album}/${ref.slug}-${best}.${ext}`;
}
