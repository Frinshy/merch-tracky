import { Button, SearchField } from "@heroui/react";
import Image from "next/image";

import { CurrentEraSpotlight } from "@/components/eras/current-era-spotlight";
import { EraDot } from "@/components/eras/era-badge";
import { ItemRail } from "@/components/items/item-rail";
import { IndexList } from "@/components/ui/index-list";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  ARTIST,
  allTypes,
  countByType,
  currentEra,
  eras,
  items,
  itemsInEra,
  newestFirst,
} from "@/lib/catalog/data";

const RECENT_COUNT = 10;

export default function HomePage() {
  const recent = newestFirst(items).slice(0, RECENT_COUNT);

  return (
    <div className="flex flex-col gap-20 pb-8 pt-10 sm:pt-16">
      <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="label-caps text-accent">Unofficial archive · {ARTIST}</p>
            <h1 className="text-balance font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl xl:text-8xl">
              Every release, <em className="text-muted">from every era.</em>
            </h1>
            <p className="label-caps text-muted">
              {items.length} items · {eras.length} eras · {allTypes.length} formats
            </p>
          </div>

          {/* A plain GET form: works without JavaScript and lands on /items?q=… */}
          <form action="/items" className="flex w-full max-w-xl items-center gap-2" role="search">
            <SearchField fullWidth aria-label="Search the catalog" className="flex-1" name="q">
              <SearchField.Group className="h-12">
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Search vinyl, shirts, tour merch…" />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            {/* On small screens the keyboard's enter key submits; save the width. */}
            <Button className="hidden h-12 sm:inline-flex" type="submit">
              Search
            </Button>
          </form>
        </section>

        {currentEra && <CurrentEraSpotlight era={currentEra} />}
      </div>

      <section className="flex flex-col gap-6">
        <SectionHeading
          action={{ href: "/items", label: "View full catalog" }}
          eyebrow="Recently added"
          title="New in the archive"
        />
        <ItemRail items={recent} label="Recently added items" preloadCount={5} />
      </section>

      <section className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SectionHeading
            action={{ href: "/eras", label: "All eras" }}
            eyebrow="Browse"
            title="By era"
          />
          <IndexList
            entries={[...eras].reverse().map((era) => ({
              href: `/eras/${era.slug}`,
              label: era.name,
              meta: String(era.year),
              count: itemsInEra(era.slug).length,
              leading: era.cover ? (
                <span
                  className="relative size-8 shrink-0 overflow-hidden rounded-md ring-2"
                  style={{ "--tw-ring-color": era.color } as React.CSSProperties}
                >
                  <Image fill alt="" className="object-cover" sizes="2rem" src={era.cover} />
                </span>
              ) : (
                <EraDot className="size-2.5" color={era.color} />
              ),
            }))}
          />
        </div>
        <div className="flex flex-col gap-4">
          <SectionHeading
            action={{ href: "/items", label: "Catalog" }}
            eyebrow="Browse"
            title="By format"
          />
          <IndexList
            entries={countByType(items).map(({ type, count }) => ({
              href: `/items?type=${encodeURIComponent(type)}`,
              label: type,
              count,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
