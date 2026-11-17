import type { MerchItem } from "@/lib/catalog/types";

import { ItemCard } from "./item-card";

export function ItemGrid({
  items,
  showEra = true,
  /** Number of leading images to load eagerly (above the fold). */
  preloadCount = 0,
}: {
  items: readonly MerchItem[];
  showEra?: boolean;
  preloadCount?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, index) => (
        <ItemCard key={item.id} item={item} preload={index < preloadCount} showEra={showEra} />
      ))}
    </div>
  );
}
