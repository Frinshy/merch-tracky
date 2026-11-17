/** Typed browser-side helpers for the /api/dev endpoints. */
import type { Era, MerchItem } from "@/lib/catalog/types";

import type { ApiResult, EraInput, ImageEntry, ItemInput } from "./types";
import { FORM_FIELDS } from "./types";

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  let body: ApiResult<T>;

  try {
    body = await res.json();
  } catch {
    throw new Error(`Request failed (${res.status}).`);
  }

  if (!res.ok || body.error !== undefined) {
    throw new Error(body.error ?? `Request failed (${res.status}).`);
  }

  return body.data;
}

export function saveItem(
  item: ItemInput,
  images: ImageEntry[],
  files: File[],
  /** ID of the item being edited; omit to create a new item. */
  editingId?: string,
) {
  const body = new FormData();

  body.append(FORM_FIELDS.item, JSON.stringify(item));
  body.append(FORM_FIELDS.images, JSON.stringify(images));
  files.forEach((file) => body.append(FORM_FIELDS.files, file));

  return editingId
    ? request<MerchItem>(`/api/dev/items/${encodeURIComponent(editingId)}`, {
        method: "PUT",
        body,
      })
    : request<MerchItem>("/api/dev/items", { method: "POST", body });
}

export function deleteItem(id: string) {
  return request<{ id: string }>(`/api/dev/items/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function saveEra(era: EraInput, coverFile?: File) {
  const body = new FormData();

  body.append(FORM_FIELDS.era, JSON.stringify(era));
  if (coverFile) body.append(FORM_FIELDS.coverFile, coverFile);

  return request<Era>("/api/dev/eras", { method: "POST", body });
}

export function deleteEra(slug: string) {
  return request<{ slug: string }>(`/api/dev/eras/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}
