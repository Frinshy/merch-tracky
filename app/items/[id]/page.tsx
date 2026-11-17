import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EraBadge } from "@/components/era-badge";
import { ItemGallery } from "@/components/item-gallery";
import { ItemGrid } from "@/components/item-card";
import { SectionHeading } from "@/components/section-heading";
import {
  catalogNumber,
  coverOf,
  formatDate,
  getEra,
  getItem,
  items,
  itemsInEra,
} from "@/lib/catalog";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return items.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getItem((await params).id);

  if (!item) return {};

  return {
    title: item.name,
    description: item.description || `${item.type} from the ${getEra(item.era)?.name ?? item.era} era.`,
    openGraph: { images: [coverOf(item).src] },
  };
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const item = getItem(id);

  if (!item) notFound();

  const era = getEra(item.era);
  const eraItems = itemsInEra(item.era);
  const position = eraItems.findIndex((i) => i.id === item.id);
  const prev = eraItems[position - 1];
  const next = eraItems[position + 1];
  const related = eraItems.filter((i) => i.id !== item.id).slice(0, 5);

  const details: [string, React.ReactNode][] = [
    ["Format", item.type],
    ["Era", <EraBadge key="era" slug={item.era} />],
    ["Edition", item.edition],
    ["Released", formatDate(item.releaseDate)],
    ["Sold via", item.source],
    ["Region", item.region],
    ["Original price", item.price],
    ["Limited", item.limited ? "Yes" : undefined],
    ["Added to archive", formatDate(item.addedAt)],
  ];

  return (
    <div className="flex flex-col gap-20 pt-8">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="label-caps mb-6 flex flex-wrap gap-2 text-muted"
        >
          <Link className="hover:text-foreground" href="/items">
            Catalog
          </Link>
          <span aria-hidden="true">/</span>
          {era ? (
            <Link className="hover:text-foreground" href={`/eras/${era.slug}`}>
              {era.name}
            </Link>
          ) : (
            <span>{item.era}</span>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-foreground">No. {catalogNumber(item.id)}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <ItemGallery images={item.images} name={item.name} />

          <div className="flex min-w-0 flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-4">
              {item.limited && (
                <span className="label-caps w-fit rounded-sm bg-foreground px-1.5 py-0.5 text-background">
                  Limited
                </span>
              )}
              <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">
                {item.name}
              </h1>
              {item.description && (
                <p className="max-w-prose leading-7 text-muted">
                  {item.description}
                </p>
              )}
            </div>

            <dl className="divide-y divide-separator border-y border-separator">
              {details
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div
                    className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-sm"
                    key={label}
                  >
                    <dt className="label-caps self-center text-muted">
                      {label}
                    </dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>

            {item.tags && item.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      className="rounded-full border border-separator px-3 py-1 text-xs text-muted hover:border-foreground/40 hover:text-foreground"
                      href={`/items?q=${encodeURIComponent(tag)}`}
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {(prev || next) && (
              <nav
                aria-label={`More from ${era?.name ?? "this era"}`}
                className="grid grid-cols-2 gap-4 text-sm"
              >
                {prev ? (
                  <Link
                    className="text-muted hover:text-foreground"
                    href={`/items/${prev.id}`}
                  >
                    <span className="label-caps block">← Previous</span>
                    <span className="line-clamp-1 text-foreground">
                      {prev.name}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    className="text-right text-muted hover:text-foreground"
                    href={`/items/${next.id}`}
                  >
                    <span className="label-caps block">Next →</span>
                    <span className="line-clamp-1 text-foreground">
                      {next.name}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && era && (
        <section className="flex flex-col gap-6">
          <SectionHeading
            action={{ href: `/eras/${era.slug}`, label: `All ${era.name} items` }}
            eyebrow="Same era"
            title={`More from ${era.name}`}
          />
          <ItemGrid items={related} showEra={false} />
        </section>
      )}
    </div>
  );
}
