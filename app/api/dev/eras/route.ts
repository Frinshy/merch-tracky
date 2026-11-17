import { NextResponse } from "next/server";

import type { Era } from "@/lib/catalog";
import { slugify } from "@/lib/catalog";
import {
  deleteUnusedImages,
  isDev,
  readEras,
  readItems,
  saveImage,
  writeEras,
} from "@/lib/dev-store";

const forbidden = () =>
  NextResponse.json({ error: "Not available." }, { status: 403 });

/**
 * Create or update an era. Multipart body:
 * - `era`: JSON `{ ...era, originalSlug? }`
 * - `coverFile` (optional): a new cover image, replaces `era.cover`
 * The slug is kept stable on update so item references don't break.
 */
export async function POST(request: Request) {
  if (!isDev()) return forbidden();

  const form = await request.formData();
  const body = JSON.parse(String(form.get("era") ?? "{}")) as Partial<Era> & {
    originalSlug?: string;
  };
  const coverFile = form.get("coverFile");
  const eras = await readEras();
  const name = body.name?.trim();
  const year = Number(body.year);

  if (!name || !Number.isFinite(year)) {
    return NextResponse.json(
      { error: "Name and year are required." },
      { status: 400 },
    );
  }

  const existing = body.originalSlug
    ? eras.find((e) => e.slug === body.originalSlug)
    : undefined;
  const slug = existing?.slug ?? slugify(body.slug || name);

  if (!existing && eras.some((e) => e.slug === slug)) {
    return NextResponse.json(
      { error: `An era with the slug "${slug}" already exists.` },
      { status: 409 },
    );
  }

  const cover =
    coverFile instanceof File && coverFile.size > 0
      ? await saveImage(coverFile, `era-${slug}`)
      : body.cover?.trim();

  const era: Era = {
    slug,
    name,
    year,
    color: body.color || "#888888",
    ...(body.description?.trim() && { description: body.description.trim() }),
    ...(cover && { cover }),
  };

  await writeEras(
    existing ? eras.map((e) => (e.slug === slug ? era : e)) : [...eras, era],
  );

  // Remove the previous cover file if nothing uses it anymore.
  if (existing?.cover && existing.cover !== era.cover) {
    await deleteUnusedImages([existing.cover], await readItems());
  }

  return NextResponse.json({ era });
}

/** Delete an era. Refuses while items still reference it. */
export async function DELETE(request: Request) {
  if (!isDev()) return forbidden();

  const slug = new URL(request.url).searchParams.get("slug");
  const items = await readItems();
  const used = items.filter((i) => i.era === slug).length;

  if (used) {
    return NextResponse.json(
      { error: `${used} item(s) still use this era. Move them first.` },
      { status: 409 },
    );
  }

  const eras = await readEras();
  const removed = eras.find((e) => e.slug === slug);

  await writeEras(eras.filter((e) => e.slug !== slug));
  if (removed?.cover) await deleteUnusedImages([removed.cover], items);

  return NextResponse.json({ ok: true });
}
