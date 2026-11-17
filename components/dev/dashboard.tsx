"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button, Field, inputClass, Notice } from "@/components/dev/ui";
import type { Era, MerchItem } from "@/lib/catalog";

export function DevDashboard({
  items,
  eras,
}: {
  items: MerchItem[];
  eras: Era[];
}) {
  const router = useRouter();
  const savedId = useSearchParams().get("saved");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const eraName = (slug: string) =>
    eras.find((e) => e.slug === slug)?.name ?? `⚠ ${slug}`;

  const visible = [...items]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .filter((item) =>
      `${item.name} ${item.id} ${item.type} ${eraName(item.era)}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

  async function remove(item: MerchItem) {
    if (!confirm(`Delete “${item.name}”? Its photos are removed too.`)) return;
    setError(null);
    const res = await fetch(`/api/dev/items/${item.id}`, { method: "DELETE" });

    if (!res.ok) setError((await res.json()).error ?? "Delete failed.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-muted">Local only · not deployed</p>
          <h1 className="font-display text-5xl">Admin</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Changes are written to <code>data/</code> and{" "}
            <code>public/items/</code>. Commit and push to publish them.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background hover:opacity-90"
          href="/dev/items/new"
        >
          + Add item
        </Link>
      </header>

      {savedId && (
        <Notice tone="success">
          Saved.{" "}
          <Link className="underline" href={`/items/${savedId}`}>
            View item
          </Link>
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl">Items ({items.length})</h2>
          <input
            aria-label="Filter items"
            className={`${inputClass} max-w-xs`}
            placeholder="Filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ul className="divide-y divide-separator border-y border-separator">
          {visible.map((item) => (
            <li className="flex items-center gap-4 py-2" key={item.id}>
              <div className="size-12 shrink-0 overflow-hidden rounded bg-surface-secondary">
                {item.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="size-full object-contain"
                    src={item.images[0].src}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="label-caps truncate text-muted">
                  {item.id} · {item.type} · {eraName(item.era)} ·{" "}
                  {item.images.length} photo{item.images.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className="hidden text-sm text-muted md:block">
                {item.addedAt}
              </span>
              <div className="flex shrink-0 gap-1">
                <Link
                  className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground"
                  href={`/items/${item.id}`}
                >
                  View
                </Link>
                <Link
                  className="rounded-md border border-separator px-3 py-1.5 text-sm hover:border-foreground/40"
                  href={`/dev/items/${item.id}`}
                >
                  Edit
                </Link>
                <Button
                  className="h-auto px-3 py-1.5"
                  variant="danger"
                  onClick={() => remove(item)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <EraEditor eras={eras} items={items} />
    </div>
  );
}

function EraEditor({ eras, items }: { eras: Era[]; items: MerchItem[] }) {
  return (
    <section className="flex flex-col gap-4" id="eras">
      <h2 className="font-display text-3xl">Eras ({eras.length})</h2>
      <p className="text-sm text-muted">
        Era slugs never change once created, so item links stay valid.
      </p>
      <div className="flex flex-col gap-3">
        {[...eras]
          .sort((a, b) => a.year - b.year)
          .map((era) => (
            <EraRow
              count={items.filter((i) => i.era === era.slug).length}
              era={era}
              key={era.slug}
            />
          ))}
        <EraRow />
      </div>
    </section>
  );
}

function EraRow({ era, count = 0 }: { era?: Era; count?: number }) {
  const router = useRouter();
  const blank = { name: "", year: new Date().getFullYear(), color: "#888888", description: "" };
  const [value, setValue] = useState({ ...blank, ...era });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dirty = !era || JSON.stringify({ ...blank, ...era }) !== JSON.stringify(value);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/dev/eras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...value, originalSlug: era?.slug }),
    });

    setBusy(false);
    if (!res.ok) return setError((await res.json()).error ?? "Failed.");
    if (!era) setValue(blank);
    router.refresh();
  }

  async function remove() {
    if (!era || !confirm(`Delete era “${era.name}”?`)) return;
    const res = await fetch(`/api/dev/eras?slug=${era.slug}`, { method: "DELETE" });

    if (!res.ok) return setError((await res.json()).error ?? "Failed.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-separator p-4">
      <div className="grid items-end gap-3 sm:grid-cols-[auto_1fr_6rem_auto]">
        <Field label="Colour">
          <input
            className="h-10 w-14 cursor-pointer rounded-md border border-separator bg-surface p-1"
            type="color"
            value={value.color}
            onChange={(e) => setValue({ ...value, color: e.target.value })}
          />
        </Field>
        <Field label={era ? `Name · /eras/${era.slug}` : "New era"}>
          <input
            className={inputClass}
            placeholder="Era name"
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
          />
        </Field>
        <Field label="Year">
          <input
            className={inputClass}
            type="number"
            value={value.year}
            onChange={(e) => setValue({ ...value, year: Number(e.target.value) })}
          />
        </Field>
        <div className="flex gap-1">
          <Button disabled={!dirty || busy || !value.name} onClick={save}>
            {era ? "Save" : "Add era"}
          </Button>
          {era && (
            <Button
              disabled={count > 0}
              title={count ? `${count} items use this era` : undefined}
              variant="danger"
              onClick={remove}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
      <input
        aria-label="Description"
        className={inputClass}
        placeholder="Short description shown on the era page"
        value={value.description ?? ""}
        onChange={(e) => setValue({ ...value, description: e.target.value })}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
