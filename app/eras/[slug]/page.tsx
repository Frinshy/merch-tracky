import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ItemGrid } from "@/components/item-card";
import { SectionHeading } from "@/components/section-heading";
import { eras, getEra, itemsInEra, sortTypes } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return eras.map((era) => ({ slug: era.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const era = getEra((await params).slug);

  return era
    ? { title: `${era.name} era`, description: era.description }
    : {};
}

export default async function EraPage({ params }: Props) {
  const { slug } = await params;
  const era = getEra(slug);

  if (!era) notFound();

  const eraItems = itemsInEra(era.slug).sort((a, b) =>
    (a.releaseDate ?? a.addedAt).localeCompare(b.releaseDate ?? b.addedAt),
  );
  const types = sortTypes(eraItems.map((item) => item.type));
  const index = eras.findIndex((e) => e.slug === era.slug);
  const prev = eras[index - 1];
  const next = eras[index + 1];

  return (
    <div className="flex flex-col gap-14 pt-8">
      <header
        className="relative -mx-4 overflow-hidden px-4 pb-10 pt-12 sm:-mx-6 sm:rounded-lg sm:px-10"
        style={{
          background: `linear-gradient(135deg, ${era.color}, color-mix(in oklab, ${era.color} 55%, black))`,
        }}
      >
        <nav aria-label="Breadcrumb" className="label-caps text-black/60">
          <Link className="hover:text-black" href="/#eras">
            Eras
          </Link>{" "}
          / {era.year}
        </nav>
        <h1 className="mt-6 font-display text-6xl leading-none text-black sm:text-8xl">
          {era.name}
        </h1>
        {era.description && (
          <p className="mt-4 max-w-xl text-black/75">{era.description}</p>
        )}
        <dl className="mt-8 flex gap-8 text-black">
          <Stat label="Items" value={eraItems.length} />
          <Stat label="Formats" value={types.length} />
          <Stat label="Year" value={era.year} />
        </dl>
      </header>

      {types.length === 0 && (
        <p className="text-muted">Nothing archived from this era yet.</p>
      )}

      {types.map((type) => {
        const ofType = eraItems.filter((item) => item.type === type);

        return (
          <section className="flex flex-col gap-6" key={type}>
            <SectionHeading
              action={{
                href: `/items?era=${era.slug}&type=${encodeURIComponent(type)}`,
                label: "Open in catalog",
              }}
              eyebrow={`${ofType.length} ${ofType.length === 1 ? "item" : "items"}`}
              title={type}
            />
            <ItemGrid items={ofType} showEra={false} />
          </section>
        );
      })}

      <nav
        aria-label="Other eras"
        className="grid grid-cols-2 gap-4 border-t border-separator pt-6 text-sm"
      >
        {prev ? (
          <Link className="group text-muted hover:text-foreground" href={`/eras/${prev.slug}`}>
            <span className="label-caps block">← Previous era</span>
            <span className="font-display text-2xl text-foreground">
              {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            className="group text-right text-muted hover:text-foreground"
            href={`/eras/${next.slug}`}
          >
            <span className="label-caps block">Next era →</span>
            <span className="font-display text-2xl text-foreground">
              {next.name}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <dt className="label-caps opacity-60">{label}</dt>
      <dd className="font-display text-3xl">{value}</dd>
    </div>
  );
}
