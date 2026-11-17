import { buttonVariants } from "@heroui/styles";
import type { Metadata } from "next";

import { EraDot } from "@/components/eras/era-badge";
import { EraTimelineItem } from "@/components/eras/era-timeline-item";
import { PageHeader } from "@/components/ui/page-header";
import { currentEra, eras, items } from "@/lib/catalog/data";

export const metadata: Metadata = {
  title: "Eras",
  description: "Every Louis Tomlinson era in the archive, from the first solo singles to today.",
};

export default function ErasPage() {
  // Newest first: the current era is what most visitors are looking for.
  const timeline = [...eras].reverse();

  return (
    <div className="flex flex-col gap-16 pt-8">
      <PageHeader
        description="The archive is organised by era: each album cycle with its tours, singles and merch drops. Pick one to see everything from that time."
        eyebrow={`${eras.length} eras, ${items.length} items`}
        title="Eras"
      />

      <ol>
        {timeline.map((era) => (
          <EraTimelineItem key={era.slug} era={era} isCurrent={era.slug === currentEra?.slug} />
        ))}
      </ol>
    </div>
  );
}
