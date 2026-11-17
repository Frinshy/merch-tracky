import { EraBadge } from "@/components/eras/era-badge";
import { formatDate } from "@/lib/catalog/format";
import type { MerchItem } from "@/lib/catalog/types";

/** Definition list of an item's metadata. Empty fields are skipped. */
export function ItemDetails({ item }: { item: MerchItem }) {
  const rows: [label: string, value: React.ReactNode][] = [
    ["Format", item.type],
    ["Era", <EraBadge key="era" slug={item.era} />],
    ["Edition", item.edition],
    ["Released", formatDate(item.releaseDate)],
    ["Sold via", item.source],
    ["Region", item.region],
    ["Original price", item.price],
    ["Limited", item.limited ? "Yes" : undefined],
    ["Added to archive", formatDate(item.addedAt)],
  ];

  return (
    <dl className="divide-y divide-separator border-y border-separator">
      {rows
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label} className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-sm">
            <dt className="label-caps self-center text-muted">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}
