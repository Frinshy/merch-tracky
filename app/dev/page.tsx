import { DevDashboard } from "@/components/dev/dashboard";
import { readEras, readItems } from "@/lib/dev-store";

export default async function DevPage() {
  const [items, eras] = await Promise.all([readItems(), readEras()]);

  return <DevDashboard eras={eras} items={items} />;
}
