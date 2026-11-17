"use client";

import { Button, Card, Chip, Input } from "@heroui/react";
import clsx from "clsx";
import { useRef, useState } from "react";

import { ArrowDownIcon, ArrowUpIcon } from "@/components/ui/icons";

import { previewOf, releasePreviews, rowsFromFiles, type ImageRow } from "./image-rows";

/** Upload, order and describe an item's photos. The first photo is the cover. */
export function ImageManager({
  rows,
  onChange,
  defaultAuthor,
  altFallback,
}: {
  rows: ImageRow[];
  onChange: (rows: ImageRow[]) => void;
  /** Returns the pre-filled photo credit for new uploads. */
  defaultAuthor: () => string;
  /** Shown as alt-text placeholder (the item name). */
  altFallback: string;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const add = (files: Iterable<File>) =>
    onChange([...rows, ...rowsFromFiles(files, defaultAuthor())]);

  const update = (key: string, patch: Partial<Pick<ImageRow, "alt" | "author">>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  const move = (from: number, to: number) => {
    const next = [...rows];
    const [moved] = next.splice(from, 1);

    next.splice(to, 0, moved);
    onChange(next);
  };

  const remove = (row: ImageRow) => {
    releasePreviews([row]);
    onChange(rows.filter((r) => r.key !== row.key));
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className={clsx(
          "flex flex-col items-center gap-2 rounded-2xl border border-dashed px-4 py-8 text-center text-sm transition-colors",
          isDragging ? "border-accent bg-accent/5" : "border-separator",
        )}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          add(e.dataTransfer.files);
        }}
      >
        <p>Drop photos here</p>
        <Button size="sm" variant="secondary" onPress={() => fileInput.current?.click()}>
          Choose files
        </Button>
        <input
          ref={fileInput}
          multiple
          accept="image/*"
          className="hidden"
          type="file"
          onChange={(e) => {
            if (e.target.files) add(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="text-xs text-muted">
          Resized to max 2000px and saved as WebP. The first photo is the cover.
        </p>
      </div>

      {rows.length > 0 && (
        <ol className="flex flex-col gap-3">
          {rows.map((row, index) => (
            <li key={row.key}>
              <Card className="flex-row gap-3 p-3" variant="tertiary">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
                  {/* Plain <img>: blob: previews can't go through next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="size-full object-contain" src={previewOf(row)} />
                  {index === 0 && (
                    <Chip
                      className="absolute left-1 top-1"
                      color="accent"
                      size="sm"
                      variant="primary"
                    >
                      Cover
                    </Chip>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Input
                    aria-label="Alt text"
                    placeholder={`Alt text (defaults to “${altFallback || "item name"}”)`}
                    value={row.alt}
                    variant="secondary"
                    onChange={(e) => update(row.key, { alt: e.target.value })}
                  />
                  <Input
                    aria-label="Photo credit"
                    placeholder="Photo credit"
                    value={row.author}
                    variant="secondary"
                    onChange={(e) => update(row.key, { author: e.target.value })}
                  />
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Button
                    isIconOnly
                    aria-label="Move up"
                    isDisabled={index === 0}
                    size="sm"
                    variant="ghost"
                    onPress={() => move(index, index - 1)}
                  >
                    <ArrowUpIcon size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    aria-label="Move down"
                    isDisabled={index === rows.length - 1}
                    size="sm"
                    variant="ghost"
                    onPress={() => move(index, index + 1)}
                  >
                    <ArrowDownIcon size={16} />
                  </Button>
                  <Button size="sm" variant="danger-soft" onPress={() => remove(row)}>
                    Remove
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
