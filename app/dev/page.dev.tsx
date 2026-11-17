import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { readEras, readItems } from "@/lib/admin/store";

export default async function AdminPage() {
  const [items, eras] = await Promise.all([readItems(), readEras()]);

  return <AdminDashboard eras={eras} items={items} />;
}
