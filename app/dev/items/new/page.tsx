import { ItemForm } from "@/components/admin/item-form";
import { readEras, readItems } from "@/lib/admin/store";

export default async function NewItemPage() {
  const [items, eras] = await Promise.all([readItems(), readEras()]);

  return <ItemForm eras={eras} items={items} />;
}
