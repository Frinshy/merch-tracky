"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Floating shortcut to the admin tools. Only rendered by `next dev`. */
export function DevToolbar() {
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "development" || pathname.startsWith("/dev")) {
    return null;
  }

  const itemId = pathname.match(/^\/items\/([^/]+)$/)?.[1];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-lg border border-warning/40 bg-background/90 p-1 text-xs shadow-lg backdrop-blur">
      <span className="label-caps px-2 text-warning">Dev</span>
      <Link className="rounded-md px-2.5 py-1.5 hover:bg-surface-secondary" href="/dev">
        Admin
      </Link>
      {itemId && (
        <Link
          className="rounded-md px-2.5 py-1.5 hover:bg-surface-secondary"
          href={`/dev/items/${itemId}`}
        >
          Edit item
        </Link>
      )}
      <Link
        className="rounded-md bg-foreground px-2.5 py-1.5 text-background"
        href="/dev/items/new"
      >
        + Add
      </Link>
    </div>
  );
}
