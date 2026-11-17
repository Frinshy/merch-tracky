"use client";

import type { Key, Selection } from "@heroui/react";
import {
  Label,
  ListBox,
  SearchField,
  Select,
  Separator,
  Tag,
  TagGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";

import { EraDot } from "@/components/eras/era-badge";
import { GridIcon, ListIcon } from "@/components/ui/icons";
import { allSources, allTypes, eras } from "@/lib/catalog/data";
import {
  SORT_OPTIONS,
  type CatalogFilters,
  type CatalogView,
  type SortKey,
} from "@/lib/catalog/filters";

const toStrings = (keys: Selection | Set<Key>) => (keys === "all" ? [] : Array.from(keys, String));

export function CatalogToolbar({
  filters,
  autoFocus,
  onChange,
}: {
  filters: CatalogFilters;
  autoFocus?: boolean;
  onChange: (patch: Partial<CatalogFilters>) => void;
}) {
  return (
    <div className="sticky top-14 z-30 -mx-4 flex flex-col gap-3 border-b border-separator bg-background/90 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6">
      <div className="flex items-end gap-2">
        <SearchField
          fullWidth
          aria-label="Search the catalog"
          autoFocus={autoFocus}
          className="flex-1"
          value={filters.query}
          onChange={(query) => onChange({ query })}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search name, edition, tags…" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Select
          aria-label="Sort by"
          className="w-44 shrink-0"
          value={filters.sort}
          onChange={(key) => key && onChange({ sort: key as SortKey })}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                <ListBox.Item key={key} id={key} textValue={label}>
                  {label}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <ToggleButtonGroup
          disallowEmptySelection
          aria-label="Layout"
          className="hidden sm:flex"
          selectedKeys={[filters.view]}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const [view] = toStrings(keys);

            if (view) onChange({ view: view as CatalogView });
          }}
        >
          <ToggleButton isIconOnly aria-label="Grid view" id="grid">
            <GridIcon size={16} />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label="List view" id="list">
            <ToggleButtonGroup.Separator />
            <ListIcon size={16} />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="scrollbar-none -mx-4 flex items-center gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterGroup
          label="Era"
          selected={filters.eras}
          onChange={(selected) => onChange({ eras: selected })}
        >
          {eras.map((era) => (
            <Tag key={era.slug} id={era.slug} textValue={era.name}>
              <EraDot color={era.color} />
              {era.name}
            </Tag>
          ))}
        </FilterGroup>
        <Separator className="h-6 shrink-0" orientation="vertical" />
        <FilterGroup
          label="Format"
          selected={filters.types}
          onChange={(selected) => onChange({ types: selected })}
        >
          {allTypes.map((type) => (
            <Tag key={type} id={type}>
              {type}
            </Tag>
          ))}
        </FilterGroup>
        {allSources.length > 0 && (
          <>
            <Separator className="h-6 shrink-0" orientation="vertical" />
            <FilterGroup
              label="Sold via"
              selected={filters.sources}
              onChange={(selected) => onChange({ sources: selected })}
            >
              {allSources.map((source) => (
                <Tag key={source} id={source}>
                  {source}
                </Tag>
              ))}
            </FilterGroup>
          </>
        )}
      </div>
    </div>
  );
}

/** A multi-select row of filter chips. */
function FilterGroup({
  label,
  selected,
  onChange,
  children,
}: {
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  children: React.ReactNode;
}) {
  return (
    <TagGroup
      className="shrink-0"
      selectedKeys={selected}
      selectionMode="multiple"
      onSelectionChange={(keys) => onChange(toStrings(keys))}
    >
      <Label className="sr-only">{label}</Label>
      <TagGroup.List className="flex-nowrap sm:flex-wrap">{children}</TagGroup.List>
    </TagGroup>
  );
}
