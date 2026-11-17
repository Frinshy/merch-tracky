import Image from "next/image";
import Link from "next/link";

import { SearchIcon } from "@/components/icons";
import { ItemGrid } from "@/components/item-card";
import { SectionHeading } from "@/components/section-heading";
import {
  ARTIST,
  allTypes,
  eraCover,
  eras,
  items,
  itemsInEra,
  newestFirst,
} from "@/lib/catalog";

const recent = newestFirst(items).slice(0, 10);

export default function Home() {
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
        <div className="flex flex-wrap gap-2">
          {allTypes.map((type) => (
            <Link
              className="rounded-full border border-separator px-3 py-1 text-sm text-muted transition hover:border-foreground/40 hover:text-foreground"
              href={`/items?type=${encodeURIComponent(type)}`}
              key={type}
            >
              {type}
            </Link>
          ))}
        </div>
      </section>

      {/* Eras */}
      <section className="flex flex-col gap-6" id="eras">
        <SectionHeading
          eyebrow={`${eras.length} eras`}
          title="Browse by era"
        />
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eras.map((era) => {
            const count = itemsInEra(era.slug).length;
            const cover = eraCover(era);

            return (
              <li key={era.slug}>
                <Link
                  className="group relative flex aspect-[16/9] flex-col sm:aspect-[4/5] justify-end overflow-hidden rounded-lg p-5 ring-1 ring-separator"
                  href={`/eras/${era.slug}`}
                  style={{ backgroundColor: era.color }}
                >
                  {cover && (
                    <Image
                      alt=""
                      className="object-cover opacity-40 mix-blend-luminosity transition duration-700 group-hover:scale-105 group-hover:opacity-60 motion-reduce:transition-none"
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      src={cover}
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${era.color} 10%, transparent 70%)`,
                    }}
                  />
                  <div className="relative flex flex-col gap-1 text-black">
                    <span className="label-caps opacity-70">{era.year}</span>
                    <span className="font-display text-4xl leading-none">
                      {era.name}
                    </span>
                    <span className="mt-2 text-sm opacity-70">
                      {count} {count === 1 ? "item" : "items"}{" "}
                      <span
                        aria-hidden="true"
                        className="inline-block transition group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Recently added */}
      <section className="flex flex-col gap-6">
        <SectionHeading
          action={{ href: "/items?sort=added", label: "View full catalog" }}
          eyebrow="Recently added"
          title="New in the archive"
        />
        <ItemGrid items={recent} />
      </section>
    </div>
  );
}
