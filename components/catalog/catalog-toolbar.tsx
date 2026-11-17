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
import { CheckIcon, LayoutGridIcon, ListIcon } from "lucide-react";

import { EraDot } from "@/components/eras/era-badge";
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
            <LayoutGridIcon size={16} />
          </ToggleButton>
          <ToggleButton isIconOnly aria-label="List view" id="list">
            <ListIcon size={16} />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="scrollbar-none -mx-4 flex items-center gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterGroup
          allLabel="All eras"
          label="Era"
          selected={filters.eras}
          onChange={(selected) => onChange({ eras: selected })}
        >
          {eras.map((era) => (
            <FilterChip key={era.slug} color={era.color} id={era.slug} label={era.name}>
              <EraDot className="in-data-[selected=true]:hidden" color={era.color} />
            </FilterChip>
          ))}
        </FilterGroup>
        <Separator className="h-6 shrink-0" orientation="vertical" />
        <FilterGroup
          allLabel="All formats"
          label="Format"
          selected={filters.types}
          onChange={(selected) => onChange({ types: selected })}
        >
          {allTypes.map((type) => (
            <FilterChip key={type} id={type} label={type} />
          ))}
        </FilterGroup>
        {allSources.length > 0 && (
          <>
            <Separator className="h-6 shrink-0" orientation="vertical" />
            <FilterGroup
              allLabel="All shops"
              label="Sold via"
              selected={filters.sources}
              onChange={(selected) => onChange({ sources: selected })}
            >
              {allSources.map((source) => (
                <FilterChip key={source} id={source} label={source} />
              ))}
            </FilterGroup>
          </>
        )}
      </div>
    </div>
  );
}

/** Key of the "All" chip that leads every group; it is never stored in the filters. */
const ALL = "__all";

/** Filter chip with a clear on/off state: check icon, coloured ring and tint when selected. */
function FilterChip({
  id,
  label,
  color,
  children,
}: {
  id: string;
  label: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <Tag
      className="ring-(--chip) data-[selected=true]:bg-[color-mix(in_oklab,var(--chip)_22%,transparent)] data-[selected=true]:text-foreground data-[selected=true]:ring-2 data-[selected=true]:ring-inset"
      id={id}
      style={{ "--chip": color ?? "var(--color-accent)" } as React.CSSProperties}
      textValue={label}
    >
      <CheckIcon className="hidden in-data-[selected=true]:block" strokeWidth={3} />
      {children}
      {label}
    </Tag>
  );
}

/**
 * A multi-select row of filter chips, led by an "All" chip. "All" is on while nothing in the
 * group is picked; pressing it clears the group.
 */
function FilterGroup({
  label,
  allLabel,
  selected,
  onChange,
  children,
}: {
  label: string;
  allLabel: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  children: React.ReactNode;
}) {
  return (
    <TagGroup
      className="shrink-0"
      selectedKeys={selected.length ? selected : [ALL]}
      selectionMode="multiple"
      onSelectionChange={(keys) => {
        const next = toStrings(keys);

        // "All" was just switched on: drop the group's picks. Otherwise "All" is only along for the ride.
        onChange(next.includes(ALL) && selected.length ? [] : next.filter((key) => key !== ALL));
      }}
    >
      <Label className="sr-only">{label}</Label>
      <TagGroup.List className="flex-nowrap sm:flex-wrap">
        <FilterChip id={ALL} label={allLabel} />
        {children}
      </TagGroup.List>
    </TagGroup>
  );
}
