import { linkVariants } from "@heroui/styles";
import clsx from "clsx";
import NextLink from "next/link";
import type { ComponentProps } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type TextLinkProps = ComponentProps<typeof NextLink> & {
  /** Adds a trailing (forward) or leading (back) arrow. */
  arrow?: "forward" | "back";
};

/**
 * A Next.js link styled as a muted HeroUI link. Use for secondary
 * navigation ("View all →", "← Back"); use `ButtonLink` for calls to action.
 */
export function TextLink({ arrow, className, children, ...props }: TextLinkProps) {
  return (
    <NextLink
      className={clsx(
        linkVariants().base(),
        "gap-1.5 font-normal text-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      {arrow === "back" && <ArrowLeftIcon size={14} />}
      {children}
      {arrow === "forward" && <ArrowRightIcon size={14} />}
    </NextLink>
  );
}
