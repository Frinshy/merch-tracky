"use client";

import {
  Button,
  Card,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  Label,
  parseColor,
  toast,
} from "@heroui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { deleteEra, saveEra } from "@/lib/admin/client";
import type { Era } from "@/lib/catalog/types";

import { ConfirmDialog } from "./confirm-dialog";
import { TextInput } from "./fields";

type Draft = { name: string; year: string; color: string; description: string; cover: string };

const toDraft = (era?: Era): Draft => ({
  name: era?.name ?? "",
  year: String(era?.year ?? new Date().getFullYear()),
  color: era?.color ?? "#888888",
  description: era?.description ?? "",
  cover: era?.cover ?? "",
});

/** Edit an existing era, or create one when `era` is omitted. */
export function EraEditor({
  era,
  itemCount = 0,
  itemPhotos = [],
}: {
  era?: Era;
  itemCount?: number;
  /** Photos of this era's items, offered as cover choices. */
  itemPhotos?: string[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => toDraft(era));
  const [coverUpload, setCoverUpload] = useState<{ file: File; preview: string } | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const isDirty =
    !era || coverUpload !== null || JSON.stringify(toDraft(era)) !== JSON.stringify(draft);
  const coverPreview = coverUpload?.preview ?? draft.cover;

  const patch = (value: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...value }));

  function setUpload(file: File | null) {
    if (coverUpload) URL.revokeObjectURL(coverUpload.preview);
    setCoverUpload(file ? { file, preview: URL.createObjectURL(file) } : null);
  }

  async function save() {
    setIsSaving(true);
    try {
      const saved = await saveEra(
        { ...draft, year: Number(draft.year), originalSlug: era?.slug },
        coverUpload?.file,
      );

      setUpload(null);
      setDraft(era ? toDraft(saved) : toDraft());
      toast.success(era ? `Saved “${saved.name}”` : `Added era “${saved.name}”`);
      router.refresh();
    } catch (err) {
      toast.danger("Couldn't save era", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row" variant="secondary">
      {/* Cover */}
      <div className="flex shrink-0 flex-col gap-2 sm:w-40">
        <span className="text-sm font-medium">Cover</span>
        <div
          className="relative aspect-square w-40 overflow-hidden rounded-lg ring-1 ring-separator"
          style={{ backgroundColor: draft.color }}
        >
          {coverPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="size-full object-cover" src={coverPreview} />
          ) : (
            <span className="absolute inset-0 grid place-items-center p-3 text-center text-xs text-black/60">
              No cover — item photos are used
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <Button size="sm" variant="tertiary" onPress={() => fileInput.current?.click()}>
            Upload
          </Button>
          {itemPhotos.length > 0 && (
            <Button size="sm" variant="tertiary" onPress={() => setIsPicking(!isPicking)}>
              {isPicking ? "Close" : "From items"}
            </Button>
          )}
          {coverPreview && (
            <Button
              size="sm"
              variant="danger-soft"
              onPress={() => {
                setUpload(null);
                patch({ cover: "" });
              }}
            >
              Remove
            </Button>
          )}
        </div>
        <input
          ref={fileInput}
          accept="image/*"
          className="hidden"
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setUpload(file);
              setIsPicking(false);
            }
            e.target.value = "";
          }}
        />
      </div>

      {/* Fields */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="grid items-start gap-4 sm:grid-cols-[1fr_7rem_auto]">
          <TextInput
            isRequired
            description={era ? `/eras/${era.slug}` : "The URL is generated from the name."}
            label={era ? "Name" : "New era"}
            placeholder="Era name"
            value={draft.name}
            onChange={(name) => patch({ name })}
          />
          <TextInput
            isRequired
            label="Year"
            type="number"
            value={draft.year}
            onChange={(year) => patch({ year })}
          />
          <EraColorPicker value={draft.color} onChange={(color) => patch({ color })} />
        </div>
        <TextInput
          label="Description"
          placeholder="Short description shown on the era page"
          value={draft.description}
          onChange={(description) => patch({ description })}
        />

        {isPicking && (
          <div className="flex flex-wrap gap-2">
            {itemPhotos.map((src) => (
              <button
                key={src}
                aria-label="Use this photo as cover"
                className={clsx(
                  "size-16 overflow-hidden rounded-md bg-surface-tertiary ring-1 transition",
                  draft.cover === src && !coverUpload
                    ? "ring-2 ring-accent"
                    : "ring-separator hover:ring-foreground/40",
                )}
                type="button"
                onClick={() => {
                  setUpload(null);
                  patch({ cover: src });
                  setIsPicking(false);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="size-full object-contain" src={src} />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          {era && isDirty && <span className="mr-auto text-xs text-warning">Unsaved changes</span>}
          {era && (
            <ConfirmDialog
              body={`“${era.name}” will be removed. Items must be moved to another era first.`}
              title="Delete era?"
              trigger={(open) => (
                <Button isDisabled={itemCount > 0} size="sm" variant="danger-soft" onPress={open}>
                  {itemCount > 0 ? `In use by ${itemCount}` : "Delete"}
                </Button>
              )}
              onConfirm={async () => {
                try {
                  await deleteEra(era.slug);
                  toast.success(`Deleted “${era.name}”`);
                  router.refresh();
                } catch (err) {
                  toast.danger("Couldn't delete era", {
                    description: err instanceof Error ? err.message : undefined,
                  });
                }
              }}
            />
          )}
          <Button
            isDisabled={!isDirty || !draft.name.trim()}
            isPending={isSaving}
            size="sm"
            onPress={save}
          >
            {era ? "Save" : "Add era"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EraColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">Colour</span>
      <ColorPicker value={value} onChange={(color) => onChange(color.toString("hex"))}>
        <ColorPicker.Trigger aria-label="Pick era colour">
          <ColorSwatch className="size-10 rounded-lg" />
        </ColorPicker.Trigger>
        <ColorPicker.Popover className="flex w-64 flex-col gap-3 p-3">
          <ColorArea
            aria-label="Saturation and brightness"
            className="max-w-full"
            colorSpace="hsb"
            xChannel="saturation"
            yChannel="brightness"
          >
            <ColorArea.Thumb />
          </ColorArea>
          <ColorSlider channel="hue" className="gap-1 px-1" colorSpace="hsb">
            <Label>Hue</Label>
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
          <ColorField
            aria-label="Hex colour"
            value={parseColor(value)}
            onChange={(color) => color && onChange(color.toString("hex"))}
          >
            <ColorField.Group variant="secondary">
              <ColorField.Input />
            </ColorField.Group>
          </ColorField>
        </ColorPicker.Popover>
      </ColorPicker>
    </div>
  );
}
