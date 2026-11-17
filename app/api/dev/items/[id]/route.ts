import { NextResponse } from "next/server";

import {
  deleteUnusedImages,
  isDev,
  parseItemForm,
  readItems,
  writeItems,
} from "@/lib/dev-store";

type Context = { params: Promise<{ id: string }> };

const forbidden = () =>
  NextResponse.json({ error: "Not available." }, { status: 403 });

const failure = (error: unknown) =>
  NextResponse.json(
    { error: error instanceof Error ? error.message : "Failed to save." },
    { status: 500 },
  );

/** Update an item (the ID may change). Development only. */
export async function PUT(request: Request, { params }: Context) {
  if (!isDev()) return forbidden();

  try {
    const { id } = await params;
    const items = await readItems();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const { item, error } = await parseItemForm(
      await request.formData(),
      items.filter((i) => i.id !== id).map((i) => i.id),
    );

    if (error) return NextResponse.json({ error }, { status: 400 });

    const previous = items[index];
    const next = items.map((i, n) => (n === index ? item : i));

    await writeItems(next);
    await deleteUnusedImages(
      previous.images.map((i) => i.src),
      next,
    );

    return NextResponse.json({ item });
  } catch (error) {
    return failure(error);
  }
}

/** Delete an item and any images only it used. Development only. */
export async function DELETE(_request: Request, { params }: Context) {
  if (!isDev()) return forbidden();

  try {
    const { id } = await params;
    const items = await readItems();
    const item = items.find((i) => i.id === id);

    if (!item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const next = items.filter((i) => i.id !== id);

    await writeItems(next);
    await deleteUnusedImages(
      item.images.map((i) => i.src),
      next,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
