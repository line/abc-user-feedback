import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva } from "class-variance-authority";

import type { Size } from "../types";
import type { IconNameType } from "./icon";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Tag } from "./tag";
import useTheme from "./use-theme";

const SelectContext = React.createContext<
  {
    type?: "single" | "multiple";
    size?: Size;
  } & SingleSelectProps &
    MultipleSelectProps
>({
  type: "single",
  size: undefined,
});

type SelectProps = {
  type?: "single" | "multiple";
  size?: Size;
} & SingleSelectProps &
  MultipleSelectProps;
const Select = ({
  type = "single",
  size,
  values = [],
  onValuesChange,
  ...props
}: SelectProps) => {
  const { themeSize } = useTheme();
  const [multipleValues, setMultipleValues] = React.useState<string[]>(values);

  const handleMultipleValuesChange = (values: string[]) => {
    setMultipleValues(values);
    onValuesChange?.(values);
  };

  return (
    <SelectContext.Provider
      value={{ type, size: size ?? themeSize, values: multipleValues }}
    >
      {type === "single" ? (
        <SingleSelect {...props} />
      ) : (
        <MultipleSelect
          {...props}
          values={multipleValues}
          onValuesChange={handleMultipleValuesChange}
        />
      )}
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";

type SingleSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
>;
const SingleSelect = ({ ...props }) => {
  return <SelectPrimitive.Root {...props} />;
};
SingleSelect.displayName = "SingleSelect";

type MultipleSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
> & {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
};
const MultipleSelect = ({
  values = [],
  onValuesChange,
  children,
  ...props
}: MultipleSelectProps) => {
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <SelectPrimitive.Root
      value={value}
      onOpenChange={() => {
        // NOTE : onValueChange 호출을 위한 setValue 변경
        setValue(undefined);
      }}
      onValueChange={(value) => {
        onValuesChange?.(
          values.includes(value)
            ? values.filter((curr) => curr !== value)
            : [...values, value],
        );
      }}
      {...props}
    >
      {children}
    </SelectPrimitive.Root>
  );
};
MultipleSelect.displayName = "MultipleSelect";

const SelectGroup = SelectPrimitive.Group;

const SelectValue = ({
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>) => {
  const { type = "single" } = React.useContext(SelectContext);
  return type === "single" ? (
    <SingleSelectValue {...props} />
  ) : (
    <MultipleSelectValue {...props} />
  );
};

const SingleSelectValue = SelectPrimitive.Value;
SingleSelectValue.displayName = "SingleSelectValue";

const MultipleSelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ placeholder }, ref) => {
  const { size, values = [] } = React.useContext(SelectContext);
  const { themeSize } = useTheme();
  return (
    <SelectPrimitive.Value ref={ref} placeholder={placeholder}>
      {values && values.length > 0
        ? values.map((value, index) => (
            <Tag
              key={index}
              type="outline"
              size={size ?? themeSize}
              className="select-tag"
            >
              {value}
            </Tag>
          ))
        : placeholder}
    </SelectPrimitive.Value>
  );
});
MultipleSelectValue.displayName = "MultipleSelectValue";

const selectTriggerVariants = cva("select-trigger", {
  variants: {
    size: {
      small: "select-trigger-small",
      medium: "select-trigger-medium",
      large: "select-trigger-large",
    },
  },
  defaultVariants: {
    size: undefined,
  },
});

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  icon?: IconNameType;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ icon, className, children, ...props }, ref) => {
  const { size } = React.useContext(SelectContext);
  const { themeSize } = useTheme();
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectTriggerVariants({ size: size ?? themeSize, className }),
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={ICON_SIZE[size ?? themeSize]} />}
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon name="RiArrowDownSLine" size={ICON_SIZE[size ?? themeSize]} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    maxHeight?: string;
  }
>(({ maxHeight, className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "select-content",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "select-viewport",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        <ScrollArea maxHeight={maxHeight}>
          {children}
          <ScrollBar />
        </ScrollArea>
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("select-label", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

type SelectItemProps = SingleSelectItemProps & MultipleSelectItemProps;
const SelectItem = ({ ...props }: SelectItemProps) => {
  const { type = "single" } = React.useContext(SelectContext);

  return type === "single" ? (
    <SingleSelectItem {...props} />
  ) : (
    <MultipleSelectItem {...props} />
  );
};
SelectItem.displayName = "SelectItem";

type SingleSelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> & {
  icon?: IconNameType;
};
const SingleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SingleSelectItemProps
>(({ className, icon, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn("select-item", className)}
    {...props}
  >
    <span className="select-item-check">
      <SelectPrimitive.ItemIndicator>
        <Icon name="RiCheckLine" size={20} />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>
      {icon && <Icon name={icon} size={16} className="select-item-icon" />}
      {children}
    </SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SingleSelectItem.displayName = SelectPrimitive.Item.displayName;

type MultipleSelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> & {
  icon?: IconNameType;
  values?: string[];
};
const MultipleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  MultipleSelectItemProps
>(({ icon, value, className, children, ...props }, ref) => {
  const { values = [] } = React.useContext(SelectContext);
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn("select-item", className)}
      value={value}
      {...props}
    >
      {values.includes(value) && (
        <span className="select-item-check">
          <Icon name="RiCheckLine" size={20} />
        </span>
      )}
      <SelectPrimitive.ItemText>
        {icon && <Icon name={icon} size={16} className="select-item-icon" />}
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
MultipleSelectItem.displayName = "MultipleSelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("select-separator", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
