import Link from "next/link";
import clsx from "clsx";

import { getEra } from "@/lib/catalog";

/** Small coloured dot + era name. Links to the era page unless `plain`. */
export function EraBadge({
  slug,
  plain = false,
  className,
}: {
  slug: string;
  plain?: boolean;
  className?: string;
}) {
  const era = getEra(slug);
  const name = era?.name ?? slug;
  const content = (
    <>
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: era?.color ?? "currentColor" }}
      />
      {name}
    </>
  );
  const classes = clsx("inline-flex items-center gap-1.5", className);

  if (plain || !era) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link
      className={clsx(classes, "hover:text-foreground")}
      href={`/eras/${era.slug}`}
    >
      {content}
    </Link>
  );
}
