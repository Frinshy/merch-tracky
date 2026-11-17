"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

import { PLACEHOLDER_IMAGE, type MerchImage } from "@/lib/catalog";

export function ItemGallery({
  images,
  name,
}: {
  images: MerchImage[];
  name: string;
}) {
  const list = images.length ? images : [{ ...PLACEHOLDER_IMAGE, alt: name }];
  const [active, setActive] = useState(0);
  const image = list[active];
  const many = list.length > 1;

  const go = (delta: number) =>
    setActive((i) => (i + delta + list.length) % list.length);

  return (
    <section aria-label="Item photos" className="flex min-w-0 flex-col gap-3">
      <div
        className="group relative aspect-square overflow-hidden rounded-lg bg-surface-secondary ring-1 ring-separator"
        // Arrow keys switch photos when the gallery is focused.
        tabIndex={many ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(-1);
          if (e.key === "ArrowRight") go(1);
        }}
      >
        <Image
          alt={image.alt || name}
          className="object-contain p-[6%]"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          src={image.src}
        />
        {many && (
          <>
            <GalleryButton label="Previous photo" side="left" onClick={() => go(-1)} />
            <GalleryButton label="Next photo" side="right" onClick={() => go(1)} />
            <span className="label-caps absolute bottom-3 right-3 rounded-sm bg-background/80 px-1.5 py-0.5 backdrop-blur">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {image.author && (
        <p className="label-caps text-muted">Photo: {image.author}</p>
      )}

      {many && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto">
          {list.map((img, index) => (
            <button
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={active === index}
              className={clsx(
                "relative size-16 shrink-0 overflow-hidden rounded-md bg-surface-secondary ring-1 transition sm:size-20",
                active === index
                  ? "ring-2 ring-foreground"
                  : "opacity-60 ring-separator hover:opacity-100",
              )}
              key={img.src + index}
              onClick={() => setActive(index)}
            >
              <Image
                alt=""
                className="object-contain p-1"
                fill
                sizes="80px"
                src={img.src}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function GalleryButton({
  label,
  side,
  onClick,
}: {
  label: string;
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={clsx(
        "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-lg shadow backdrop-blur transition hover:bg-background sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
        side === "left" ? "left-3" : "right-3",
      )}
      onClick={onClick}
    >
      <span aria-hidden="true">{side === "left" ? "←" : "→"}</span>
    </button>
  );
}
