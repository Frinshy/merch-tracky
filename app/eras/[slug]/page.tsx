import { Breadcrumbs } from "@heroui/react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { eraGradient } from "@/components/eras/era-artwork";
import { ItemGrid } from "@/components/items/item-grid";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stat } from "@/components/ui/stat";
import { eras, getEra, itemsInEra, neighbours, sortTypes } from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return eras.map((era) => ({ slug: era.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const era = getEra((await params).slug);

  if (!era) return {};

  return {
    title: `${era.name} era`,
    description: era.description,
    openGraph: era.cover ? { images: [era.cover] } : undefined,
  };
}

export default async function EraPage({ params }: Props) {
  const era = getEra((await params).slug);

  if (!era) notFound();

  // Oldest release first within an era reads like a timeline.
  const eraItems = itemsInEra(era.slug).sort((a, b) =>
    (a.releaseDate ?? a.addedAt).localeCompare(b.releaseDate ?? b.addedAt),
  );
  const types = sortTypes(eraItems.map((item) => item.type));
  const { prev, next } = neighbours(
    eras,
    eras.findIndex((e) => e.slug === era.slug),
  );

  return (
    <div className="flex flex-col gap-14 pt-8">
      <header
        className="-mx-4 grid items-end gap-8 overflow-hidden px-4 pb-10 pt-8 text-black sm:-mx-6 sm:rounded-xl sm:px-10 md:grid-cols-[minmax(0,1fr)_auto]"
        style={{ background: eraGradient(era.color, 135, 55) }}
      >
        <div>
          <Breadcrumbs className="label-caps text-black/60">
            <Breadcrumbs.Item href="/eras">Eras</Breadcrumbs.Item>
            <Breadcrumbs.Item>{era.year}</Breadcrumbs.Item>
          </Breadcrumbs>
          <h1 className="mt-6 font-display text-6xl leading-none sm:text-8xl">{era.name}</h1>
          {era.description && <p className="mt-4 max-w-xl text-black/75">{era.description}</p>}
          <dl className="mt-8 flex gap-8">
            <Stat label="Items" value={eraItems.length} />
            <Stat label="Formats" value={types.length} />
            <Stat label="Year" value={era.year} />
          </dl>
        </div>
        {era.cover && (
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/20 md:w-72">
            <Image
              fill
              preload
              alt={`${era.name} cover`}
              className="object-cover"
              sizes="(min-width: 768px) 18rem, 100vw"
              src={era.cover}
            />
          </div>
        )}
      </header>

      {types.length === 0 && <p className="text-muted">Nothing archived from this era yet.</p>}

      {types.map((type) => {
        const ofType = eraItems.filter((item) => item.type === type);

        return (
          <section key={type} className="flex flex-col gap-6">
            <SectionHeading
              action={{
                href: `/items?era=${era.slug}&type=${encodeURIComponent(type)}`,
                label: "Open in catalog",
              }}
              eyebrow={pluralize(ofType.length, "item")}
              title={type}
            />
            <ItemGrid items={ofType} showEra={false} />
          </section>
        );
      })}

      <div className="border-t border-separator pt-6">
        <PrevNextNav
          large
          label="Other eras"
          next={next && { href: `/eras/${next.slug}`, label: next.name }}
          nextCaption="Next era"
          prev={prev && { href: `/eras/${prev.slug}`, label: prev.name }}
          prevCaption="Previous era"
        />
      </div>
    </div>
  );
}
