import Image from "next/image";

import type { Era } from "@/lib/catalog/types";

/**
 * Fills its (positioned) parent with an era's artwork:
 * - the cover, contained so square art isn't cropped
 * - otherwise a grid of up to four item photos, or a single photo
 * - otherwise a placeholder message
 * Place it on a `halftone` surface filled with the era colour.
 */
export function EraArtwork({
  era,
  photos,
  sizes,
  preload = false,
}: {
  era: Era;
  photos: string[];
  sizes: string;
  /** Load eagerly (use for artwork above the fold). */
  preload?: boolean;
}) {
  if (era.cover) {
    return (
      <div className="absolute inset-[8%] transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none">
        <Image
          fill
          alt={`${era.name} cover`}
          className="object-contain drop-shadow-2xl"
          preload={preload}
          sizes={sizes}
          src={era.cover}
        />
      </div>
    );
  }

  if (photos.length > 1) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4">
        {photos.slice(0, 4).map((src) => (
          <div key={src} className="relative">
            <Image
              fill
              alt=""
              className="object-contain drop-shadow-xl transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
              preload={preload}
              sizes="20vw"
              src={src}
            />
          </div>
        ))}
      </div>
    );
  }

  if (photos.length === 1) {
    return (
      <Image
        fill
        alt=""
        className="object-contain p-[8%] drop-shadow-2xl transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
        preload={preload}
        sizes={sizes}
        src={photos[0]}
      />
    );
  }

  return (
    <span className="type-display absolute inset-0 grid place-items-center text-3xl text-black/50">
      Nothing archived yet
    </span>
  );
}
