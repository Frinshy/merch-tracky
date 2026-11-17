import { notFound } from "next/navigation";

import { ItemForm } from "@/components/admin/item-form";
import { readEras, readItems } from "@/lib/admin/store";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [items, eras] = await Promise.all([readItems(), readEras()]);
  const item = items.find((i) => i.id === id);

  if (!item) notFound();

  return <ItemForm eras={eras} initial={item} items={items} />;
}
