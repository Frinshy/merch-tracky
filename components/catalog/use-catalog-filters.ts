"use client";

import { useSearchParams } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";

import { catalogFilterParsers, catalogFilterUrlKeys } from "@/lib/catalog/filters";

/**
 * Catalog filter state, stored in the URL so filtered views can be shared,
 * survive reloads, and reset when a plain `/items` link is followed.
 *
 * nuqs updates React state immediately (keeps typing in the search box
 * snappy) and writes the URL shallowly in the background.
 */
export function useCatalogFilters() {
  const [filters, update] = useQueryStates(catalogFilterParsers, {
    urlKeys: catalogFilterUrlKeys,
  });

  const clear = useCallback(
    () => update({ query: null, types: null, eras: null, sources: null }),
    [update],
  );

  return { filters, update, clear, autoFocus: useSearchParams().get("focus") === "1" };
}
