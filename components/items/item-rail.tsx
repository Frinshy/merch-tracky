import { ScrollShadow } from "@heroui/react";

import type { MerchItem } from "@/lib/catalog/types";

import { ItemCard } from "./item-card";

/**
 * A single horizontally scrolling row of item cards. Used where a grid would
 * leave a half-empty last row (home page, "more from this era").
 */
export function ItemRail({
  items,
  showEra = true,
  preloadCount = 0,
  label,
}: {
  items: readonly MerchItem[];
  showEra?: boolean;
  preloadCount?: number;
  label: string;
}) {
  return (
    <ScrollShadow hideScrollBar className="-mx-4 sm:-mx-6" orientation="horizontal" size={48}>
      <ul
        aria-label={label}
        className="flex snap-x snap-mandatory scroll-px-4 gap-4 px-4 pb-2 sm:scroll-px-6 sm:px-6"
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className="w-[42%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[18.5%]"
          >
            <ItemCard item={item} preload={index < preloadCount} showEra={showEra} />
          </li>
        ))}
      </ul>
    </ScrollShadow>
  );
}
