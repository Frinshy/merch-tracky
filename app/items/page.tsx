import type { Metadata } from "next";
import { Suspense } from "react";

import { Catalog } from "@/components/catalog/catalog";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Search and filter every archived Louis Tomlinson merch item.",
};

export default function CatalogPage() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <PageHeader eyebrow="The catalog" title="All merch" />
      {/* The catalog reads the URL (useSearchParams), so it renders on the client. */}
      <Suspense>
        <Catalog />
      </Suspense>
    </div>
  );
}
