export type MerchImage = {
  src: string;
  alt: string;
  /** Photo credit. */
  author?: string;
};

export type MerchItem = {
  /** URL slug, unique across all items. */
  id: string;
  name: string;
  description: string;
  /** Format of the item, e.g. "Vinyl", "CD", "Apparel". */
  type: string;
  /** Slug of the era this item belongs to (see data/eras.json). */
  era: string;
  /** When the item was released: "YYYY", "YYYY-MM" or "YYYY-MM-DD". */
  releaseDate?: string;
  /** When the item was added to the archive: "YYYY-MM-DD". */
  addedAt: string;
  /** Where it was sold, e.g. "Official webstore", "Tour". */
  source?: string;
  /** Variant or edition, e.g. "Signed", "Red vinyl". */
  edition?: string;
  region?: string;
  /** Original price as printed, e.g. "£25". */
  price?: string;
  limited?: boolean;
  tags?: string[];
  /** Ordered photos. The first one is the cover. */
  images: MerchImage[];
};

export type Era = {
  /** URL slug. Never changes once created so item references stay valid. */
  slug: string;
  name: string;
  year: number;
  /** Accent colour used for this era across the site (hex). */
  color: string;
  description?: string;
  /** Optional cover image path. */
  cover?: string;
};
