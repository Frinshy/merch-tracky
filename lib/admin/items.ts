import "server-only";

import type { MerchImage, MerchItem } from "@/lib/catalog/types";

import { fail } from "./guard";
import { deleteUnusedImages, saveImage } from "./images";
import { readEras, readItems, writeItems } from "./store";
import type { ItemInput } from "./types";
import { FORM_FIELDS } from "./types";
import { validateImageEntries, validateItemInput } from "./validation";

function parseJsonField(form: FormData, field: string): unknown {
  try {
    return JSON.parse(String(form.get(field) ?? "null"));
  } catch {
    return fail(400, `Invalid "${field}" field.`);
  }
}

/** Validates the multipart body and stores any new photos. */
async function itemFromForm(form: FormData, takenIds: string[]): Promise<MerchItem> {
  const eraSlugs = (await readEras()).map((era) => era.slug);
  const fields = validateItemInput(
    (parseJsonField(form, FORM_FIELDS.item) ?? {}) as Partial<ItemInput>,
    { takenIds, eraSlugs },
  );

  if (fields.error !== undefined) return fail(400, fields.error);

  const entries = validateImageEntries(parseJsonField(form, FORM_FIELDS.images) ?? []);

  if (entries.error !== undefined) return fail(400, entries.error);

  // Validation passed: only now write files, so a rejected form leaves no orphans.
  const files = form.getAll(FORM_FIELDS.files).filter((f): f is File => f instanceof File);
  const item = fields.value;
  const images: MerchImage[] = [];

  for (const entry of entries.value) {
    const alt = entry.alt?.trim() || item.name;
    const author = entry.author?.trim() || undefined;

    if (entry.kind === "existing") {
      images.push({ src: entry.src, alt, ...(author && { author }) });
      continue;
    }

    const file = files[entry.file];

    if (file && file.size > 0) {
      images.push({ src: await saveImage(file, item.id), alt, ...(author && { author }) });
    }
  }

  return { ...item, images };
}

export async function createItem(form: FormData): Promise<MerchItem> {
  const items = await readItems();
  const item = await itemFromForm(
    form,
    items.map((i) => i.id),
  );

  await writeItems([...items, item]);

  return item;
}

/** Updates an item. Its ID may change; removed photos are deleted. */
export async function updateItem(id: string, form: FormData): Promise<MerchItem> {
  const items = await readItems();
  const previous = items.find((i) => i.id === id) ?? fail(404, "Item not found.");
  const item = await itemFromForm(
    form,
    items.filter((i) => i.id !== id).map((i) => i.id),
  );

  await writeItems(items.map((i) => (i.id === id ? item : i)));
  await deleteUnusedImages(previous.images.map((i) => i.src));

  return item;
}

export async function deleteItem(id: string): Promise<{ id: string }> {
  const items = await readItems();
  const item = items.find((i) => i.id === id) ?? fail(404, "Item not found.");

  await writeItems(items.filter((i) => i.id !== id));
  await deleteUnusedImages(item.images.map((i) => i.src));

  return { id };
}
