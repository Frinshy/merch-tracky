import { notFound } from "next/navigation";

import { isDev } from "@/lib/dev-store";

// Admin pages read the JSON files from disk on every request.
export const dynamic = "force-dynamic";

export const metadata = { title: "Admin", robots: { index: false } };

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (!isDev()) notFound();

  return <div className="pt-8">{children}</div>;
}
