"use client";

import { Button, Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const itemImages = [
  {
    alt: "NEO Home Robot",
    src: "/items/test.jpeg",
  },
  {
    alt: "NEO Home Robot",
    src: "/items/test.jpeg",
  },
  {
    alt: "NEO Home Robot",
    src: "/items/test.jpeg",
  },
];

function ItemGallery() {
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
          alt=""
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
              alt=""
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

export default function Item() {
  return (
    <div className="min-h-screen w-full">
      <nav aria-label="Item navigation" className="mb-4">
        <Link
          className="group inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-medium text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          href="/items"
        >
          <span
            aria-hidden="true"
            className="text-base transition-transform group-hover:-translate-x-0.5"
          >
            &#8592;
          </span>
          Back to search
        </Link>
      </nav>
      <div className="grid w-full gap-6 rounded-lg border border-separator bg-surface p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start lg:gap-10">
        <ItemGallery />
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-3 border-b border-separator pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Item details
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Item Name
            </h1>
            <p className="max-w-prose text-sm leading-6 text-muted-foreground">
              Item description goes here.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Inventory snapshot</h2>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Active
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="border border-separator bg-surface-secondary p-4 shadow-none transition hover:border-accent/50">
              <p className="text-sm font-medium text-muted">Type</p>
              <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Example Type
              </p>
            </Card>
            <Card className="border border-separator bg-surface-secondary p-4 shadow-none transition hover:border-accent/50">
              <p className="text-sm font-medium text-muted">Era</p>
              <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Example Era
              </p>
            </Card>
            <Card className="border border-separator bg-surface-secondary p-4 shadow-none transition hover:border-accent/50">
              <p className="text-sm font-medium text-muted">Status</p>
              <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Active
              </p>
            </Card>
            <Card className="border border-separator bg-surface-secondary p-4 shadow-none transition hover:border-accent/50">
              <p className="text-sm font-medium text-muted">Quantity</p>
              <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                42
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
