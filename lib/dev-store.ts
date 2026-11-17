/**
 * Local-only data store used by the /dev admin tools.
 * Reads and writes the JSON files in /data and images in /public/items.
 * Nothing here runs in production: every entry point calls `isDev()` first.
 */
import fs from "fs/promises";
import path from "path";

import type { Era, MerchImage, MerchItem } from "@/lib/catalog";
import { slugify } from "@/lib/catalog";

const ITEMS_FILE = path.join(process.cwd(), "data", "merch-items.json");
const ERAS_FILE = path.join(process.cwd(), "data", "eras.json");
const IMAGES_DIR = path.join(process.cwd(), "public", "items");

export const isDev = () => process.env.NODE_ENV === "development";

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Write to a temp file first so a crash never leaves half-written JSON. */
async function writeJson(file: string, data: unknown) {
  const tmp = `${file}.tmp`;

  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
}

export async function readItems(): Promise<MerchItem[]> {
  return (await readJson<{ items: MerchItem[] }>(ITEMS_FILE, { items: [] }))
    .items;
}

export async function writeItems(items: MerchItem[]) {
  await writeJson(ITEMS_FILE, { items });
}

export async function readEras(): Promise<Era[]> {
  return (await readJson<{ eras: Era[] }>(ERAS_FILE, { eras: [] })).eras;
}

export async function writeEras(eras: Era[]) {
  await writeJson(ERAS_FILE, { eras });
}

/**
 * Saves an uploaded image. If sharp is available (it ships with Next.js),
 * the image is resized to max 2000px and converted to WebP to keep the repo small.
 */
export async function saveImage(file: File, baseName: string): Promise<string> {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const input = new Uint8Array(await file.arrayBuffer());
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = `${slugify(baseName) || "item"}-${stamp}`;

  try {
    const sharp = (await import("sharp")).default;
    const output = await sharp(input)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    await fs.writeFile(
      path.join(IMAGES_DIR, `${name}.webp`),
      new Uint8Array(output),
    );

    return `/items/${name}.webp`;
  } catch {
    const ext = path.extname(file.name).toLowerCase() || ".jpg";

    await fs.writeFile(path.join(IMAGES_DIR, `${name}${ext}`), input);

    return `/items/${name}${ext}`;
  }
}

/** Deletes image files that are no longer referenced by any item. */
export async function deleteUnusedImages(
  candidates: string[],
  items: MerchItem[],
) {
  const used = new Set(items.flatMap((item) => item.images.map((i) => i.src)));

  for (const src of Array.from(new Set(candidates))) {
    if (used.has(src) || !src.startsWith("/items/")) continue;
    const file = path.join(IMAGES_DIR, path.basename(src));

    await fs.rm(file, { force: true });
  }
}

export type ImageEntry =
  | ({ kind: "existing" } & MerchImage)
  | { kind: "new"; file: number; alt: string; author?: string };

/**
 * Parses the multipart body sent by the admin item form into an item.
 * `item` is JSON with the item fields, `images` is JSON with the ordered
 * image list, and `files` are the newly uploaded files referenced by index.
 */
export async function parseItemForm(
  form: FormData,
  /** IDs that are already used by other items. */
  takenIds: string[] = [],
): Promise<{ item: MerchItem; error?: string }> {
  const fields = JSON.parse(String(form.get("item") ?? "{}")) as Partial<MerchItem>;
  const entries = JSON.parse(String(form.get("images") ?? "[]")) as ImageEntry[];
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  const name = fields.name?.trim() ?? "";
  const id = slugify(fields.id?.trim() || name);

  const error = !name
    ? "Name is required."
    : !id
      ? "Could not create an ID from the name."
      : !fields.type?.trim()
        ? "Type is required."
        : !fields.era?.trim()
          ? "Era is required."
          : takenIds.includes(id)
            ? `An item with the ID "${id}" already exists.`
            : undefined;

  // Don't write any files if the form is invalid.
  if (error) return { item: fields as MerchItem, error };

  const images: MerchImage[] = [];

  for (const entry of entries) {
    const author = entry.author?.trim() || undefined;

    if (entry.kind === "existing") {
      images.push({ src: entry.src, alt: entry.alt || name, author });
    } else {
      const file = files[entry.file];

      if (file && file.size > 0) {
        images.push({ src: await saveImage(file, id), alt: entry.alt || name, author });
      }
    }
  }

  const clean = (value?: string) => value?.trim() || undefined;

  const item: MerchItem = {
    id,
    name,
    description: fields.description?.trim() ?? "",
    type: fields.type?.trim() ?? "",
    era: fields.era?.trim() ?? "",
    releaseDate: clean(fields.releaseDate),
    addedAt: clean(fields.addedAt) ?? new Date().toISOString().slice(0, 10),
    source: clean(fields.source),
    edition: clean(fields.edition),
    region: clean(fields.region),
    price: clean(fields.price),
    limited: fields.limited || undefined,
    tags: fields.tags?.map((t) => t.trim()).filter(Boolean),
    images,
  };

  if (!item.tags?.length) delete item.tags;
  // Drop undefined keys so the JSON stays tidy.
  for (const key of Object.keys(item) as (keyof MerchItem)[]) {
    if (item[key] === undefined) delete item[key];
  }

  return { item };
}
