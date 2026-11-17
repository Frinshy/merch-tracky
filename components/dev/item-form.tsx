"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { Button, Field, inputClass, Notice } from "@/components/dev/ui";
import {
  slugify,
  sortTypes,
  TYPE_ORDER,
  type Era,
  type MerchItem,
} from "@/lib/catalog";

type ImageRow =
  | { key: string; kind: "existing"; src: string; alt: string; author: string }
  | {
      key: string;
      kind: "new";
      file: File;
      preview: string;
      alt: string;
      author: string;
    };

const AUTHOR_KEY = "merch-tracky:last-author";
const today = () => new Date().toISOString().slice(0, 10);
let keyCounter = 0;
const nextKey = () => `img-${++keyCounter}`;

function emptyFields(eras: Era[]) {
  return {
    name: "",
    description: "",
    type: "",
    era: eras[eras.length - 1]?.slug ?? "",
    releaseDate: "",
    addedAt: today(),
    source: "",
    edition: "",
    region: "",
    price: "",
    limited: false,
    tags: "",
  };
}

export function ItemForm({
  initial,
  items,
  eras,
}: {
  initial?: MerchItem;
  items: MerchItem[];
  eras: Era[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [fields, setFields] = useState(() =>
    initial
      ? {
          name: initial.name,
          description: initial.description,
          type: initial.type,
          era: initial.era,
          releaseDate: initial.releaseDate ?? "",
          addedAt: initial.addedAt,
          source: initial.source ?? "",
          edition: initial.edition ?? "",
          region: initial.region ?? "",
          price: initial.price ?? "",
          limited: initial.limited ?? false,
          tags: initial.tags?.join(", ") ?? "",
        }
      : emptyFields(eras),
  );
  const [id, setId] = useState(initial?.id ?? "");
  const [idTouched, setIdTouched] = useState(isEdit);
  const [images, setImages] = useState<ImageRow[]>(
    () =>
      initial?.images.map((img) => ({
        key: nextKey(),
        kind: "existing" as const,
        src: img.src,
        alt: img.alt,
        author: img.author ?? "",
      })) ?? [],
  );
  const [defaultAuthor, setDefaultAuthor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<MerchItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDefaultAuthor(localStorage.getItem(AUTHOR_KEY) ?? "");
  }, []);

  // Release object URLs for previews when the form unmounts.
  const imagesRef = useRef(images);

  imagesRef.current = images;
  useEffect(
    () => () =>
      imagesRef.current.forEach((img) => {
        if (img.kind === "new") URL.revokeObjectURL(img.preview);
      }),
    [],
  );

  const effectiveId = idTouched ? slugify(id) : slugify(fields.name);
  const idTaken = items.some(
    (item) => item.id === effectiveId && item.id !== initial?.id,
  );

  const typeOptions = useMemo(
    () => sortTypes([...TYPE_ORDER, ...items.map((i) => i.type)]),
    [items],
  );
  const sourceOptions = useMemo(
    () =>
      Array.from(
        new Set([
          "Official webstore",
          "Tour",
          "Retailer exclusive",
          "Fan club",
          ...(items.map((i) => i.source).filter(Boolean) as string[]),
        ]),
      ),
    [items],
  );

  const set =
    (key: keyof typeof fields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setFields((prev) => ({
        ...prev,
        [key]:
          e.target instanceof HTMLInputElement && e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value,
      }));

  function addFiles(files: FileList | File[]) {
    const rows: ImageRow[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        key: nextKey(),
        kind: "new",
        file,
        preview: URL.createObjectURL(file),
        alt: "",
        author: defaultAuthor,
      }));

    setImages((prev) => [...prev, ...rows]);
  }

  function updateImage(key: string, patch: Partial<Pick<ImageRow, "alt" | "author">>) {
    setImages((prev) =>
      prev.map((img) => (img.key === key ? { ...img, ...patch } : img)),
    );
  }

  function moveImage(index: number, to: number) {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);

      next.splice(to, 0, moved);

      return next;
    });
  }

  function removeImage(key: string) {
    setImages((prev) => {
      const img = prev.find((i) => i.key === key);

      if (img?.kind === "new") URL.revokeObjectURL(img.preview);

      return prev.filter((i) => i.key !== key);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(null);

    const files: File[] = [];
    const imageEntries = images.map((img) => {
      if (img.kind === "existing") {
        return { kind: "existing", src: img.src, alt: img.alt, author: img.author };
      }
      files.push(img.file);

      return {
        kind: "new",
        file: files.length - 1,
        alt: img.alt,
        author: img.author,
      };
    });

    const body = new FormData();

    body.append(
      "item",
      JSON.stringify({
        ...fields,
        id: effectiveId,
        tags: fields.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    );
    body.append("images", JSON.stringify(imageEntries));
    files.forEach((file) => body.append("files", file));

    try {
      const res = await fetch(
        isEdit ? `/api/dev/items/${initial!.id}` : "/api/dev/items",
        { method: isEdit ? "PUT" : "POST", body },
      );
      const result = await res.json();

      if (!res.ok) throw new Error(result.error ?? "Failed to save.");

      const author = images.find((i) => i.author)?.author;

      if (author) localStorage.setItem(AUTHOR_KEY, author);

      if (isEdit) {
        router.push(`/dev?saved=${encodeURIComponent(result.item.id)}`);
        router.refresh();

        return;
      }

      setSaved(result.item);
      // Keep era/type/source/dates so adding a batch from one era is quick.
      setFields((prev) => ({
        ...emptyFields(eras),
        era: prev.era,
        type: prev.type,
        source: prev.source,
        releaseDate: prev.releaseDate,
      }));
      setId("");
      setIdTouched(false);
      images.forEach((img) => {
        if (img.kind === "new") URL.revokeObjectURL(img.preview);
      });
      setImages([]);
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="mx-auto flex max-w-3xl flex-col gap-8" onSubmit={handleSubmit}>
      <header className="flex flex-col gap-2">
        <Link className="label-caps text-muted hover:text-foreground" href="/dev">
          ← Admin
        </Link>
        <h1 className="font-display text-5xl">
          {isEdit ? `Edit “${initial!.name}”` : "Add item"}
        </h1>
      </header>

      {saved && (
        <Notice tone="success">
          Added <strong>{saved.name}</strong>.{" "}
          <Link className="underline" href={`/items/${saved.id}`}>
            View it
          </Link>{" "}
          or keep adding. Commit and push when you&apos;re done to publish.
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}

      <Section title="Basics">
        <Field label="Name *">
          <input
            required
            className={inputClass}
            placeholder="e.g. Faith in the Future — Red Vinyl"
            value={fields.name}
            onChange={set("name")}
          />
        </Field>
        <Field
          hint={
            idTaken ? (
              <span className="text-danger">This ID is already in use.</span>
            ) : (
              <>
                URL: /items/<strong>{effectiveId || "…"}</strong>
                {!idTouched && " (generated from the name)"}
              </>
            )
          }
          label="ID"
        >
          <input
            className={inputClass}
            placeholder={slugify(fields.name) || "generated-from-name"}
            value={idTouched ? id : slugify(fields.name)}
            onChange={(e) => {
              setIdTouched(true);
              setId(e.target.value);
            }}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={clsx(inputClass, "h-auto py-2")}
            rows={3}
            value={fields.description}
            onChange={set("description")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type *">
            <input
              required
              className={inputClass}
              list="type-options"
              placeholder="Vinyl, CD, Apparel…"
              value={fields.type}
              onChange={set("type")}
            />
            <datalist id="type-options">
              {typeOptions.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field
            hint={
              <Link className="underline" href="/dev#eras">
                Manage eras
              </Link>
            }
            label="Era *"
          >
            <select
              required
              className={inputClass}
              value={fields.era}
              onChange={set("era")}
            >
              {eras.map((era) => (
                <option key={era.slug} value={era.slug}>
                  {era.name} ({era.year})
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field hint="YYYY, YYYY-MM or YYYY-MM-DD" label="Release date">
            <input
              className={inputClass}
              pattern="\d{4}(-\d{2}){0,2}"
              placeholder="2022-11-11"
              value={fields.releaseDate}
              onChange={set("releaseDate")}
            />
          </Field>
          <Field label="Edition / variant">
            <input
              className={inputClass}
              placeholder="Signed, Red vinyl, Deluxe…"
              value={fields.edition}
              onChange={set("edition")}
            />
          </Field>
          <Field label="Sold via">
            <input
              className={inputClass}
              list="source-options"
              value={fields.source}
              onChange={set("source")}
            />
            <datalist id="source-options">
              {sourceOptions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Region">
            <input
              className={inputClass}
              placeholder="UK, US, EU…"
              value={fields.region}
              onChange={set("region")}
            />
          </Field>
          <Field label="Original price">
            <input
              className={inputClass}
              placeholder="£25"
              value={fields.price}
              onChange={set("price")}
            />
          </Field>
          <Field label="Added to archive">
            <input
              className={inputClass}
              type="date"
              value={fields.addedAt}
              onChange={set("addedAt")}
            />
          </Field>
        </div>
        <Field hint="Comma separated, used for search" label="Tags">
          <input
            className={inputClass}
            placeholder="signed, tour, 2023"
            value={fields.tags}
            onChange={set("tags")}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            checked={fields.limited}
            className="size-4 accent-current"
            type="checkbox"
            onChange={set("limited")}
          />
          Limited release
        </label>
      </Section>

      <Section title={`Photos (${images.length})`}>
        <div
          className={clsx(
            "flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-8 text-center text-sm transition",
            dragging ? "border-foreground bg-surface-secondary" : "border-separator",
          )}
          onDragLeave={() => setDragging(false)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <p>Drop photos here</p>
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            Choose files
          </Button>
          <input
            ref={fileInput}
            multiple
            accept="image/*"
            className="hidden"
            type="file"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-muted">
            Resized to max 2000px and saved as WebP. The first photo is the cover.
          </p>
        </div>

        {images.length > 0 && (
          <ol className="flex flex-col gap-3">
            {images.map((img, index) => (
              <li
                className="flex gap-3 rounded-md border border-separator p-3"
                key={img.key}
              >
                <div className="relative size-24 shrink-0 overflow-hidden rounded bg-surface-secondary">
                  {/* Plain img so local blob previews work. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    className="size-full object-contain"
                    src={img.kind === "new" ? img.preview : img.src}
                  />
                  {index === 0 && (
                    <span className="label-caps absolute left-1 top-1 rounded-sm bg-foreground px-1 text-background">
                      Cover
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <input
                    aria-label="Alt text"
                    className={inputClass}
                    placeholder={`Alt text (defaults to “${fields.name || "name"}”)`}
                    value={img.alt}
                    onChange={(e) => updateImage(img.key, { alt: e.target.value })}
                  />
                  <input
                    aria-label="Photo credit"
                    className={inputClass}
                    placeholder="Photo credit"
                    value={img.author}
                    onChange={(e) =>
                      updateImage(img.key, { author: e.target.value })
                    }
                  />
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-xs">
                  <Button
                    aria-label="Move up"
                    className="h-7 px-2"
                    disabled={index === 0}
                    variant="ghost"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ↑
                  </Button>
                  <Button
                    aria-label="Move down"
                    className="h-7 px-2"
                    disabled={index === images.length - 1}
                    variant="ghost"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    ↓
                  </Button>
                  <Button
                    className="h-7 px-2"
                    variant="danger"
                    onClick={() => removeImage(img.key)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border border-separator bg-background/90 p-3 backdrop-blur">
        <Link className="text-sm text-muted hover:text-foreground" href="/dev">
          Cancel
        </Link>
        <Button disabled={saving || idTaken} type="submit">
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add item"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border border-separator p-5">
      <legend className="px-1 font-display text-2xl">{title}</legend>
      {children}
    </fieldset>
  );
}
