import NextLink from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { eraStats, eras } from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";

import { EraArtwork } from "./era-artwork";

/** Home page grid of every era, newest first: artwork on the era's ink, then year, name and count. */
export function EraShowcase() {
  const timeline = [...eras].reverse();

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading action={{ href: "/eras", label: "Read about each era" }} title="The eras" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {timeline.map((era) => {
          const { count, photos } = eraStats(era.slug);

          return (
            <li key={era.slug} className="group relative flex flex-col">
              <div
                className="halftone relative aspect-square overflow-hidden rounded-sm ring-1 ring-separator transition group-hover:-translate-y-0.5 group-hover:shadow-lg motion-reduce:transition-none"
                style={{ backgroundColor: era.color }}
              >
                <EraArtwork
                  era={era}
                  photos={photos}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="type-display min-w-0 text-3xl leading-[0.9]">
                  {/* The ::after overlay makes the whole tile clickable. */}
                  <NextLink
                    className="decoration-2 underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-focus"
                    href={`/eras/${era.slug}`}
                  >
                    {era.name}
                  </NextLink>
                </h3>
                <span className="type-display shrink-0 text-xl leading-none text-muted">
                  {era.year}
                </span>
              </div>
              <p className="label-caps mt-1 text-muted">{pluralize(count, "item")}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
