/**
 * Pure catalog search/filter/sort logic and its URL representation.
 * Kept free of React so it can be unit-tested and reused anywhere.
 */
import { parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs/server";

import { getEra } from "./data";
import type { MerchItem } from "./types";

export const SORT_OPTIONS = {
  added: "Recently added",
  release: "Release date",
  az: "Name A–Z",
  za: "Name Z–A",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;
export type CatalogView = "grid" | "list";

export type CatalogFilters = {
  query: string;
  types: string[];
  eras: string[];
  sources: string[];
  sort: SortKey;
  view: CatalogView;
};

const list = parseAsArrayOf(parseAsString).withDefault([]);

/**
 * URL representation of the filters, e.g. `?era=walls&type=Vinyl,CD`.
 * Values equal to their default are left out of the URL.
 */
export const catalogFilterParsers = {
  query: parseAsString.withDefault(""),
  types: list,
  eras: list,
  sources: list,
  sort: parseAsStringLiteral(Object.keys(SORT_OPTIONS) as SortKey[]).withDefault("added"),
  view: parseAsStringLiteral(["grid", "list"] as const).withDefault("grid"),
};

export const catalogFilterUrlKeys = {
  query: "q",
  types: "type",
  eras: "era",
  sources: "source",
} as const;

export function hasActiveFilters(filters: CatalogFilters) {
  return Boolean(
    filters.query || filters.types.length || filters.eras.length || filters.sources.length,
  );
}

/** Every word of the query must appear somewhere in the item's text. */
function matchesQuery(item: MerchItem, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (!words.length) return true;

  const haystack = [
    item.name,
    item.description,
    item.type,
    getEra(item.era)?.name,
    item.edition,
    item.source,
    item.region,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return words.every((word) => haystack.includes(word));
}

const comparators: Record<SortKey, (a: MerchItem, b: MerchItem) => number> = {
  added: (a, b) => b.addedAt.localeCompare(a.addedAt),
  release: (a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""),
  az: (a, b) => a.name.localeCompare(b.name),
  za: (a, b) => b.name.localeCompare(a.name),
};

export function applyFilters(list: readonly MerchItem[], filters: CatalogFilters): MerchItem[] {
  return list
    .filter(
      (item) =>
        (!filters.types.length || filters.types.includes(item.type)) &&
        (!filters.eras.length || filters.eras.includes(item.era)) &&
        (!filters.sources.length ||
          (item.source !== undefined && filters.sources.includes(item.source))) &&
        matchesQuery(item, filters.query),
    )
    .sort(comparators[filters.sort]);
}
