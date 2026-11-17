"use client";

import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/ui/button-link";

/** Floating shortcut to the admin tools. Only mounted by the root layout under `next dev`. */
export function DevToolbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/dev")) return null;

  const itemId = pathname.match(/^\/items\/([^/]+)$/)?.[1];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-xl border border-warning/40 bg-background/90 p-1 shadow-lg backdrop-blur">
      <span className="label-caps px-2 text-warning">Dev</span>
      <ButtonLink href="/dev" size="sm" variant="ghost">
        Admin
      </ButtonLink>
      {itemId && (
        <ButtonLink href={`/dev/items/${itemId}`} size="sm" variant="ghost">
          Edit item
        </ButtonLink>
      )}
      <ButtonLink href="/dev/items/new" size="sm">
        + Add
      </ButtonLink>
    </div>
  );
}
