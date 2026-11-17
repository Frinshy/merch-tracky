import { Chip } from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";

import { EraBadge } from "@/components/eras/era-badge";
import { coverOf } from "@/lib/catalog/data";
import { formatDate } from "@/lib/catalog/format";
import type { MerchItem } from "@/lib/catalog/types";

export function ItemCard({
  item,
  showEra = true,
  preload = false,
}: {
  item: MerchItem;
  showEra?: boolean;
  preload?: boolean;
}) {
  const cover = coverOf(item);
  const releaseDate = formatDate(item.releaseDate);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-secondary ring-1 ring-separator transition group-hover:ring-foreground/30">
        <Image
          fill
          alt={cover.alt || item.name}
          className="object-contain p-[8%] transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          preload={preload}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
          src={cover.src}
        />
        {item.limited && (
          <Chip className="absolute right-2.5 top-2.5" color="accent" size="sm" variant="primary">
            Limited
          </Chip>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-medium leading-snug">
          {/* The ::after overlay makes the whole card clickable. */}
          <NextLink
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-focus"
            href={`/items/${item.id}`}
          >
            {item.name}
          </NextLink>
        </h3>
        <p className="label-caps flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
          <span>{item.type}</span>
          {showEra && (
            <>
              <span aria-hidden="true">·</span>
              <EraBadge plain slug={item.era} />
            </>
          )}
          {releaseDate && (
            <>
              <span aria-hidden="true">·</span>
              <span>{releaseDate}</span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}
