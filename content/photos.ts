import buyand01_ungasan from "@/public/photos/buyand01-ungasan/manifest.json";
import dekpi01_getakan from "@/public/photos/dekpi01-getakan/manifest.json";
import kost_bulu_jaya from "@/public/photos/kost-bulu-jaya/manifest.json";
import mahar01_saba from "@/public/photos/mahar01-saba/manifest.json";
import mbakind01_jimbaran from "@/public/photos/mbakind01-jimbaran/manifest.json";
import p11_klumpu from "@/public/photos/p11-klumpu/manifest.json";
import p4_pejukutan from "@/public/photos/p4-pejukutan/manifest.json";
import p6_sekartaji from "@/public/photos/p6-sekartaji/manifest.json";
import p9_kelingking from "@/public/photos/p9-kelingking/manifest.json";
import ruko_darmo_park from "@/public/photos/ruko-darmo-park/manifest.json";
import villa_rehan from "@/public/photos/villa-rehan/manifest.json";

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
  "buyand01-ungasan": buyand01_ungasan as PhotoEntry[],
  "dekpi01-getakan": dekpi01_getakan as PhotoEntry[],
  "kost-bulu-jaya": kost_bulu_jaya as PhotoEntry[],
  "mahar01-saba": mahar01_saba as PhotoEntry[],
  "mbakind01-jimbaran": mbakind01_jimbaran as PhotoEntry[],
  "p11-klumpu": p11_klumpu as PhotoEntry[],
  "p4-pejukutan": p4_pejukutan as PhotoEntry[],
  "p6-sekartaji": p6_sekartaji as PhotoEntry[],
  "p9-kelingking": p9_kelingking as PhotoEntry[],
  "ruko-darmo-park": ruko_darmo_park as PhotoEntry[],
  "villa-rehan": villa_rehan as PhotoEntry[],
};

export default photoManifests;
