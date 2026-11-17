import type { Metadata } from "next";
import { Suspense } from "react";

import { Catalog } from "@/components/catalog/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Search and filter every archived Louis Tomlinson merch item.",
};

export default function CatalogPage() {
  return (
    <div className="flex flex-col gap-6 pt-8">
      <header className="flex flex-col gap-1">
        <p className="label-caps text-muted">The catalog</p>
        <h1 className="font-display text-5xl sm:text-6xl">All merch</h1>
      </header>
      {/* The catalog reads the URL (useSearchParams), so it renders on the client. */}
      <Suspense>
        <Catalog />
      </Suspense>
    </div>
  );
}
