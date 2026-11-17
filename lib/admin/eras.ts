import "server-only";

import { slugify } from "@/lib/catalog/format";
import type { Era } from "@/lib/catalog/types";

import { fail } from "./guard";
import { deleteUnusedImages, saveImage } from "./images";
import { readEras, readItems, writeEras } from "./store";
import type { EraInput } from "./types";
import { FORM_FIELDS } from "./types";
import { validateEraInput } from "./validation";

/**
 * Creates or updates an era from a multipart body (`era` JSON + optional
 * `coverFile`). The slug never changes on update so item references stay valid.
 */
export async function saveEra(form: FormData): Promise<Era> {
  let raw: Partial<EraInput>;

  try {
    raw = JSON.parse(String(form.get(FORM_FIELDS.era) ?? "{}"));
  } catch {
    return fail(400, "Invalid era data.");
  }

  const input = validateEraInput(raw);

  if (input.error !== undefined) return fail(400, input.error);

  const { originalSlug, ...fields } = input.value;
  const eras = await readEras();
  const existing = originalSlug
    ? (eras.find((e) => e.slug === originalSlug) ?? fail(404, "Era not found."))
    : undefined;
  const slug = existing?.slug ?? slugify(fields.name);

  if (!existing && eras.some((e) => e.slug === slug)) {
    fail(409, `An era with the slug "${slug}" already exists.`);
  }

  const coverFile = form.get(FORM_FIELDS.coverFile);
  const cover =
    coverFile instanceof File && coverFile.size > 0
      ? await saveImage(coverFile, `era-${slug}`)
      : fields.cover;

  const era: Era = { slug, ...fields, cover };

  if (!cover) delete era.cover;

  await writeEras(existing ? eras.map((e) => (e.slug === slug ? era : e)) : [...eras, era]);

  if (existing?.cover !== era.cover) await deleteUnusedImages([existing?.cover]);

  return era;
}

/** Deletes an era. Refuses while items still belong to it. */
export async function deleteEra(slug: string): Promise<{ slug: string }> {
  const [eras, items] = await Promise.all([readEras(), readItems()]);
  const era = eras.find((e) => e.slug === slug) ?? fail(404, "Era not found.");
  const used = items.filter((i) => i.era === slug).length;

  if (used) fail(409, `${used} item(s) still belong to this era. Move them first.`);

  await writeEras(eras.filter((e) => e.slug !== slug));
  await deleteUnusedImages([era.cover]);

  return { slug };
}
