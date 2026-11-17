/**
 * Read-only access to the archive data. The JSON files are bundled at build
 * time, so every public page can be statically generated.
 */

import erasData from "@/data/eras.json";
import itemsData from "@/data/merch-items.json";

import type { Era, MerchImage, MerchItem } from "./types";

export const ARTIST = "Louis Tomlinson";

/** Preferred display order for formats. Unknown formats are sorted after these. */
export const TYPE_ORDER = [
  "Vinyl",
  "CD",
  "Cassette",
  "Apparel",
  "Accessory",
  "Poster",
  "Book",
  "Other",
];

export const PLACEHOLDER_IMAGE: MerchImage = { src: "/items/test.jpeg", alt: "" };

/** All eras, oldest first. */
export const eras: readonly Era[] = [...(erasData.eras as Era[])].sort((a, b) => a.year - b.year);

export const items: readonly MerchItem[] = itemsData.items as MerchItem[];

/** The most recent era, highlighted as "current". */
export const currentEra: Era | undefined = eras[eras.length - 1];

export function getEra(slug: string): Era | undefined {
  return eras.find((era) => era.slug === slug);
}

export function getItem(id: string): MerchItem | undefined {
  return items.find((item) => item.id === id);
}

export function itemsInEra(slug: string): MerchItem[] {
  return items.filter((item) => item.era === slug);
}

export function newestFirst(list: readonly MerchItem[]): MerchItem[] {
  return [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

export function coverOf(item: MerchItem): MerchImage {
  return item.images[0] ?? { ...PLACEHOLDER_IMAGE, alt: item.name };
}

export function sortTypes(types: Iterable<string>): string[] {
  return Array.from(new Set(types)).sort((a, b) => {
    const ia = TYPE_ORDER.indexOf(a);
    const ib = TYPE_ORDER.indexOf(b);

    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;

    return ia - ib;
  });
}

export const allTypes = sortTypes(items.map((item) => item.type));

export const allSources = Array.from(
  new Set(items.flatMap((item) => (item.source ? [item.source] : []))),
).sort();

export function countByType(list: readonly MerchItem[]) {
  return sortTypes(list.map((i) => i.type)).map((type) => ({
    type,
    count: list.filter((i) => i.type === type).length,
  }));
}

/** Item count, per-format counts and a few distinct photos for an era. */
export function eraStats(slug: string) {
  const list = newestFirst(itemsInEra(slug));
  const photos = Array.from(
    new Set(list.flatMap((i) => (i.images[0] ? [i.images[0].src] : []))),
  ).slice(0, 4);

  return { count: list.length, formats: countByType(list), photos };
}

/** Previous and next entry around `index` in a list. */
export function neighbours<T>(list: readonly T[], index: number) {
  return { prev: list[index - 1], next: list[index + 1] };
}
