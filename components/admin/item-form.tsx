"use client";

import {
  Alert,
  Button,
  Checkbox,
  Fieldset,
  Form,
  Label,
  ListBox,
  Select,
  toast,
} from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { saveItem } from "@/lib/admin/client";
import { sortTypes, TYPE_ORDER } from "@/lib/catalog/data";
import { RELEASE_DATE_PATTERN, slugify, today } from "@/lib/catalog/format";
import type { Era, MerchItem } from "@/lib/catalog/types";

import { SuggestInput, TextAreaInput, TextInput } from "./fields";
import { ImageManager } from "./image-manager";
import { releasePreviews, rowsFromImages, toImagePayload, type ImageRow } from "./image-rows";

const LAST_AUTHOR_KEY = "merch-tracky:last-author";
const SOURCE_SUGGESTIONS = ["Official webstore", "Tour", "Retailer exclusive", "Fan club"];

type Fields = {
  name: string;
  id: string;
  description: string;
  type: string;
  era: string;
  releaseDate: string;
  addedAt: string;
  source: string;
  edition: string;
  region: string;
  price: string;
  limited: boolean;
  tags: string;
};

function initialFields(item: MerchItem | undefined, eras: Era[]): Fields {
  return {
    name: item?.name ?? "",
    id: item?.id ?? "",
    description: item?.description ?? "",
    type: item?.type ?? "",
    era: item?.era ?? eras[eras.length - 1]?.slug ?? "",
    releaseDate: item?.releaseDate ?? "",
    addedAt: item?.addedAt ?? today(),
    source: item?.source ?? "",
    edition: item?.edition ?? "",
    region: item?.region ?? "",
    price: item?.price ?? "",
    limited: item?.limited ?? false,
    tags: item?.tags?.join(", ") ?? "",
  };
}

