/** Payloads shared by the admin UI (client) and the /api/dev routes (server). */
import type { Era, MerchImage, MerchItem } from "@/lib/catalog/types";

/** Item fields as edited in the form (images are sent separately). */
export type ItemInput = Omit<MerchItem, "images">;

/**
 * One entry of the ordered photo list sent with an item.
 * `existing` keeps a photo already on disk, `new` refers to the uploaded
 * file at index `file` in the multipart body.
 */
export type ImageEntry =
  | ({ kind: "existing" } & MerchImage)
  | { kind: "new"; file: number; alt: string; author?: string };

export type EraInput = Omit<Era, "slug"> & {
  /** Slug of the era being edited. Omitted when creating a new era. */
  originalSlug?: string;
};

/** Every admin endpoint responds with either data or an error message. */
export type ApiResult<T> = { data: T; error?: never } | { data?: never; error: string };

/** Multipart field names. */
export const FORM_FIELDS = {
  item: "item",
  images: "images",
  files: "files",
  era: "era",
  coverFile: "coverFile",
} as const;
