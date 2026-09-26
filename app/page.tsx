import { Card, Chip } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import MerchItems from "@/data/merch-items.json";

const items = MerchItems.MerchItems;
const formats = new Set(items.map((item) => item.type));
const eras = new Set(items.map((item) => item.era));
const latestItems = items.slice(0, 4);

export default function Home() {
  return (
    <section className="flex flex-col gap-6 pb-16 pt-4 md:gap-8 md:pt-8">
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-accent">Artist merch archive</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Find every release, from every era.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
          A public catalog for discovering this artist&apos;s merch by release,
          format, and era.
        </p>
      </header>

      <Link
        className="group relative overflow-hidden rounded-xl bg-accent p-6 text-accent-foreground shadow-lg transition hover:shadow-xl sm:p-10"
        href="/items"
      >
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <Chip
              className="bg-accent-foreground/15 text-accent-foreground"
              variant="soft"
            >
              Search the archive
            </Chip>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              What are you looking for?
            </h2>
            <p className="mt-2 max-w-xl text-accent-foreground/75">
              Search by name, then narrow results by merch format or era.
            </p>
          </div>
          <span className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-accent-foreground px-5 text-sm font-semibold text-accent transition group-hover:translate-x-1">
            Open search{" "}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </span>
        </div>
        <div className="absolute -right-14 -top-24 size-72 rounded-full border-[28px] border-accent-foreground/10" />
      </Link>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          [items.length, "Released items"],
          [formats.size, "Merch formats"],
          [eras.size, "Eras covered"],
          [latestItems.length, "Latest releases"],
        ].map(([value, label]) => (
          <Card
            key={label}
            className="border border-separator bg-surface p-4 shadow-sm sm:p-5"
          >
            <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {value}
            </p>
            <p className="mt-2 text-sm text-muted">{label}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Recently added</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Latest merch additions
          </h2>
        </div>
        <Link
          className="hidden text-sm font-medium text-accent hover:underline sm:block"
          href="/items"
        >
          View all<span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {latestItems.map((item) => (
          <Link className="group" href={`/items/${item.id}`} key={item.id}>
            <Card className="h-full overflow-hidden border border-separator bg-surface shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-secondary">
                <Image
                  alt={item.images[0].alt}
                  className="object-contain p-4 transition duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  src={item.images[0].src}
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {item.type} · {item.era}
                </p>
                <h3 className="mt-2 font-semibold group-hover:text-accent">
                  {item.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted">
                  {item.description}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Link
          className="text-sm font-medium text-accent hover:underline"
          href="/items"
        >
          Browse all releases <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
