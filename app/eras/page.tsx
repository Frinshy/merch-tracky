import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { eraCover, eraStats, eras, items } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Eras",
  description:
    "Every Louis Tomlinson era in the archive, from the first solo singles to today.",
};

export default function ErasPage() {
  // Newest era first: it's the one most visitors are looking for.
  const timeline = [...eras].reverse();

  return (
    <div className="flex flex-col gap-12 pt-8">
      <header className="flex flex-col gap-3">
        <p className="label-caps text-muted">
          {eras.length} eras · {items.length} items
        </p>
        <h1 className="font-display text-6xl leading-none sm:text-7xl">
          Eras
        </h1>
        <p className="max-w-xl text-muted">
          The archive is organised by era: each album cycle with its tours,
          singles and merch drops. Pick one to see everything from that time.
        </p>
      </header>

      {/* Jump links */}
      <nav
        aria-label="Jump to era"
        className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        {timeline.map((era) => (
          <a
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-separator px-3 text-sm text-muted transition hover:border-foreground/40 hover:text-foreground"
            href={`#${era.slug}`}
            key={era.slug}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: era.color }}
            />
            {era.name}
            <span className="label-caps opacity-60">{era.year}</span>
          </a>
        ))}
      </nav>

      <ol className="relative flex flex-col">
        {timeline.map((era, index) => {
          const { count, formats, covers } = eraStats(era.slug);
          const hero = eraCover(era);

          return (
            <li
              className="relative grid gap-6 border-t border-separator py-10 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-10"
              id={era.slug}
              key={era.slug}
            >
              {/* Year column with timeline dot */}
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full ring-4 ring-background"
                  style={{ backgroundColor: era.color }}
                />
                <span className="font-display text-4xl leading-none text-muted md:text-5xl">
                  {era.year}
                </span>
                {index === 0 && (
                  <span className="label-caps rounded-sm bg-foreground px-1.5 py-0.5 text-background">
                    Current
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-5xl leading-[0.95] sm:text-6xl">
                  <Link className="hover:underline" href={`/eras/${era.slug}`}>
                    {era.name}
                  </Link>
                </h2>
                {era.description && (
                  <p className="max-w-md text-muted">{era.description}</p>
                )}
                <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div>
                    <dt className="label-caps text-muted">Items</dt>
                    <dd className="font-display text-3xl">{count}</dd>
                  </div>
                  {formats.map(({ type, count }) => (
                    <div key={type}>
                      <dt className="label-caps text-muted">{type}</dt>
                      <dd className="font-display text-3xl">{count}</dd>
                    </div>
                  ))}
                </dl>
                <Link
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                  href={`/eras/${era.slug}`}
                  style={{ backgroundColor: era.color }}
                >
                  Explore {era.name} <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Visual */}
              <Link
                aria-label={`Explore ${era.name}`}
                className="group relative block aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-separator"
                href={`/eras/${era.slug}`}
                style={{
                  background: `linear-gradient(135deg, ${era.color}, color-mix(in oklab, ${era.color} 45%, black))`,
                }}
              >
                {era.cover ? (
                  <>
                    {/* Blurred backdrop so square covers fill the wide panel. */}
                    <Image
                      alt=""
                      className="scale-125 object-cover opacity-70 blur-2xl"
                      fill
                      sizes="10vw"
                      src={era.cover}
                    />
                    <div className="absolute inset-[8%] transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none">
                      <Image
                        alt={`${era.name} cover`}
                        className="object-contain drop-shadow-2xl"
                        fill
                        sizes="(min-width: 768px) 35vw, 90vw"
                        src={era.cover}
                      />
                    </div>
                  </>
                ) : covers.length > 1 ? (
                  <div className="absolute inset-0 grid grid-cols-2 gap-px p-px">
                    {covers.slice(0, 4).map((src) => (
                      <div
                        className="relative overflow-hidden bg-black/10"
                        key={src}
                      >
                        <Image
                          alt=""
                          className="object-contain p-3 transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                          fill
                          sizes="(min-width: 768px) 20vw, 50vw"
                          src={src}
                        />
                      </div>
                    ))}
                  </div>
                ) : hero ? (
                  <Image
                    alt=""
                    className="object-contain p-6 transition duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    src={hero}
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-display text-2xl text-black/50">
                    Nothing archived yet
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
