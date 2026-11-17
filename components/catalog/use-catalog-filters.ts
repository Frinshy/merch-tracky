"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  type CatalogFilters,
} from "@/lib/catalog/filters";

/**
 * Catalog filter state, initialised from and mirrored to the URL so
 * filtered views can be shared and survive reloads.
 *
 * `history.replaceState` (rather than router.replace) keeps typing in the
 * search box instant; Next.js still picks the change up in useSearchParams.
 */
export function useCatalogFilters() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<CatalogFilters>(() =>
    parseFilters(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    const query = serializeFilters(filters);

    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [filters]);

  const update = useCallback(
    (patch: Partial<CatalogFilters>) => setFilters((prev) => ({ ...prev, ...patch })),
    [],
  );

  const clear = useCallback(
    () => setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort, view: prev.view })),
    [],
  );

  return { filters, update, clear, autoFocus: searchParams.get("focus") === "1" };
}
