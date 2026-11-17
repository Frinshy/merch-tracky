"use client";

import { Button } from "@heroui/react";
import { useMemo } from "react";

import { ItemGrid } from "@/components/items/item-grid";
import { ItemList } from "@/components/items/item-list";
import { EmptyMessage } from "@/components/ui/empty-message";
import { items } from "@/lib/catalog/data";
import { applyFilters, hasActiveFilters } from "@/lib/catalog/filters";

import { CatalogToolbar } from "./catalog-toolbar";
import { useCatalogFilters } from "./use-catalog-filters";

export function Catalog() {
  const { filters, update, clear, autoFocus } = useCatalogFilters();
  const results = useMemo(() => applyFilters(items, filters), [filters]);
  const filtered = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      <CatalogToolbar autoFocus={autoFocus} filters={filters} onChange={update} />

      <div className="flex min-h-8 items-center justify-between text-sm text-muted">
        <p aria-live="polite">
          {filtered ? `${results.length} of ${items.length} items` : `${items.length} items`}
        </p>
        {filtered && (
          <Button size="sm" variant="ghost" onPress={clear}>
            Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyMessage
          action={
            <Button variant="secondary" onPress={clear}>
              Clear filters
            </Button>
          }
          description="Try a different search or remove some filters."
          title="Nothing found"
        />
      ) : filters.view === "list" ? (
        <ItemList items={results} />
      ) : (
        <ItemGrid items={results} preloadCount={5} />
      )}
    </div>
  );
}
