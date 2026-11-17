import { NextResponse } from "next/server";

import type { Era } from "@/lib/catalog";
import { slugify } from "@/lib/catalog";
import { isDev, readEras, readItems, writeEras } from "@/lib/dev-store";

const forbidden = () =>
  NextResponse.json({ error: "Not available." }, { status: 403 });

/**
 * Create or update an era. Send `{ ...era, originalSlug? }`.
 * The slug is kept stable on update so item references don't break.
 */
export async function POST(request: Request) {
  if (!isDev()) return forbidden();

  const body = (await request.json()) as Partial<Era> & {
    originalSlug?: string;
  };
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

  const era: Era = {
    slug,
    name,
    year,
    color: body.color || "#888888",
    ...(body.description?.trim() && { description: body.description.trim() }),
    ...(body.cover?.trim() && { cover: body.cover.trim() }),
  };

  await writeEras(
    existing ? eras.map((e) => (e.slug === slug ? era : e)) : [...eras, era],
  );

  return NextResponse.json({ era });
}

/** Delete an era. Refuses while items still reference it. */
export async function DELETE(request: Request) {
  if (!isDev()) return forbidden();

  const slug = new URL(request.url).searchParams.get("slug");
  const used = (await readItems()).filter((i) => i.era === slug).length;

  if (used) {
    return NextResponse.json(
      { error: `${used} item(s) still use this era. Move them first.` },
      { status: 409 },
    );
  }

  await writeEras((await readEras()).filter((e) => e.slug !== slug));

  return NextResponse.json({ ok: true });
}
