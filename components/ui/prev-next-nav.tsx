import { linkVariants } from "@heroui/styles";
import clsx from "clsx";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import NextLink from "next/link";

type Target = { href: string; label: string };

/** "← Previous / Next →" links at the end of a page. */
export function PrevNextNav({
  prev,
  next,
  label,
  prevCaption = "Previous",
  nextCaption = "Next",
  large = false,
}: {
  prev?: Target;
  next?: Target;
  label: string;
  prevCaption?: string;
  nextCaption?: string;
  large?: boolean;
}) {
  if (!prev && !next) return null;
  const title = large ? "font-display text-2xl text-foreground" : "line-clamp-1 text-foreground";
  const link = clsx(
    linkVariants().base(),
    "flex w-full flex-col gap-0.5 font-normal text-muted hover:text-foreground",
  );

  return (
    <nav aria-label={label} className="grid grid-cols-2 gap-4 text-sm">
      {prev ? (
        <NextLink className={clsx(link, "items-start")} href={prev.href}>
          <span className="label-caps inline-flex items-center gap-1.5">
            <ArrowLeftIcon size={12} />
            {prevCaption}
          </span>
          <span className={title}>{prev.label}</span>
        </NextLink>
      ) : (
        <span />
      )}
      {next && (
        <NextLink className={clsx(link, "items-end text-right")} href={next.href}>
          <span className="label-caps inline-flex items-center gap-1.5">
            {nextCaption}
            <ArrowRightIcon size={12} />
          </span>
          <span className={title}>{next.label}</span>
        </NextLink>
      )}
    </nav>
  );
}
