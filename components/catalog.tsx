"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { SearchIcon } from "@/components/icons";
import { ItemGrid } from "@/components/item-card";
import { EraBadge } from "@/components/era-badge";
import {
  allSources,
  allTypes,
  coverOf,
  eras,
  formatDate,
  getEra,
  items,
  type MerchItem,
} from "@/lib/catalog";

const SORTS = {
  added: "Recently added",
  release: "Release date",
  az: "Name A–Z",
  za: "Name Z–A",
} as const;

type SortKey = keyof typeof SORTS;
type View = "grid" | "list";

const list = (value: string | null) =>
  value ? value.split(",").filter(Boolean) : [];

function matches(item: MerchItem, query: string) {
  if (!query) return true;
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

  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

function sortItems(list: MerchItem[], sort: SortKey) {
  const sorted = [...list];

  switch (sort) {
    case "az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "release":
      return sorted.sort((a, b) =>
        (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""),
      );
    default:
      return sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }
}

export function Catalog() {
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [types, setTypes] = useState<string[]>(list(params.get("type")));
  const [eraSlugs, setEraSlugs] = useState<string[]>(list(params.get("era")));
  const [sources, setSources] = useState<string[]>(list(params.get("source")));
  const [sort, setSort] = useState<SortKey>(
    (params.get("sort") as SortKey) in SORTS
      ? (params.get("sort") as SortKey)
      : "added",
  );
  const [view, setView] = useState<View>(
    params.get("view") === "list" ? "list" : "grid",
  );

  // Keep the URL in sync so filtered views can be shared and survive reloads.
  useEffect(() => {
    const next = new URLSearchParams();

    if (query) next.set("q", query);
    if (types.length) next.set("type", types.join(","));
    if (eraSlugs.length) next.set("era", eraSlugs.join(","));
    if (sources.length) next.set("source", sources.join(","));
    if (sort !== "added") next.set("sort", sort);
    if (view !== "grid") next.set("view", view);
    const search = next.toString();

    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  }, [query, types, eraSlugs, sources, sort, view]);

  const results = useMemo(
    () =>
      sortItems(
        items.filter(
          (item) =>
            (!types.length || types.includes(item.type)) &&
            (!eraSlugs.length || eraSlugs.includes(item.era)) &&
            (!sources.length ||
              (item.source && sources.includes(item.source))) &&
            matches(item, query.trim()),
        ),
        sort,
      ),
    [query, types, eraSlugs, sources, sort],
  );

  const hasFilters =
    query || types.length || eraSlugs.length || sources.length;

  const clearAll = () => {
    setQuery("");
    setTypes([]);
    setEraSlugs([]);
    setSources([]);
  };

  return (
    <div className="flex flex-col gap-6 pt-8">
      <header className="flex flex-col gap-1">
        <p className="label-caps text-muted">The catalog</p>
        <h1 className="font-display text-5xl sm:text-6xl">All merch</h1>
      </header>

      {/* Toolbar */}
      <div className="sticky top-14 z-30 -mx-4 flex flex-col gap-3 border-b border-separator bg-background/90 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-md border border-separator bg-surface px-3 focus-within:border-foreground/40">
            <SearchIcon className="size-4 shrink-0 text-muted" />
            <label className="sr-only" htmlFor="catalog-search">
              Search
            </label>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={params.get("focus") === "1"}
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted"
              id="catalog-search"
              placeholder="Search name, edition, tags…"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <label className="sr-only" htmlFor="catalog-sort">
            Sort by
          </label>
          <select
            className="h-11 rounded-md border border-separator bg-surface px-2 text-sm outline-none focus:border-foreground/40"
            id="catalog-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            {Object.entries(SORTS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <div
            aria-label="View"
            className="hidden h-11 rounded-md border border-separator bg-surface p-1 sm:flex"
            role="group"
          >
            {(["grid", "list"] as const).map((v) => (
              <button
                aria-pressed={view === v}
                className={clsx(
                  "rounded px-3 text-sm capitalize transition",
                  view === v
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground",
                )}
                key={v}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {eras.map((era) => (
            <Chip
              active={eraSlugs.includes(era.slug)}
              key={era.slug}
              onClick={() => setEraSlugs(toggle(eraSlugs, era.slug))}
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: era.color }}
              />
              {era.name}
            </Chip>
          ))}
          <span aria-hidden="true" className="mx-1 w-px shrink-0 bg-separator" />
          {allTypes.map((type) => (
            <Chip
              active={types.includes(type)}
              key={type}
              onClick={() => setTypes(toggle(types, type))}
            >
              {type}
            </Chip>
          ))}
          {allSources.length > 0 && (
            <span aria-hidden="true" className="mx-1 w-px shrink-0 bg-separator" />
          )}
          {allSources.map((source) => (
            <Chip
              active={sources.includes(source)}
              key={source}
              onClick={() => setSources(toggle(sources, source))}
            >
              {source}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted">
        <p aria-live="polite">
          {results.length === items.length
            ? `${items.length} items`
            : `${results.length} of ${items.length} items`}
        </p>
        {hasFilters ? (
          <button className="hover:text-foreground" onClick={clearAll}>
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="font-display text-3xl">Nothing found</p>
          <p className="text-muted">
            Try a different search or remove some filters.
          </p>
          <button
            className="mt-2 rounded-md border border-separator px-4 py-2 text-sm hover:border-foreground/40"
            onClick={clearAll}
          >
            Clear filters
          </button>
        </div>
      ) : view === "grid" ? (
        <ItemGrid items={results} />
      ) : (
        <ItemList items={results} />
      )}
    </div>
  );
}

function toggle(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-pressed={active}
      className={clsx(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm transition",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-separator text-muted hover:border-foreground/40 hover:text-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ItemList({ items }: { items: MerchItem[] }) {
  return (
    <ul className="divide-y divide-separator border-y border-separator">
      {items.map((item) => {
        const cover = coverOf(item);

        return (
          <li className="group relative flex items-center gap-4 py-3" key={item.id}>
            <div className="relative size-14 shrink-0 overflow-hidden rounded bg-surface-secondary">
              <Image
                alt=""
                className="object-contain p-1"
                fill
                sizes="56px"
                src={cover.src}
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                className="font-medium after:absolute after:inset-0 after:content-[''] group-hover:underline"
                href={`/items/${item.id}`}
              >
                {item.name}
              </Link>
              {item.edition && (
                <span className="ml-2 text-sm text-muted">{item.edition}</span>
              )}
            </div>
            <span className="hidden w-28 text-sm text-muted md:block">
              {item.type}
            </span>
            <span className="hidden w-48 text-sm text-muted md:block">
              <EraBadge plain slug={item.era} />
            </span>
            <span className="hidden w-28 text-right text-sm text-muted lg:block">
              {formatDate(item.releaseDate) ?? "—"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
