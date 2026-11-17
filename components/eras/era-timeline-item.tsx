import { Chip } from "@heroui/react";
import NextLink from "next/link";

import { Stat } from "@/components/ui/stat";
import { eraStats } from "@/lib/catalog/data";
import type { Era } from "@/lib/catalog/types";

import { EraArtwork, eraGradient } from "./era-artwork";
import { EraDot } from "./era-badge";
import { EraButtonLink } from "./era-button-link";

/** One era on the /eras timeline: year, text + stats, and artwork. */
export function EraTimelineItem({ era, isCurrent }: { era: Era; isCurrent: boolean }) {
  const { count, formats, photos } = eraStats(era.slug);
  const href = `/eras/${era.slug}`;

  return (
    <li
      className="grid scroll-mt-20 gap-6 border-t border-separator py-10 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10"
      id={era.slug}
    >
      <div className="flex items-center gap-3 md:flex-col md:items-start">
        <EraDot className="size-3 ring-4 ring-background" color={era.color} />
        <span className="font-display text-4xl leading-none text-muted md:text-5xl">
          {era.year}
        </span>
        {isCurrent && (
          <Chip color="accent" size="sm" variant="primary">
            Current
          </Chip>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-5xl leading-[0.95] sm:text-6xl">
          <NextLink className="hover:underline" href={href}>
            {era.name}
          </NextLink>
        </h2>
        {era.description && <p className="max-w-md text-muted">{era.description}</p>}
        <dl className="flex flex-wrap gap-x-6 gap-y-2">
          <Stat label="Items" value={count} />
          {formats.map(({ type, count }) => (
            <Stat key={type} label={type} value={count} />
          ))}
        </dl>
        <EraButtonLink className="mt-2 w-fit" color={era.color} href={href}>
          Explore {era.name}
        </EraButtonLink>
      </div>

      <NextLink
        aria-label={`Explore ${era.name}`}
        className="group relative block aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-separator"
        href={href}
        style={{ background: eraGradient(era.color) }}
      >
        <EraArtwork
          era={era}
          photos={photos}
          preload={isCurrent}
          sizes="(min-width: 768px) 35vw, 90vw"
        />
      </NextLink>
    </li>
  );
}
