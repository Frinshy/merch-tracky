import Image from "next/image";
import Link from "next/link";

import { EraBadge } from "@/components/era-badge";
import {
  coverOf,
  formatDate,
  type MerchItem,
} from "@/lib/catalog";

export function ItemCard({
  item,
  showEra = true,
  priority = false,
}: {
  item: MerchItem;
  showEra?: boolean;
  priority?: boolean;
}) {
  const cover = coverOf(item);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-surface-secondary ring-1 ring-separator transition group-hover:ring-foreground/30">
        <Image
          alt={cover.alt || item.name}
          className="object-contain p-[8%] transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          fill
          priority={priority}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
          src={cover.src}
        />
        {item.limited && (
          <span className="label-caps absolute right-2.5 top-2.5 rounded-sm bg-foreground px-1.5 py-0.5 text-background">
            Limited
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-medium leading-snug">
          <Link
            className="after:absolute after:inset-0 after:content-['']"
            href={`/items/${item.id}`}
          >
            {item.name}
          </Link>
        </h3>
        <p className="label-caps flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
          <span>{item.type}</span>
          {showEra && (
            <>
              <span aria-hidden="true">·</span>
              <EraBadge plain slug={item.era} />
            </>
          )}
          {item.releaseDate && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatDate(item.releaseDate)}</span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

export function ItemGrid({
  items,
  showEra = true,
}: {
  items: MerchItem[];
  showEra?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, index) => (
        <ItemCard
          item={item}
          key={item.id}
          priority={index < 5}
          showEra={showEra}
        />
      ))}
    </div>
  );
}
