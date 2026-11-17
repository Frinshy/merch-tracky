import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import type { Era, MerchItem } from "@/lib/catalog/types";

const DATA_DIR = path.join(process.cwd(), "data");
const ITEMS_FILE = path.join(DATA_DIR, "merch-items.json");
const ERAS_FILE = path.join(DATA_DIR, "eras.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Writes to a temp file first, so a crash never leaves half-written JSON. */
async function writeJson(file: string, data: unknown) {
  const tmp = `${file}.tmp`;

  await fs.writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(tmp, file);
}

/*
 * Reads always go to disk (not the bundled import) so the admin sees changes
 * immediately, even before Next.js re-bundles the JSON.
 */

export async function readItems(): Promise<MerchItem[]> {
  return (await readJson<{ items: MerchItem[] }>(ITEMS_FILE, { items: [] })).items;
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
