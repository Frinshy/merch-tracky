"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DevToolbar() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const pathname = usePathname();

  // Don't clutter the add-merch page itself with the toolbar if you're already there (optional)
  // But having it persistent is nice. Let's make it fixed at the bottom-right.

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-content1/90 backdrop-blur-md border border-warning/40 shadow-lg rounded-xl px-4 py-3 flex items-center gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
        </span>
        <span className="font-semibold text-warning-600 dark:text-warning-400">DEV MODE</span>
      </div>

      <div className="h-4 w-px bg-default-300" />

      <div className="flex items-center gap-2">
        {pathname !== "/dev/add-merch" && (
          <Link
            href="/dev/add-merch"
            className="px-2.5 py-1.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-95 transition"
          >
            + Add Merch
          </Link>
        )}
        <span className="text-default-400">Local git uncommitted changes ready</span>
      </div>
    </div>
  );
}
