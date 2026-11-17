import { Chip } from "@heroui/react";
import clsx from "clsx";

/** Round shrink-wrap sticker marking a limited release. */
export function LimitedSticker({ className }: { className?: string }) {
  return (
    <Chip
      className={clsx(
        "grid size-14 -rotate-12 place-items-center rounded-full bg-sticker p-0 text-center text-[0.6875rem] font-bold uppercase leading-none text-sticker-foreground shadow-md [font-stretch:75%]",
        className,
      )}
    >
      Limited
    </Chip>
  );
}
