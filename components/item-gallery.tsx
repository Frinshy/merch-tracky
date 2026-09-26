"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

type GalleryItem = {
  id: string;
  images: {
    src: string;
    alt: string;
  }[];
};

export function ItemGallery({ item }: { item: GalleryItem }) {
  const itemImages = item.images;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = itemImages[activeIndex];

  const showPrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? itemImages.length - 1 : currentIndex - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === itemImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <section
      aria-label="Item images"
      className="flex min-w-0 flex-col items-center gap-3"
    >
      <div className="relative aspect-[3/4] w-full max-w-xl overflow-hidden rounded-lg border border-separator bg-surface-secondary shadow-sm">
        <Image
          alt={activeImage.alt}
          aria-hidden="true"
          className="scale-110 object-cover opacity-60 blur-2xl"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          src={activeImage.src}
        />
        <Image
          alt={activeImage.alt}
          className="relative z-10 object-contain"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          src={activeImage.src}
        />
        {itemImages.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 z-20 flex -translate-y-1/2 justify-between sm:inset-x-4">
            <Button
              aria-label="Show previous image"
              className="grid size-10 place-items-center rounded-full border border-separator bg-surface/85 text-lg text-surface-foreground shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-surface sm:size-11"
              isIconOnly
              onPress={showPrevious}
            >
              <span aria-hidden="true">&#8592;</span>
            </Button>
            <Button
              aria-label="Show next image"
              className="grid size-10 place-items-center rounded-full border border-separator bg-surface/85 text-lg text-surface-foreground shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-surface sm:size-11"
              isIconOnly
              onPress={showNext}
            >
              <span aria-hidden="true">&#8594;</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex min-w-0 max-w-full touch-pan-x gap-3 overflow-x-auto pb-1">
        {itemImages.map((image, index) => (
          <Button
            aria-label={`Show image ${index + 1}`}
            aria-pressed={activeIndex === index}
            className={`relative aspect-[3/4] h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-md border bg-surface-secondary transition hover:-translate-y-0.5 sm:h-32 sm:w-24 ${
              activeIndex === index
                ? "border-accent ring-2 ring-accent/30"
                : "border-separator opacity-70 hover:opacity-100"
            }`}
            key={image.src + " " + index}
            onPress={() => setActiveIndex(index)}
          >
            <Image
              alt=""
              aria-hidden="true"
              className="scale-110 object-cover opacity-60 blur-xl"
              fill
              sizes="96px"
              src={image.src}
            />
            <Image
              alt={image.alt}
              className="relative z-10 object-contain"
              fill
              sizes="96px"
              src={image.src}
            />
          </Button>
        ))}
      </div>
    </section>
  );
}
