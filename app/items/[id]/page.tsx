import { Chip } from "@heroui/react";
import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { ItemDetails } from "@/components/items/item-details";
import { ItemGallery } from "@/components/items/item-gallery";
import { ItemRail } from "@/components/items/item-rail";
import { LimitedSticker } from "@/components/items/limited-sticker";
import { PrevNextNav } from "@/components/ui/prev-next-nav";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { coverOf, getEra, getItem, items, itemsInEra, neighbours } from "@/lib/catalog/data";

type Props = { params: Promise<{ id: string }> };

const RELATED_COUNT = 10;

export const dynamicParams = false;

export function generateStaticParams() {
  return items.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getItem((await params).id);

  if (!item) return {};
  const eraName = getEra(item.era)?.name ?? item.era;

  return {
    title: item.name,
    description: item.description || `${item.type} from the ${eraName} era.`,
    openGraph: { images: [coverOf(item).src] },
  };
}

export default async function ItemPage({ params }: Props) {
  const item = getItem((await params).id);

  if (!item) notFound();

  const era = getEra(item.era);
  const eraItems = itemsInEra(item.era);
  const { prev, next } = neighbours(
    eraItems,
    eraItems.findIndex((i) => i.id === item.id),
  );
  const related = eraItems.filter((i) => i.id !== item.id).slice(0, RELATED_COUNT);

  return (
    <div className="flex flex-col gap-16 pt-8">
      <div className="flex flex-col gap-6">
        <TextLink
          arrow="back"
          className="label-caps self-start"
          href={era ? `/eras/${era.slug}` : "/items"}
        >
          {era?.name ?? "Catalog"}
        </TextLink>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div className="relative min-w-0">
            <ItemGallery images={item.images} name={item.name} />
            {item.limited && (
              <LimitedSticker className="absolute -right-3 -top-3 size-20 text-sm" />
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4">
              <h1 className="type-display text-balance text-6xl leading-[0.85] sm:text-7xl">
                {item.name}
              </h1>
              {item.description && (
                <p className="max-w-prose leading-7 text-muted">{item.description}</p>
              )}
            </div>

            <ItemDetails item={item} />

            {item.tags && item.tags.length > 0 && (
              <ul aria-label="Tags" className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <NextLink
                      className="focus-outline block rounded-sm"
                      href={`/items?q=${encodeURIComponent(tag)}`}
                    >
                      <Chip
                        className="label-caps rounded-sm hover:opacity-80"
                        size="sm"
                        variant="secondary"
                      >
                        #{tag}
                      </Chip>
                    </NextLink>
                  </li>
                ))}
              </ul>
            )}

            <PrevNextNav
              label={`More from ${era?.name ?? "this era"}`}
              next={next && { href: `/items/${next.id}`, label: next.name }}
              prev={prev && { href: `/items/${prev.id}`, label: prev.name }}
            />
          </div>
        </div>
      </div>

      {era && related.length > 0 && (
        <section className="flex flex-col gap-6">
          <SectionHeading
            action={{ href: `/eras/${era.slug}`, label: `All ${era.name} items` }}
            title={`More from ${era.name}`}
          />
          <ItemRail items={related} label={`More from ${era.name}`} showEra={false} />
        </section>
      )}
    </div>
  );
}
