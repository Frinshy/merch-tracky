import Image from "next/image";
import Link from "next/link";

import { SearchIcon } from "@/components/icons";
import { ItemGrid } from "@/components/item-card";
import { SectionHeading } from "@/components/section-heading";
import {
  ARTIST,
  allTypes,
  eraStats,
  eras,
  items,
  itemsInEra,
  newestFirst,
} from "@/lib/catalog";

const recent = newestFirst(items).slice(0, 10);
const currentEra = eras[eras.length - 1];
const formatCounts = allTypes.map((type) => ({
  type,
  count: items.filter((i) => i.type === type).length,
}));

export default function Home() {
  const spotlight = currentEra
    ? newestFirst(itemsInEra(currentEra.slug)).slice(0, 5)
    : [];

  return (
    <div className="flex flex-col gap-20 pb-8 pt-12 sm:pt-20">
      {/* Hero */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="label-caps text-accent">
            Unofficial archive · {ARTIST}
          </p>
          <h1 className="max-w-5xl text-balance font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Every release, <em className="text-muted">from every era.</em>
          </h1>
          <p className="label-caps text-muted">
            {items.length} items · {eras.length} eras · {allTypes.length}{" "}
            formats
          </p>
        </div>
        <form
          action="/items"
          className="flex w-full max-w-2xl items-center gap-3 rounded-lg border border-separator bg-surface px-4 transition focus-within:border-foreground/40"
          role="search"
        >
          <SearchIcon className="size-5 shrink-0 text-muted" />
          <label className="sr-only" htmlFor="home-search">
            Search the catalog
          </label>
          <input
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
            id="home-search"
            name="q"
            placeholder="Search vinyl, shirts, tour merch…"
            type="search"
          />
          <button
            className="shrink-0 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
            type="submit"
          >
            Search
          </button>
        </form>
      </section>

      {/* Recently added */}
      <section className="flex flex-col gap-6">
        <SectionHeading
          action={{ href: "/items", label: "View full catalog" }}
          eyebrow="Recently added"
          title="New in the archive"
        />
        <ItemGrid items={recent} />
      </section>

      {/* Current era spotlight */}
      {currentEra && spotlight.length > 0 && (
        <section
          className="-mx-4 flex flex-col gap-8 px-4 py-10 sm:-mx-6 sm:rounded-lg sm:px-8"
          style={{
            background: `linear-gradient(160deg, color-mix(in oklab, ${currentEra.color} 28%, transparent), transparent 70%)`,
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-6">
              {currentEra.cover && (
                <div className="relative hidden size-32 shrink-0 overflow-hidden rounded-md shadow-xl ring-1 ring-separator sm:block">
                  <Image
                    alt={`${currentEra.name} cover`}
                    className="object-cover"
                    fill
                    sizes="8rem"
                    src={currentEra.cover}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="label-caps flex items-center gap-2 text-muted">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ backgroundColor: currentEra.color }}
                  />
                  Current era · {currentEra.year}
                </p>
                <h2 className="font-display text-5xl leading-none sm:text-6xl">
                  {currentEra.name}
                </h2>
                {currentEra.description && (
                  <p className="max-w-lg text-muted">
                    {currentEra.description}
                  </p>
                )}
              </div>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
              href={`/eras/${currentEra.slug}`}
              style={{ backgroundColor: currentEra.color }}
            >
              All {eraStats(currentEra.slug).count} items{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ItemGrid items={spotlight} showEra={false} />
        </section>
      )}

      {/* Index: by era / by format */}
      <section className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SectionHeading
            action={{ href: "/eras", label: "All eras" }}
            eyebrow="Browse"
            title="By era"
          />
          <ul className="divide-y divide-separator">
            {[...eras].reverse().map((era) => (
              <li key={era.slug}>
                <IndexRow
                  count={eraStats(era.slug).count}
                  href={`/eras/${era.slug}`}
                  meta={String(era.year)}
                >
                  {era.cover ? (
                    <span
                      className="relative size-8 shrink-0 overflow-hidden rounded-sm ring-2"
                      style={{ ["--tw-ring-color" as string]: era.color }}
                    >
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="2rem"
                        src={era.cover}
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: era.color }}
                    />
                  )}
                  {era.name}
                </IndexRow>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <SectionHeading
            action={{ href: "/items", label: "Catalog" }}
            eyebrow="Browse"
            title="By format"
          />
          <ul className="divide-y divide-separator">
            {formatCounts.map(({ type, count }) => (
              <li key={type}>
                <IndexRow
                  count={count}
                  href={`/items?type=${encodeURIComponent(type)}`}
                >
                  {type}
                </IndexRow>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function IndexRow({
  href,
  count,
  meta,
  children,
}: {
  href: string;
  count: number;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="group flex items-center gap-3 py-3 transition hover:pl-1"
      href={href}
    >
      <span className="flex flex-1 items-center gap-2.5 font-display text-2xl">
        {children}
      </span>
      {meta && <span className="label-caps text-muted">{meta}</span>}
      <span className="label-caps w-16 text-right text-muted">
        {count} {count === 1 ? "item" : "items"}
      </span>
      <span
        aria-hidden="true"
        className="text-muted transition group-hover:translate-x-1 group-hover:text-foreground"
      >
        →
      </span>
    </Link>
  );
}
