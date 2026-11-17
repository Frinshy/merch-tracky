import clsx from "clsx";
import { ArrowRightIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { ButtonLink } from "@/components/ui/button-link";

/** Primary call-to-action filled with an era's colour. */
export function EraButtonLink({
  color,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof ButtonLink>, "variant" | "style"> & { color: string }) {
  return (
    <ButtonLink
      className={clsx("gap-2 text-black hover:opacity-90", className)}
      style={{ backgroundColor: color }}
      {...props}
    >
      {children}
      <ArrowRightIcon size={16} />
    </ButtonLink>
  );
}
