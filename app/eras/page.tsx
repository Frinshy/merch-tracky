import type { Metadata } from "next";

import { EraDot } from "@/components/eras/era-badge";
import { EraTimelineItem } from "@/components/eras/era-timeline-item";
import { currentEra, eras, items } from "@/lib/catalog/data";

export const metadata: Metadata = {
  title: "Eras",
  description: "Every Louis Tomlinson era in the archive, from the first solo singles to today.",
};

export default function ErasPage() {
  // Newest first: the current era is what most visitors are looking for.
  const timeline = [...eras].reverse();

  return (
    <div className="flex flex-col gap-12 pt-8">
      <header className="flex flex-col gap-3">
        <p className="label-caps text-muted">
          {eras.length} eras · {items.length} items
        </p>
        <h1 className="font-display text-6xl leading-none sm:text-7xl">Eras</h1>
        <p className="max-w-xl text-muted">
          The archive is organised by era: each album cycle with its tours, singles and merch drops.
          Pick one to see everything from that time.
        </p>
      </header>

      <nav
        aria-label="Jump to era"
        className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        {timeline.map((era) => (
          <a
            key={era.slug}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-separator px-3 text-sm text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
            href={`#${era.slug}`}
          >
            <EraDot color={era.color} />
            {era.name}
            <span className="label-caps opacity-60">{era.year}</span>
          </a>
        ))}
      </nav>

      <ol>
        {timeline.map((era) => (
          <EraTimelineItem key={era.slug} era={era} isCurrent={era.slug === currentEra?.slug} />
        ))}
      </ol>
    </div>
  );
}
