"use client";

import { Surface } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/ui/button-link";

/** Floating shortcut to the admin tools. Only mounted by the root layout under `next dev`. */
export function DevToolbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/dev")) return null;

  const itemId = pathname.match(/^\/items\/([^/]+)$/)?.[1];

  return (
    <Surface className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-2xl p-1 shadow-lg ring-1 ring-warning/40">
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
        <PlusIcon size={16} />
        Add
      </ButtonLink>
    </Surface>
  );
}
