import type { ImageEntry } from "@/lib/admin/types";
import type { MerchImage } from "@/lib/catalog/types";

/** A photo in the item form: either already saved, or a pending upload. */
export type ImageRow = {
  key: string;
  alt: string;
  author: string;
} & ({ kind: "existing"; src: string } | { kind: "new"; file: File; preview: string });

let counter = 0;
const nextKey = () => `img-${++counter}`;

export const rowsFromImages = (images: MerchImage[]): ImageRow[] =>
  images.map((img) => ({
    key: nextKey(),
    kind: "existing",
    src: img.src,
    alt: img.alt,
    author: img.author ?? "",
  }));

export const rowsFromFiles = (files: Iterable<File>, author: string): ImageRow[] =>
  Array.from(files)
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({
      key: nextKey(),
      kind: "new",
      file,
      preview: URL.createObjectURL(file),
      alt: "",
      author,
    }));

export const previewOf = (row: ImageRow) => (row.kind === "new" ? row.preview : row.src);

export function releasePreviews(rows: ImageRow[]) {
  rows.forEach((row) => row.kind === "new" && URL.revokeObjectURL(row.preview));
}

/** Converts rows into the ordered entry list + file list the API expects. */
export function toImagePayload(rows: ImageRow[]): { entries: ImageEntry[]; files: File[] } {
  const files: File[] = [];
  const entries = rows.map((row): ImageEntry => {
    if (row.kind === "existing") {
      return { kind: "existing", src: row.src, alt: row.alt, author: row.author };
    }
    files.push(row.file);

    return { kind: "new", file: files.length - 1, alt: row.alt, author: row.author };
  });

  return { entries, files };
}
