import { Button, Card, SearchField } from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";

import { CurrentEraSpotlight } from "@/components/eras/current-era-spotlight";
import { EraShowcase } from "@/components/eras/era-showcase";
import { ItemRail } from "@/components/items/item-rail";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  ARTIST,
  countByType,
  coverOf,
  currentEra,
  eras,
  items,
  newestFirst,
} from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";

const RECENT_COUNT = 10;

export default function HomePage() {
  const recent = newestFirst(items).slice(0, RECENT_COUNT);

  return (
    <div className="flex flex-col gap-16 pb-8 pt-8">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <p className="label-caps text-muted">Unofficial merch archive</p>
            <h1 className="type-display text-[clamp(4rem,15vw,8.5rem)] leading-[0.85]">
              {/* One word per line, like the name across the front of a tour shirt. */}
              {ARTIST.split(" ").map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </h1>
            <p className="type-display text-3xl leading-none text-muted sm:text-4xl">
              Every drop, every era.
            </p>
            <p className="max-w-md text-lg text-muted">
              Tour shirts, vinyl, CDs and one-off drops, catalogued by era. So far{" "}
              {pluralize(items.length, "item")} across {pluralize(eras.length, "era")}.
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
          title="New in the archive"
        />
        <ItemRail items={recent} label="Recently added items" preloadCount={5} />
      </section>

      <EraShowcase />

      <section className="flex flex-col gap-6">
        <SectionHeading title="Flip through by format" />
        {/* Styled like record-shop bin dividers: a tab with the format name. */}
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 pt-4 sm:grid-cols-3 lg:grid-cols-4">
          {countByType(items).map(({ type, count }) => (
            <li key={type}>
              <Card className="group relative gap-0 rounded-sm px-4 pb-4 pt-7 ring-1 ring-separator transition focus-within:ring-2 focus-within:ring-focus hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none">
                <Card.Header className="type-display absolute -top-4 left-3 rounded-t-sm bg-foreground px-3 pb-1 pt-1.5 text-lg leading-none text-background">
                  {type}
                </Card.Header>
                <Card.Content className="flex-row -space-x-6">
                  {newestFirst(items.filter((item) => item.type === type))
                    .slice(0, 3)
                    .map((item, index) => (
                      <span
                        key={item.id}
                        className="relative size-20 rounded-sm bg-surface-secondary shadow-md ring-1 ring-separator transition group-hover:translate-x-[calc(var(--i)*0.5rem)] motion-reduce:transition-none"
                        style={{ "--i": index, zIndex: 3 - index } as React.CSSProperties}
                      >
                        <Image
                          fill
                          alt=""
                          className="object-contain p-1.5"
                          sizes="80px"
                          src={coverOf(item).src}
                        />
                      </span>
                    ))}
                </Card.Content>
                <Card.Footer className="mt-3 text-sm text-muted">
                  {/*
                   * The ::after overlay makes the whole divider clickable. It lives here, not in
                   * the absolutely positioned tab, so it spans the card, and z-10 lifts it above
                   * the stacked covers.
                   */}
                  <NextLink
                    aria-label={`${type}, ${pluralize(count, "item")}`}
                    className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
                    href={`/items?type=${encodeURIComponent(type)}`}
                  >
                    {pluralize(count, "item")}
                  </NextLink>
                </Card.Footer>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
