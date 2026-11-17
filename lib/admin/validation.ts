/**
 * Normalises and validates admin input. Pure functions: no file system,
 * so they are safe to share and easy to test.
 */
import { RELEASE_DATE_PATTERN, slugify, today } from "@/lib/catalog/format";

import type { EraInput, ImageEntry, ItemInput } from "./types";

export type ValidationResult<T> = { value: T; error?: never } | { value?: never; error: string };

const clean = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

/** Removes keys whose value is undefined so the JSON files stay tidy. */
function compact<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

export function validateItemInput(
  raw: Partial<ItemInput>,
  options: { takenIds: string[]; eraSlugs: string[] },
): ValidationResult<ItemInput> {
  const name = clean(raw.name);
  const id = slugify(clean(raw.id) ?? name ?? "");
  const type = clean(raw.type);
  const era = clean(raw.era);
  const releaseDate = clean(raw.releaseDate);
  const tags = (raw.tags ?? []).map((t) => t.trim()).filter(Boolean);

  if (!name) return { error: "Name is required." };
  if (!id) return { error: "Could not create an ID from the name." };
  if (options.takenIds.includes(id)) return { error: `The ID "${id}" is already in use.` };
  if (!type) return { error: "Type is required." };
  if (!era || !options.eraSlugs.includes(era)) return { error: "Choose a valid era." };
  if (releaseDate && !RELEASE_DATE_PATTERN.test(releaseDate)) {
    return { error: "Release date must look like YYYY, YYYY-MM or YYYY-MM-DD." };
  }

  return {
    value: compact({
      id,
      name,
      description: clean(raw.description) ?? "",
      type,
      era,
      releaseDate,
      addedAt: clean(raw.addedAt) ?? today(),
      source: clean(raw.source),
      edition: clean(raw.edition),
      region: clean(raw.region),
      price: clean(raw.price),
      limited: raw.limited ? true : undefined,
      tags: tags.length ? tags : undefined,
    }),
  };
}

export function validateImageEntries(raw: unknown): ValidationResult<ImageEntry[]> {
  if (!Array.isArray(raw)) return { error: "Invalid image list." };
  const valid = raw.every(
    (entry) =>
      (entry?.kind === "existing" && typeof entry.src === "string") ||
      (entry?.kind === "new" && Number.isInteger(entry.file)),
  );

  return valid ? { value: raw as ImageEntry[] } : { error: "Invalid image list." };
}

export function validateEraInput(raw: Partial<EraInput>): ValidationResult<EraInput> {
  const name = clean(raw.name);
  const year = Number(raw.year);
  const color = clean(raw.color) ?? "#888888";

  if (!name) return { error: "Name is required." };
  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    return { error: "Enter a valid year." };
  }
  if (!/^#[0-9a-f]{6}$/i.test(color)) return { error: "Colour must be a hex value." };

  return {
    value: compact({
      name,
      year,
      color,
      description: clean(raw.description),
      cover: clean(raw.cover),
      originalSlug: clean(raw.originalSlug),
    }),
  };
}
