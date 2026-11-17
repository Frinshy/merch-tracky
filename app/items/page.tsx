import type { Metadata } from "next";
import { Suspense } from "react";

import { Catalog } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Search and filter every archived Louis Tomlinson merch item.",
};

export default function ItemsPage() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  );
}
