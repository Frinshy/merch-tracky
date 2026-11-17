import { Card, Chip } from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";

import { EraBadge } from "@/components/eras/era-badge";
import { coverOf } from "@/lib/catalog/data";
import { formatDate } from "@/lib/catalog/format";
import type { MerchItem } from "@/lib/catalog/types";

import { LimitedSticker } from "./limited-sticker";

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
      <Card className="relative aspect-square rounded-sm p-0 ring-1 ring-separator transition group-hover:-translate-y-0.5 group-hover:shadow-lg motion-reduce:transition-none">
        <Image
          fill
          alt={cover.alt || item.name}
          className="object-contain p-[9%]"
          preload={preload}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
          src={cover.src}
        />
        {item.limited && <LimitedSticker className="absolute -right-2 -top-2" />}
      </Card>
      <div className="mt-3 flex flex-col gap-1.5">
        <h3 className="font-semibold leading-snug">
          {/* The ::after overlay makes the whole card clickable. */}
          <NextLink
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-focus"
            href={`/items/${item.id}`}
          >
            {item.name}
          </NextLink>
        </h3>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <Chip className="label-caps rounded-sm" size="sm" variant="secondary">
            {item.type}
          </Chip>
          {showEra && <EraBadge plain slug={item.era} />}
          {releaseDate && <span>{releaseDate}</span>}
        </p>
      </div>
    </article>
  );
}
