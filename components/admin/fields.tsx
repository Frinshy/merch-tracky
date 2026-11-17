"use client";

/**
 * Thin wrappers around HeroUI's compound field components so admin forms
 * read as one line per field.
 */
import {
  ComboBox,
  Description,
  FieldError,
  Input,
  Label,
  ListBox,
  TextArea,
  TextField,
} from "@heroui/react";

type BaseFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: React.ReactNode;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
};

export function TextInput({
  label,
  value,
  onChange,
  description,
  placeholder,
  isRequired,
  className,
  type = "text",
  validate,
  name,
}: BaseFieldProps & {
  type?: "text" | "date" | "number";
  validate?: (value: string) => string | null | undefined;
  name?: string;
}) {
  return (
    <TextField
      className={className}
      isRequired={isRequired}
      name={name}
      type={type}
      validate={validate}
      value={value}
      onChange={onChange}
    >
      <Label>{label}</Label>
      <Input placeholder={placeholder} variant="secondary" />
      {description && <Description>{description}</Description>}
      <FieldError />
    </TextField>
  );
}

export function TextAreaInput({
  label,
  value,
  onChange,
  description,
  placeholder,
  className,
  rows = 3,
}: BaseFieldProps & { rows?: number }) {
  return (
    <TextField className={className} value={value} onChange={onChange}>
      <Label>{label}</Label>
      <TextArea placeholder={placeholder} rows={rows} variant="secondary" />
      {description && <Description>{description}</Description>}
    </TextField>
  );
}

/** Free text with suggestions (e.g. existing formats). Any value is allowed. */
export function SuggestInput({
  label,
  value,
  onChange,
  options,
  description,
  placeholder,
  isRequired,
  className,
}: BaseFieldProps & { options: string[] }) {
  return (
    <ComboBox
      allowsCustomValue
      className={className}
      inputValue={value}
      isRequired={isRequired}
      menuTrigger="focus"
      onInputChange={onChange}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder={placeholder} variant="secondary" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      {description && <Description>{description}</Description>}
      <FieldError />
      <ComboBox.Popover>
        <ListBox>
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
