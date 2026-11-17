import { Card } from "@heroui/react";

import { EraBadge } from "@/components/eras/era-badge";
import { formatDate } from "@/lib/catalog/format";
import type { MerchItem } from "@/lib/catalog/types";

/** An item's metadata card. Empty fields are skipped. */
export function ItemDetails({ item }: { item: MerchItem }) {
  const rows: [label: string, value: React.ReactNode][] = [
    ["Format", item.type],
    ["Era", <EraBadge key="era" slug={item.era} />],
    ["Edition", item.edition],
    ["Released", formatDate(item.releaseDate)],
    ["Sold via", item.source],
    ["Region", item.region],
    ["Added", formatDate(item.addedAt)],
  ];

  return (
    <Card className="w-full gap-4 rounded-sm p-4 ring-1 ring-separator">
      <Card.Content>
        <dl className="divide-y divide-separator border-y border-separator">
          {rows
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-2.5 text-sm">
                <dt className="label-caps self-center text-muted">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
      </Card.Content>
      {item.price && (
        <Card.Footer className="items-end justify-between gap-4">
          <span className="label-caps text-muted">Original price</span>
          <span className="type-display text-5xl leading-none">{item.price}</span>
        </Card.Footer>
      )}
    </Card>
  );
}
