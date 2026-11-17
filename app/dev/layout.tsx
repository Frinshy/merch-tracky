import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isAdminEnabled } from "@/lib/admin/guard";

// Admin pages read the data files from disk on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminEnabled()) notFound();

  return <div className="pt-8">{children}</div>;
}
