/**
 * Pure catalog search/filter/sort logic and its URL representation.
 * Kept free of React so it can be unit-tested and reused anywhere.
 */
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

export const DEFAULT_FILTERS: CatalogFilters = {
  query: "",
  types: [],
  eras: [],
  sources: [],
  sort: "added",
  view: "grid",
};

const isSortKey = (value: string | null): value is SortKey =>
  value !== null && value in SORT_OPTIONS;

const splitList = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);

/** Reads filters from URL search params, e.g. `?era=walls&type=Vinyl,CD`. */
export function parseFilters(params: URLSearchParams): CatalogFilters {
  const sort = params.get("sort");

  return {
    query: params.get("q") ?? "",
    types: splitList(params.get("type")),
    eras: splitList(params.get("era")),
    sources: splitList(params.get("source")),
    sort: isSortKey(sort) ? sort : DEFAULT_FILTERS.sort,
    view: params.get("view") === "list" ? "list" : "grid",
  };
}

/** Inverse of `parseFilters`. Defaults are omitted to keep URLs short. */
export function serializeFilters(filters: CatalogFilters): string {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.types.length) params.set("type", filters.types.join(","));
  if (filters.eras.length) params.set("era", filters.eras.join(","));
  if (filters.sources.length) params.set("source", filters.sources.join(","));
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.view !== DEFAULT_FILTERS.view) params.set("view", filters.view);

  return params.toString();
}

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
