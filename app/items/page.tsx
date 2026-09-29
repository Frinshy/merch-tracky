"use client";

import { useState } from "react";
import { Button, Card, Label, SearchField } from "@heroui/react";
import { ItemSelector, type SelectorProps } from "@/components/item-selector";
import Image from "next/image";
import Link from "next/link";
import MerchItems from "@/data/merch-items.json";

export default function Items() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    type: "",
    era: "",
    sort: "",
  });

  const filteredItems = MerchItems.MerchItems.filter(
    (item) =>
      (!appliedFilters.type || item.type === appliedFilters.type) &&
      (!appliedFilters.era || item.era === appliedFilters.era),
  ).sort((firstItem, secondItem) => {
    if (appliedFilters.sort === "Name (Z-A)") {
      return secondItem.name.localeCompare(firstItem.name);
    }

    if (appliedFilters.sort === "Name (A-Z)") {
      return firstItem.name.localeCompare(secondItem.name);
    }

    return 0;
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters({
      type: selectedType,
      era: selectedEra,
      sort: selectedSort,
    });
  }

  return (
    <form className="min-h-screen w-full" onSubmit={handleSubmit}>
      <div className="lg:sticky lg:top-20 lg:z-20 flex w-full shrink-0 flex-col items-stretch gap-3 rounded bg-surface p-4 sm:top-16 sm:flex-row sm:items-end sm:gap-4 sm:p-5">
        <Search />
        <SortSelector value={selectedSort} onChange={setSelectedSort} />
      </div>
      <div className="mt-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(17.5rem,17.5rem)_minmax(0,1fr)]">
        <div className="flex h-fit min-w-0 w-full self-start flex-col gap-5 rounded bg-surface p-4 sm:p-5 lg:sticky lg:top-49 lg:min-w-70">
          <TypeSelector value={selectedType} onChange={setSelectedType} />
          <EraSelector value={selectedEra} onChange={setSelectedEra} />
          <Button className="self-end" type="submit">
            Submit
          </Button>
        </div>
        <div className="min-w-0 rounded bg-surface p-4 sm:p-5">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((merchItem) => (
              <ItemCard item={merchItem} key={merchItem.id} />
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}

export function ItemCard({
  item,
}: {
  item: (typeof MerchItems.MerchItems)[number];
}) {
  return (
    <Link className="block" href={"/items/" + item.id}>
      <Card className="group relative h-70 w-full overflow-hidden rounded shadow-md transition duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl focus-within:-translate-y-1 focus-within:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none">
        <Image
          alt={item.images[0].alt}
          className="object-contain transition duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={item.images[0].src}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85 transition duration-500 group-hover:from-black/15 group-hover:to-black/75 motion-reduce:transition-none" />

        <Card.Header className="absolute inset-x-4 top-4 z-10 w-fit rounded border border-default bg-surface/80 px-4 py-2 text-surface-foreground backdrop-blur-md">
          <Card.Title className="text-xs font-semibold tracking-[0.08em] text-surface-foreground">
            {item.name}
          </Card.Title>
        </Card.Header>

        <Card.Footer className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-5 pb-5 pt-14 text-white">
          <Button
            className="pointer-events-none ml-auto shrink-0 opacity-0 shadow-lg transition-[opacity,transform] duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-105 motion-reduce:transition-none"
            size="sm"
            variant="primary"
          >
            More
          </Button>
        </Card.Footer>
      </Card>
    </Link>
  );
}

const itemTypes = Array.from(
  new Set(MerchItems.MerchItems.map((item) => item.type)),
);
const itemEras = Array.from(
  new Set(MerchItems.MerchItems.map((item) => item.era)),
);

export function TypeSelector({ value, onChange }: SelectorProps) {
  return (
    <ItemSelector
      clearLabel="type filter"
      label="Type of item"
      onChange={onChange}
      options={itemTypes}
      placeholder="Select type..."
      value={value}
    />
  );
}

export function EraSelector({ value, onChange }: SelectorProps) {
  return (
    <ItemSelector
      clearLabel="era filter"
      label="Era of item"
      onChange={onChange}
      options={itemEras}
      value={value}
      placeholder="Select era..."
    />
  );
}

const sortOptions = ["Name (A-Z)", "Name (Z-A)"];

export function SortSelector({ value, onChange }: SelectorProps) {
  return (
    <ItemSelector
      clearLabel="sort"
      emptyOption="No sorting"
      onChange={onChange}
      options={sortOptions}
      placeholder="Sort..."
      selectorClassName="w-full max-w-40"
      value={value}
    />
  );
}

export function Search() {
  return (
    <SearchField className="w-full max-w-80" name="search" variant="secondary">
      <Label>Search</Label>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input className="w-full" placeholder="Search..." />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
