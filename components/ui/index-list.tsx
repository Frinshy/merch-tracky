import NextLink from "next/link";

import { pluralize } from "@/lib/catalog/format";

export type IndexEntry = {
  href: string;
  label: React.ReactNode;
  /** Shown before the label, e.g. a colour dot or thumbnail. */
  leading?: React.ReactNode;
  meta?: string;
  count: number;
};

/** A list of large links with counts ("Walls · 2020 · 4 items →"). */
export function IndexList({ entries }: { entries: IndexEntry[] }) {
  return (
    <ul className="divide-y divide-separator">
      {entries.map((entry) => (
        <li key={entry.href}>
          <NextLink
            className="group flex items-center gap-3 py-3 transition-[padding] hover:pl-1"
            href={entry.href}
          >
            <span className="flex flex-1 items-center gap-2.5 font-display text-2xl">
              {entry.leading}
              {entry.label}
            </span>
            {entry.meta && <span className="label-caps text-muted">{entry.meta}</span>}
            <span className="label-caps w-16 text-right text-muted">
              {pluralize(entry.count, "item")}
            </span>
            <span
              aria-hidden="true"
              className="text-muted transition group-hover:translate-x-1 group-hover:text-foreground"
            >
              →
            </span>
          </NextLink>
        </li>
      ))}
    </ul>
  );
}
