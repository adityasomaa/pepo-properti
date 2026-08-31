import villaRehan from "@/public/photos/villa-rehan/manifest.json";

/**
 * Every photo album the site can draw from.
 *
 * The manifests are written by scripts/optimize-photos.mjs, which also writes
 * the image files themselves. Importing the JSON keeps each photo's real
 * dimensions in the markup, so a picture never collapses the layout while it
 * loads. Add an album by running the script and adding a line here.
 */
export type PhotoEntry = {
  slug: string;
  source: string;
  width: number;
  height: number;
  widths: number[];
  blur: string;
};

const photoManifests: Record<string, PhotoEntry[]> = {
  "villa-rehan": villaRehan as PhotoEntry[],
};

export default photoManifests;
