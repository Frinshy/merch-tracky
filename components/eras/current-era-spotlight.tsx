import NextLink from "next/link";

import { eraStats } from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";
import type { Era } from "@/lib/catalog/types";

import { EraArtwork, eraGradient } from "./era-artwork";
import { EraDot } from "./era-badge";
import { EraButtonLink } from "./era-button-link";

/** Home page feature card for the latest era: artwork, name and a link to it. */
export function CurrentEraSpotlight({ era }: { era: Era }) {
  const { count, photos } = eraStats(era.slug);
  const href = `/eras/${era.slug}`;

  return (
    <section aria-labelledby="current-era-heading" className="flex flex-col gap-4">
      <NextLink
        aria-label={`Explore ${era.name}`}
        className="group relative block aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-separator"
        href={href}
        style={{ background: eraGradient(era.color) }}
      >
        <EraArtwork preload era={era} photos={photos} sizes="(min-width: 1024px) 40vw, 90vw" />
      </NextLink>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="label-caps flex items-center gap-2 text-muted">
            <EraDot color={era.color} />
            Current era · {era.year}
          </p>
          <h2 className="font-display text-4xl leading-none" id="current-era-heading">
            <NextLink className="hover:underline" href={href}>
              {era.name}
            </NextLink>
          </h2>
        </div>
        {count > 0 && (
          <EraButtonLink color={era.color} href={href}>
            {pluralize(count, "item")}
          </EraButtonLink>
        )}
      </div>
    </section>
  );
}
