import { linkVariants } from "@heroui/styles";
import clsx from "clsx";
import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { EraArtwork, eraGradient } from "@/components/eras/era-artwork";
import { ItemGrid } from "@/components/items/item-grid";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyMessage } from "@/components/ui/empty-message";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stat } from "@/components/ui/stat";
import { eraStats, eras, getEra, itemsInEra, neighbours, sortTypes } from "@/lib/catalog/data";
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
  const { photos } = eraStats(era.slug);
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
          <NextLink
            className={clsx(
              linkVariants().base(),
              "gap-1.5 font-normal text-black/70 hover:text-black",
            )}
            href="/eras"
          >
            <ArrowLeftIcon size={14} />
            All eras
          </NextLink>
          <h1 className="mt-6 font-display text-6xl leading-none sm:text-8xl">{era.name}</h1>
          {era.description && <p className="mt-4 max-w-xl text-black/75">{era.description}</p>}
          <dl className="mt-8 flex gap-8">
            <Stat label="Items" value={eraItems.length} />
            <Stat label="Formats" value={types.length} />
            <Stat label="Year" value={era.year} />
          </dl>
        </div>
        {(era.cover || photos.length > 0) && (
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-xl bg-black/10 shadow-2xl ring-1 ring-black/20 md:w-72">
            <EraArtwork preload era={era} photos={photos} sizes="(min-width: 768px) 18rem, 100vw" />
          </div>
        )}
      </header>

      {types.length === 0 && (
        <EmptyMessage
          action={
            <ButtonLink href="/items" variant="secondary">
              Browse the catalog
            </ButtonLink>
          }
          description="Items from this era will show up here once they're added."
          title="Nothing archived yet"
        />
      )}

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
