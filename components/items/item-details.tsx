import { Card } from "@heroui/react";

import { EraBadge } from "@/components/eras/era-badge";
import { formatDate } from "@/lib/catalog/format";
import type { MerchItem } from "@/lib/catalog/types";

/** An item's metadata card: a two-column spec grid with the price below. Empty fields are skipped. */
export function ItemDetails({ item }: { item: MerchItem }) {
  const rows = (
    [
      ["Format", item.type],
      ["Era", <EraBadge key="era" slug={item.era} />],
      ["Edition", item.edition],
      ["Released", formatDate(item.releaseDate)],
      ["Sold via", item.source],
      ["Region", item.region],
      ["Added", formatDate(item.addedAt)],
    ] as const
  ).filter(([, value]) => value);

  return (
    <Card className="w-full gap-0 overflow-hidden rounded-sm p-0 ring-1 ring-separator">
      <Card.Content>
        <dl className="grid grid-cols-2">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex min-w-0 flex-col gap-1 border-t border-separator px-5 py-4 odd:border-r last:odd:col-span-2 last:odd:border-r-0 [&:nth-child(-n+2)]:border-t-0"
            >
              <dt className="label-caps text-muted">{label}</dt>
              <dd className="font-medium break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </Card.Content>
      {item.price && (
        <Card.Footer className="items-end justify-between gap-4 border-t border-separator bg-surface-secondary px-5 py-4">
          <span className="label-caps text-muted">Original price</span>
          <span className="type-display text-4xl leading-none">{item.price}</span>
        </Card.Footer>
      )}
    </Card>
  );
}
