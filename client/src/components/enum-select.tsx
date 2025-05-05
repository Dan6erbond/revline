import {
  Chip,
  ChipProps,
  Select,
  SelectItem,
  SelectProps,
} from "@heroui/react";

import type { LucideIcon } from "lucide-react";

type ChipColor = NonNullable<ChipProps["color"]>;

type EnumChipProps<T extends string> = {
  item: T;
  labels: Record<T, string>;
  icons: Record<T, LucideIcon>;
  chipColor?: (
    key: T
  ) => ChipColor;
} & ChipProps;

export function EnumChip<T extends string>({
  item,
  labels,
  icons,
  chipColor = () => "default",
  ...props
}: EnumChipProps<T>) {
  const Icon = icons[item] as LucideIcon;
  return (
    <Chip
      key={item}
      variant="flat"
      color={chipColor(item)}
      startContent={<Icon className="w-3.5 h-3.5" />}
      {...props}
    >
      {labels[item]}
    </Chip>
  );
}

type EnumSelectProps<T extends string> = {
  enumValues: Record<string, T>; // TaskPriority, TaskCategory, etc.
  labels: Record<T, string>;
  icons: Record<T, LucideIcon>;
  chipColor?: (
    key: T
  ) => ChipColor;
} & Omit<SelectProps, "children">;

export function EnumSelect<T extends string>({
  enumValues,
  labels,
  icons,
  chipColor = () => "default",
  ...props
}: EnumSelectProps<T>) {
  const values = Object.values(enumValues);

  return (
    <Select
      items={Object.entries(enumValues).map(([k, v]) => ({ key: v, label: k }))}
      renderValue={(items) => (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <EnumChip
              key={item.key}
              variant="flat"
              item={item.key as T}
              icons={icons}
              labels={labels}
              chipColor={chipColor}
            />
          ))}
        </div>
      )}
      {...props}
    >
      {values.map((val) => {
        const Icon = icons[val] as LucideIcon;
        return (
          <SelectItem key={val} textValue={labels[val]}>
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-default-500" />
              {labels[val]}
            </div>
          </SelectItem>
        );
      })}
    </Select>
  );
}
