import { Chip } from "@heroui/react";
import NextLink from "next/link";

import { eraStats } from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";
import type { Era } from "@/lib/catalog/types";

import { EraArtwork } from "./era-artwork";

/** Home page feature for the latest era: its artwork printed on the era's ink. */
export function CurrentEraSpotlight({ era }: { era: Era }) {
  const { count, photos } = eraStats(era.slug);

  return (
    <NextLink
      aria-labelledby="current-era-heading"
      className="halftone focus-outline group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-sm p-5 text-black shadow-xl sm:aspect-[4/3] lg:aspect-[4/5]"
      href={`/eras/${era.slug}`}
      style={{ backgroundColor: era.color }}
    >
      <Chip className="label-caps relative w-fit rounded-sm bg-black text-white" size="lg">
        Current era, {era.year}
      </Chip>
      <div className="relative my-4 flex-1">
        <EraArtwork preload era={era} photos={photos} sizes="(min-width: 1024px) 40vw, 90vw" />
      </div>
      <div className="relative flex items-end justify-between gap-4">
        <h2 className="type-display text-5xl leading-[0.85] sm:text-6xl" id="current-era-heading">
          {era.name}
        </h2>
        {count > 0 && (
          <Chip
            className="label-caps shrink-0 bg-black px-3 py-1.5 text-white transition group-hover:bg-white group-hover:text-black"
            size="lg"
          >
            See {pluralize(count, "item")}
          </Chip>
        )}
      </div>
    </NextLink>
  );
}
