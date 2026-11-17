import Image from "next/image";
import NextLink from "next/link";

import { EraBadge } from "@/components/eras/era-badge";
import { coverOf } from "@/lib/catalog/data";
import { formatDate } from "@/lib/catalog/format";
import type { MerchItem } from "@/lib/catalog/types";

import { LimitedSticker } from "./limited-sticker";

/** Compact one-row-per-item view, handy for checking items off. */
export function ItemList({ items }: { items: readonly MerchItem[] }) {
  return (
    <ul className="divide-y divide-separator border-y border-separator">
      {items.map((item) => (
        <li key={item.id} className="group relative flex items-center gap-4 py-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-surface ring-1 ring-separator">
            <Image
              fill
              alt=""
              className="object-contain p-1"
              sizes="56px"
              src={coverOf(item).src}
            />
          </div>
          <div className="min-w-0 flex-1">
            <NextLink
              className="font-semibold after:absolute after:inset-0 after:content-[''] group-hover:underline"
              href={`/items/${item.id}`}
            >
              {item.name}
            </NextLink>
            {item.edition && <span className="ml-2 text-sm text-muted">{item.edition}</span>}
            {item.limited && <LimitedSticker className="ml-2 align-middle" />}
          </div>
          <span className="hidden w-28 text-sm text-muted md:block">{item.type}</span>
          <EraBadge
            plain
            className="hidden w-48 text-sm text-muted md:inline-flex"
            slug={item.era}
          />
          <span className="hidden w-28 text-right text-sm text-muted lg:block">
            {formatDate(item.releaseDate) ?? "—"}
          </span>
        </li>
      ))}
    </ul>
  );
}
