import type { ButtonVariants } from "@heroui/styles";
import { buttonVariants } from "@heroui/styles";
import NextLink from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof NextLink> & ButtonVariants;

/**
 * A Next.js link styled as a HeroUI button. Use for navigation; use
 * `<Button>` for actions.
 */
export function ButtonLink({
  variant,
  size,
  isIconOnly,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <NextLink
      className={buttonVariants({ variant, size, isIconOnly, fullWidth, className })}
      {...props}
    />
  );
}
