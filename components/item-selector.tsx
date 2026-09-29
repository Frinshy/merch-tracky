"use client";

import { Button, ComboBox, Input, Label, ListBox } from "@heroui/react";

export type SelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

type ItemSelectorProps = SelectorProps & {
  clearLabel?: string;
  emptyOption?: string;
  label?: string;
  options: string[];
  placeholder?: string;
  selectorClassName?: string;
};

function SelectorClearButton({
  label,
  onClear,
  value,
}: {
  label: string;
  onClear: () => void;
  value: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <Button
      aria-label={`Remove ${label}`}
      className="absolute end-8 top-1/2 z-10 h-8 w-8 -translate-y-1/2 text-muted hover:text-foreground"
      isIconOnly
      onPress={onClear}
      size="sm"
      type="button"
      variant="ghost"
    >
      <span aria-hidden="true">&times;</span>
    </Button>
  );
}

export function ItemSelector({
  clearLabel = "filter",
  emptyOption,
  label,
  onChange,
  options,
  placeholder = "Select era...",
  selectorClassName = "w-full",
  value,
}: ItemSelectorProps) {
  return (
    <ComboBox
      className={selectorClassName}
      onSelectionChange={(key) => onChange(key ? String(key) : "")}
      selectedKey={value || null}
      variant="secondary"
    >
      {label && <Label>{label}</Label>}
      <ComboBox.InputGroup>
        <Input
          className="border border-default bg-content1"
          placeholder={placeholder}
        />
        <SelectorClearButton
          label={clearLabel}
          onClear={() => onChange("")}
          value={value}
        />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {emptyOption && (
            <ListBox.Item
              id={emptyOption}
              onAction={() => onChange("")}
              textValue={emptyOption}
            >
              {emptyOption}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
          {options.map((option) => (
            <ListBox.Item key={option} id={option} textValue={option}>
              {option}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
