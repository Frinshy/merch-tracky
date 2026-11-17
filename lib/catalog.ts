import erasData from "@/data/eras.json";
import itemsData from "@/data/merch-items.json";

export type MerchImage = {
  src: string;
  alt: string;
  author?: string;
};

export type MerchItem = {
  id: string;
  name: string;
  description: string;
  /** Format of the item, e.g. "Vinyl", "CD", "Apparel". */
  type: string;
  /** Slug of the era this item belongs to (see data/eras.json). */
  era: string;
  /** When the item was released. "YYYY", "YYYY-MM" or "YYYY-MM-DD". */
  releaseDate?: string;
  /** When the item was added to the archive. "YYYY-MM-DD". */
  addedAt: string;
  /** Where it was sold, e.g. "Official webstore", "Tour", "Retailer exclusive". */
  source?: string;
  /** Variant or edition, e.g. "Signed", "Red vinyl", "Deluxe". */
  edition?: string;
  region?: string;
  /** Original price as printed, e.g. "£25". */
  price?: string;
  limited?: boolean;
  tags?: string[];
  images: MerchImage[];
};

export type Era = {
  slug: string;
  name: string;
  year: number;
  /** Accent colour used for this era across the site. */
  color: string;
  description?: string;
  /** Optional cover image. Falls back to the first item image of the era. */
  cover?: string;
};

export const ARTIST = "Louis Tomlinson";

/** Preferred display order for formats. Unknown formats are appended alphabetically. */
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

export const PLACEHOLDER_IMAGE: MerchImage = {
  src: "/items/test.jpeg",
  alt: "",
};

export const eras: Era[] = [...(erasData.eras as Era[])].sort(
  (a, b) => a.year - b.year,
);

export const items: MerchItem[] = itemsData.items as MerchItem[];

export function getEra(slug: string): Era | undefined {
  return eras.find((era) => era.slug === slug);
}

export function getItem(id: string): MerchItem | undefined {
  return items.find((item) => item.id === id);
}

export function itemsInEra(slug: string): MerchItem[] {
  return items.filter((item) => item.era === slug);
}

export function coverOf(item: MerchItem): MerchImage {
  return item.images[0] ?? { ...PLACEHOLDER_IMAGE, alt: item.name };
}

export function eraCover(era: Era): string | undefined {
  return era.cover ?? itemsInEra(era.slug).find((i) => i.images[0])?.images[0].src;
}

/** Item count, per-format counts and a few distinct cover images for an era. */
export function eraStats(slug: string) {
  const list = newestFirst(itemsInEra(slug));
  const formats = sortTypes(list.map((i) => i.type)).map((type) => ({
    type,
    count: list.filter((i) => i.type === type).length,
  }));
  const covers = Array.from(
    new Set(list.map((i) => i.images[0]?.src).filter(Boolean) as string[]),
  ).slice(0, 4);

  return { count: list.length, formats, covers };
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
  new Set(items.map((item) => item.source).filter(Boolean) as string[]),
).sort();

export function newestFirst(list: MerchItem[]): MerchItem[] {
  return [...list].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats "YYYY", "YYYY-MM" or "YYYY-MM-DD" without timezone surprises. */
export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-");

  if (!month) return year;
  const monthName = MONTHS[Number(month) - 1] ?? month;

  if (!day) return `${monthName} ${year}`;

  return `${Number(day)} ${monthName} ${year}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
