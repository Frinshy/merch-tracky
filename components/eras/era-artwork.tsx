import Image from "next/image";

import type { Era } from "@/lib/catalog/types";

/**
 * Fills its (positioned) parent with an era's artwork:
 * - the cover over a blurred copy of itself, so square art isn't cropped
 * - otherwise a grid of up to four item photos, or a single photo
 * - otherwise a placeholder message
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
      <>
        <Image
          fill
          alt=""
          className="scale-125 object-cover opacity-70 blur-2xl"
          sizes="10vw"
          src={era.cover}
        />
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
      </>
    );
  }

  if (photos.length > 1) {
    return (
      <div className="absolute inset-0 grid grid-cols-2 gap-px p-px">
        {photos.slice(0, 4).map((src) => (
          <div key={src} className="relative overflow-hidden bg-black/10">
            <Image
              fill
              alt=""
              className="object-contain p-3 transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
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
        className="object-contain p-6 transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
        preload={preload}
        sizes={sizes}
        src={photos[0]}
      />
    );
  }

  return (
    <span className="absolute inset-0 grid place-items-center font-display text-2xl text-black/50">
      Nothing archived yet
    </span>
  );
}

/** Era colour gradient used behind artwork and in headers. */
export const eraGradient = (color: string, angle = 135, depth = 45) =>
  `linear-gradient(${angle}deg, ${color}, color-mix(in oklab, ${color} ${depth}%, black))`;
