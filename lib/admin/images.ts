import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { slugify } from "@/lib/catalog/format";

import { readEras, readItems } from "./store";

const PUBLIC_DIR = "/items/";
const IMAGES_DIR = path.join(process.cwd(), "public", "items");
const MAX_SIZE = 2000;

/**
 * Saves an uploaded image to public/items and returns its public path.
 * With sharp (bundled with Next.js) the image is auto-rotated, limited to
 * 2000px and stored as WebP to keep the repository small.
 */
export async function saveImage(file: File, baseName: string): Promise<string> {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const input = new Uint8Array(await file.arrayBuffer());
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const name = `${slugify(baseName) || "image"}-${stamp}`;

  try {
    const sharp = (await import("sharp")).default;
    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    await fs.writeFile(path.join(IMAGES_DIR, `${name}.webp`), new Uint8Array(output));

    return `${PUBLIC_DIR}${name}.webp`;
  } catch {
    const ext = path.extname(file.name).toLowerCase() || ".jpg";

    await fs.writeFile(path.join(IMAGES_DIR, `${name}${ext}`), input);

    return `${PUBLIC_DIR}${name}${ext}`;
  }
}

/**
 * Deletes the given image files unless an item photo or era cover still
 * references them. Call after the data files have been written.
 */
export async function deleteUnusedImages(candidates: Iterable<string | undefined>) {
  const [items, eras] = await Promise.all([readItems(), readEras()]);
  const used = new Set<string>([
    ...items.flatMap((item) => item.images.map((image) => image.src)),
    ...eras.flatMap((era) => (era.cover ? [era.cover] : [])),
  ]);

  for (const src of new Set(candidates)) {
    if (!src || used.has(src) || !src.startsWith(PUBLIC_DIR)) continue;
    await fs.rm(path.join(IMAGES_DIR, path.basename(src)), { force: true });
  }
}