/** Create (no `initial`) or edit an item. */
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
  const isEdit = initial !== undefined;

  const [fields, setFields] = useState(() => initialFields(initial, eras));
  // New items get their ID from the name until the ID is edited by hand.
  const [idTouched, setIdTouched] = useState(isEdit);
  const [rows, setRows] = useState<ImageRow[]>(() => rowsFromImages(initial?.images ?? []));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Release blob: previews when leaving the page.
  const rowsRef = useRef(rows);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  useEffect(() => () => releasePreviews(rowsRef.current), []);

  const id = idTouched ? slugify(fields.id) : slugify(fields.name);
  const idTaken = items.some((item) => item.id === id && item.id !== initial?.id);

  const typeOptions = useMemo(
    () => sortTypes([...TYPE_ORDER, ...items.map((i) => i.type)]),
    [items],
  );
  const sourceOptions = useMemo(
    () =>
      Array.from(
        new Set([...SOURCE_SUGGESTIONS, ...items.flatMap((i) => (i.source ? [i.source] : []))]),
      ),
    [items],
  );

  const set =
    <K extends keyof Fields>(key: K) =>
    (value: Fields[K]) =>
      setFields((prev) => ({ ...prev, [key]: value }));

  async function submit() {
    setIsSaving(true);
    setError(null);
    const { entries, files } = toImagePayload(rows);

    try {
      const saved = await saveItem(
        {
          ...fields,
          id,
          limited: fields.limited,
          tags: fields.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        },
        entries,
        files,
        initial?.id,
      );
      const author = rows.find((r) => r.author)?.author;

      if (author) localStorage.setItem(LAST_AUTHOR_KEY, author);

      toast.success(isEdit ? "Changes saved" : `Added “${saved.name}”`, {
        description: "Commit and push to publish.",
        actionProps: {
          children: "View",
          variant: "tertiary",
          onPress: () => router.push(`/items/${saved.id}`),
        },
      });

      if (isEdit) {
        router.push("/dev");
        router.refresh();

        return;
      }

      // Keep era/type/source/date so adding a batch from one release is quick.
      releasePreviews(rows);
      setRows([]);
      setIdTouched(false);
      setFields((prev) => ({
        ...initialFields(undefined, eras),
        era: prev.era,
        type: prev.type,
        source: prev.source,
        releaseDate: prev.releaseDate,
      }));
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form
      className="mx-auto flex max-w-3xl flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <header className="flex flex-col gap-2">
        <NextLink className="label-caps text-muted hover:text-foreground" href="/dev">
          ← Admin
        </NextLink>
        <h1 className="font-display text-5xl">{isEdit ? `Edit “${initial.name}”` : "Add item"}</h1>
      </header>

      {error && (
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Couldn&apos;t save</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      )}

      <Section title="Basics">
        <TextInput
          isRequired
          label="Name"
          placeholder="e.g. Faith in the Future — Red Vinyl"
          value={fields.name}
          onChange={set("name")}
        />
        <TextInput
          description={
            idTaken ? (
              <span className="text-danger">This ID is already in use.</span>
            ) : (
              <>
                URL: /items/<strong>{id || "…"}</strong>
                {!idTouched && " (generated from the name)"}
              </>
            )
          }
          label="ID"
          placeholder={slugify(fields.name) || "generated-from-name"}
          value={idTouched ? fields.id : id}
          onChange={(value) => {
            setIdTouched(true);
            set("id")(value);
          }}
        />
        <TextAreaInput
          label="Description"
          value={fields.description}
          onChange={set("description")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SuggestInput
            isRequired
            label="Type"
            options={typeOptions}
            placeholder="Vinyl, CD, Apparel…"
            value={fields.type}
            onChange={set("type")}
          />
          <Select
            isRequired
            value={fields.era}
            variant="secondary"
            onChange={(key) => key && set("era")(String(key))}
          >
            <Label>Era</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {eras.map((era) => (
                  <ListBox.Item key={era.slug} id={era.slug} textValue={era.name}>
                    {era.name} ({era.year})
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </Section>

      <Section title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            description="YYYY, YYYY-MM or YYYY-MM-DD"
            label="Release date"
            placeholder="2022-11-11"
            validate={(v) =>
              v && !RELEASE_DATE_PATTERN.test(v) ? "Use YYYY, YYYY-MM or YYYY-MM-DD." : null
            }
            value={fields.releaseDate}
            onChange={set("releaseDate")}
          />
          <TextInput
            label="Edition / variant"
            placeholder="Signed, Red vinyl, Deluxe…"
            value={fields.edition}
            onChange={set("edition")}
          />
          <SuggestInput
            label="Sold via"
            options={sourceOptions}
            value={fields.source}
            onChange={set("source")}
          />
          <TextInput
            label="Region"
            placeholder="UK, US, EU…"
            value={fields.region}
            onChange={set("region")}
          />
          <TextInput
            label="Original price"
            placeholder="£25"
            value={fields.price}
            onChange={set("price")}
          />
          <TextInput
            label="Added to archive"
            type="date"
            value={fields.addedAt}
            onChange={set("addedAt")}
          />
        </div>
        <TextInput
          description="Comma separated, used for search"
          label="Tags"
          placeholder="signed, tour, 2023"
          value={fields.tags}
          onChange={set("tags")}
        />
        <Checkbox isSelected={fields.limited} onChange={set("limited")}>
          <Checkbox.Content>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Limited release
          </Checkbox.Content>
        </Checkbox>
      </Section>

      <Section title={`Photos (${rows.length})`}>
        <ImageManager
          altFallback={fields.name}
          defaultAuthor={() => localStorage.getItem(LAST_AUTHOR_KEY) ?? ""}
          rows={rows}
          onChange={setRows}
        />
      </Section>

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-3 rounded-xl border border-separator bg-background/90 p-3 backdrop-blur">
        <ButtonLink href="/dev" variant="ghost">
          Cancel
        </ButtonLink>
        <Button isDisabled={idTaken} isPending={isSaving} type="submit">
          {isEdit ? "Save changes" : "Add item"}
        </Button>
      </div>
    </Form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Fieldset className="flex w-full flex-col gap-4 rounded-xl border border-separator p-5">
      <Fieldset.Legend className="px-1 font-display text-2xl">{title}</Fieldset.Legend>
      {children}
    </Fieldset>
  );
}
