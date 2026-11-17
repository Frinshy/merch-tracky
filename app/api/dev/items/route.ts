import { NextResponse } from "next/server";

import { isDev, parseItemForm, readItems, writeItems } from "@/lib/dev-store";

/** Create an item. Development only. */
export async function POST(request: Request) {
  if (!isDev()) {
    return NextResponse.json({ error: "Not available." }, { status: 403 });
  }

  try {
    const items = await readItems();
    const { item, error } = await parseItemForm(
      await request.formData(),
      items.map((i) => i.id),
    );

    if (error) return NextResponse.json({ error }, { status: 400 });

    await writeItems([...items, item]);

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save." },
      { status: 500 },
    );
  }
}
