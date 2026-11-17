import { notFound } from "next/navigation";

import { ItemForm } from "@/components/dev/item-form";
import { readEras, readItems } from "@/lib/dev-store";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [items, eras] = await Promise.all([readItems(), readEras()]);
  const item = items.find((i) => i.id === id);

  if (!item) notFound();

  return <ItemForm eras={eras} initial={item} items={items} />;
}
