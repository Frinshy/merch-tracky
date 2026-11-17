import Link from "next/link";

import { siteConfig } from "@/config/site";
import { items } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-separator">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="max-w-xl">
          {siteConfig.name} is an unofficial fan archive and is not affiliated
          with Louis Tomlinson or his management. Photos belong to their
          credited owners.
        </p>
        <div className="flex items-center gap-5">
          <span className="label-caps">{items.length} items archived</span>
          <Link
            className="hover:text-foreground"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
