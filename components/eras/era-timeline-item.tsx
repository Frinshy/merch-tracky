import { Chip } from "@heroui/react";
import NextLink from "next/link";

import { Stat } from "@/components/ui/stat";
import { eraStats } from "@/lib/catalog/data";
import type { Era } from "@/lib/catalog/types";

import { EraArtwork } from "./era-artwork";
import { EraButtonLink } from "./era-button-link";

/** One era on the /eras timeline: year, text + stats, and artwork. */
export function EraTimelineItem({ era, isCurrent }: { era: Era; isCurrent: boolean }) {
  const { count, formats, photos } = eraStats(era.slug);
  const href = `/eras/${era.slug}`;

  return (
    <li
      className="grid scroll-mt-20 gap-6 border-t-2 border-foreground py-10 md:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10"
      id={era.slug}
    >
      <div className="flex items-center gap-3 md:flex-col md:items-start">
        <span className="type-display text-5xl leading-none md:text-6xl">{era.year}</span>
        <span
          aria-hidden="true"
          className="h-2 w-10 rounded-full"
          style={{ backgroundColor: era.color }}
        />
        {isCurrent && (
          <Chip className="label-caps rounded-sm bg-foreground text-background" size="sm">
            Current era
          </Chip>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="type-display text-5xl leading-[0.85] sm:text-6xl">
          <NextLink className="focus-outline hover:underline" href={href}>
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
          Open {era.name}
        </EraButtonLink>
      </div>

      <NextLink
        aria-label={`Open ${era.name}`}
        className="halftone focus-outline group relative block aspect-[16/10] overflow-hidden rounded-sm"
        href={href}
        style={{ backgroundColor: era.color }}
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
