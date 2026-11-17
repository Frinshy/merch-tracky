import clsx from "clsx";
import NextLink from "next/link";

import { getEra } from "@/lib/catalog/data";

/** Era colour swatch. */
export function EraDot({ color, className }: { color?: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-block size-2 shrink-0 rounded-full ring-1 ring-black/15 dark:ring-0",
        className,
      )}
      style={{ backgroundColor: color ?? "currentColor" }}
    />
  );
}

/** Coloured dot + era name. Links to the era page unless `plain`. */
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
  const classes = clsx("inline-flex items-center gap-1.5", className);
  const content = (
    <>
      <EraDot color={era?.color} />
      {era?.name ?? slug}
    </>
  );

  if (plain || !era) return <span className={classes}>{content}</span>;

  return (
    <NextLink
      className={clsx(classes, "focus-outline rounded-sm hover:text-foreground")}
      href={`/eras/${era.slug}`}
    >
      {content}
    </NextLink>
  );
}
