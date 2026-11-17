import { Chip } from "@heroui/react";
import clsx from "clsx";

/** Flat yellow price-sticker label marking a limited release. */
export function LimitedSticker({
  className,
  children = "Limited",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Chip
      className={clsx(
        "label-caps h-auto rounded-sm bg-sticker px-1.5 py-0.5 text-sticker-foreground",
        className,
      )}
      size="sm"
    >
      {children}
    </Chip>
  );
}
