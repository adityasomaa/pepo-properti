import photoManifests from "@/content/photos";

/**
 * A photograph, at the size the visitor's screen actually needs.
 *
 * The Vercel image optimizer is off on this account, so nothing resizes images
 * at request time — whatever is committed is what gets downloaded. The widths
 * and formats are therefore built ahead of time by scripts/optimize-photos.mjs,
 * and this picks between them.
 *
 * Format order matters: the browser takes the first <source> it understands, so
 * AVIF comes before WebP, and the <img> carries JPEG as the floor.
 *
 * `sizes` is how wide the photo will be laid out, not how wide the file is. Get
 * it wrong and the browser fetches the wrong width — too small looks soft, too
 * large wastes the whole point. Pass the CSS width the photo occupies.
 */
export function Photo({
  album,
  slug,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  album: string;
  slug: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const photo = photoManifests[album]?.find((p) => p.slug === slug);

  if (!photo) {
    // A missing photo is a content mistake, not a crash. Render nothing rather
    // than a broken image icon, and say so where a developer will see it.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Photo not found: album "${album}", slug "${slug}"`);
    }
    return null;
  }

  const srcSet = (ext: string) =>
    photo.widths.map((w) => `/photos/${album}/${photo.slug}-${w}.${ext} ${w}w`).join(", ");

  const widest = photo.widths[photo.widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`/photos/${album}/${photo.slug}-${widest}.jpg`}
        srcSet={srcSet("jpg")}
        sizes={sizes}
        alt={alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        /* The blurred stand-in holds the colour while the real file arrives.
           It is background, not content, so it cannot be mistaken for the photo
           by anything reading the page. */
        style={{
          backgroundImage: `url(${photo.blur})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className={className}
      />
    </picture>
  );
}
