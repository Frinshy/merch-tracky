import Image from "next/image";

import { ItemGrid } from "@/components/items/item-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { itemsInEra, newestFirst } from "@/lib/catalog/data";
import type { Era } from "@/lib/catalog/types";

import { EraDot } from "./era-badge";

/** Homepage band featuring the latest era and its newest items. */
export function CurrentEraSpotlight({ era, limit = 5 }: { era: Era; limit?: number }) {
  const eraItems = newestFirst(itemsInEra(era.slug));

  if (!eraItems.length) return null;

  return (
    <section
      aria-labelledby="current-era-heading"
      className="-mx-4 flex flex-col gap-8 px-4 py-10 sm:-mx-6 sm:rounded-xl sm:px-8"
      style={{
        background: `linear-gradient(160deg, color-mix(in oklab, ${era.color} 28%, transparent), transparent 70%)`,
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-6">
          {era.cover && (
            <div className="relative hidden size-32 shrink-0 overflow-hidden rounded-lg shadow-xl ring-1 ring-separator sm:block">
              <Image
                fill
                alt={`${era.name} cover`}
                className="object-cover"
                sizes="8rem"
                src={era.cover}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="label-caps flex items-center gap-2 text-muted">
              <EraDot color={era.color} />
              Current era · {era.year}
            </p>
            <h2 className="font-display text-5xl leading-none sm:text-6xl" id="current-era-heading">
              {era.name}
            </h2>
            {era.description && <p className="max-w-lg text-muted">{era.description}</p>}
          </div>
        </div>
        <ButtonLink
          className="text-black"
          href={`/eras/${era.slug}`}
          style={{ backgroundColor: era.color }}
        >
          All {eraItems.length} items <span aria-hidden="true">→</span>
        </ButtonLink>
      </div>
      <ItemGrid items={eraItems.slice(0, limit)} showEra={false} />
    </section>
  );
}
