"use client";

import { Button } from "@heroui/react";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import { PLACEHOLDER_IMAGE } from "@/lib/catalog/data";
import type { MerchImage } from "@/lib/catalog/types";

export function ItemGallery({ images, name }: { images: MerchImage[]; name: string }) {
  const list = images.length ? images : [{ ...PLACEHOLDER_IMAGE, alt: name }];
  const [active, setActive] = useState(0);
  const image = list[active];
  const hasMany = list.length > 1;

  const go = (delta: number) => setActive((i) => (i + delta + list.length) % list.length);

  return (
    <section aria-label="Item photos" className="flex min-w-0 flex-col gap-3">
      {/* Arrow keys switch photos while the main image is focused. */}
      {}
      <div
        aria-roledescription={hasMany ? "carousel" : undefined}
        className="group relative aspect-square overflow-hidden rounded-xl bg-surface-secondary ring-1 ring-separator focus-visible:outline-2 focus-visible:outline-focus"
        tabIndex={hasMany ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
      >
        <Image
          fill
          preload
          alt={image.alt || name}
          className="object-contain p-[6%]"
          sizes="(min-width: 1024px) 55vw, 100vw"
          src={image.src}
        />
        {hasMany && (
          <>
            <GalleryArrow direction="previous" onPress={() => go(-1)} />
            <GalleryArrow direction="next" onPress={() => go(1)} />
            <span className="label-caps absolute bottom-3 right-3 rounded-md bg-background/80 px-1.5 py-0.5 backdrop-blur">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {image.author && <p className="label-caps text-muted">Photo: {image.author}</p>}

      {hasMany && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {list.map((img, index) => (
            <button
              key={`${img.src}-${index}`}
              aria-current={active === index}
              aria-label={`Show photo ${index + 1}`}
              className={clsx(
                "relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-secondary ring-1 transition sm:size-20",
                active === index
                  ? "ring-2 ring-foreground"
                  : "opacity-60 ring-separator hover:opacity-100",
              )}
              type="button"
              onClick={() => setActive(index)}
            >
              <Image fill alt="" className="object-contain p-1" sizes="80px" src={img.src} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function GalleryArrow({
  direction,
  onPress,
}: {
  direction: "previous" | "next";
  onPress: () => void;
}) {
  return (
    <Button
      isIconOnly
      aria-label={`${direction === "previous" ? "Previous" : "Next"} photo`}
      className={clsx(
        "absolute top-1/2 -translate-y-1/2 rounded-full bg-background/80 shadow backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100 sm:data-[focus-visible=true]:opacity-100",
        direction === "previous" ? "left-3" : "right-3",
      )}
      variant="tertiary"
      onPress={onPress}
    >
      <span aria-hidden="true">{direction === "previous" ? "←" : "→"}</span>
    </Button>
  );
}
