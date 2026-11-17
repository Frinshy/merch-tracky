import { ItemForm } from "@/components/dev/item-form";
import { readEras, readItems } from "@/lib/dev-store";

export default async function NewItemPage() {
  const [items, eras] = await Promise.all([readItems(), readEras()]);

  return <ItemForm eras={eras} items={items} />;
}
