import NextLink from "next/link";

import { TextLink } from "@/components/ui/text-link";
import { ARTIST, eras, itemsInEra } from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";

/**
 * The eras listed like the dates on the back of a tour shirt:
 * year, era name and item count, newest first.
 */
export function EraTourList() {
  const timeline = [...eras].reverse();

  return (
    <section aria-labelledby="era-tour-heading" className="py-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <p className="label-caps text-muted">{ARTIST}</p>
          <h2 className="type-display text-6xl leading-[0.85] sm:text-8xl" id="era-tour-heading">
            The eras
          </h2>
        </header>

        <ol className="w-full">
          {timeline.map((era) => (
            <li key={era.slug} className="border-t border-separator last:border-b">
              <NextLink
                className="group grid grid-cols-[0.375rem_3.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:grid-cols-[0.375rem_5rem_minmax(0,1fr)_auto]"
                href={`/eras/${era.slug}`}
              >
                {/* Era colour as a bar: some era colours are too pale for text on light. */}
                <span
                  aria-hidden="true"
                  className="h-6 self-center rounded-full sm:h-9"
                  style={{ backgroundColor: era.color }}
                />
                <span className="type-display text-2xl text-muted sm:text-3xl">{era.year}</span>
                <span className="type-display text-3xl leading-none decoration-2 underline-offset-4 group-hover:underline sm:text-5xl">
                  {era.name}
                </span>
                <span className="label-caps text-muted">
                  {pluralize(itemsInEra(era.slug).length, "item")}
                </span>
              </NextLink>
            </li>
          ))}
        </ol>

        <TextLink arrow="forward" href="/eras">
          Read about each era
        </TextLink>
      </div>
    </section>
  );
}
