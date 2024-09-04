import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva } from "class-variance-authority";

import type { CaptionType } from "../lib/types";
import type { Size } from "../types";
import type { IconNameType } from "./icon";
import { CAPTION_DEFAULT_ICON, ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Tag } from "./tag";
import useTheme from "./use-theme";

interface SelectContextProps {
  type: SelectProps["type"];
  size?: SelectProps["size"];
  error?: SelectProps["error"];
  values?: MultipleSelectProps["values"];
  itemTextByValue: Record<string, string>;
  setItemTextByValue: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
}
const SelectContext = React.createContext<SelectContextProps>({
  type: "single",
  size: undefined,
  error: false,
  values: [],
  setItemTextByValue: () => {},
  itemTextByValue: {},
});

const selectVariants = cva("select", {
  variants: {
    size: {
      small: "select-small",
      medium: "select-medium",
      large: "select-large",
    },
    defaultVariants: {
      size: undefined,
    },
  },
});

type SelectProps = {
  type?: "single" | "multiple";
  size?: Size;
  error?: boolean;
} & SingleSelectProps &
  MultipleSelectProps;

const Select = ({
  type = "single",
  size,
  error = false,
  values = [],
  onValuesChange,
  ...props
}: SelectProps) => {
  const { themeSize } = useTheme();
  const [multipleValues, setMultipleValues] = React.useState<string[]>(values);
  const [itemTextByValue, setItemTextByValue] = React.useState<
    Record<string, string>
  >({});

  const handleMultipleValuesChange = (values: string[]) => {
    setMultipleValues(values);
    onValuesChange?.(values);
  };

  return (
    <SelectContext.Provider
      value={{
        type,
        size: size ?? themeSize,
        values: multipleValues,
        error,
        itemTextByValue,
        setItemTextByValue,
      }}
    >
      <div className={cn(selectVariants({ size: size ?? themeSize }))}>
        {type === "single" ? (
          <SingleSelect {...props} />
        ) : (
          <MultipleSelect
            {...props}
            values={multipleValues}
            onValuesChange={handleMultipleValuesChange}
          />
        )}
      </div>
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";

type SingleSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
>;
const SingleSelect = SelectPrimitive.Root;

type MultipleSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
> & {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
};
const MultipleSelect = ({
  values = [],
  onValuesChange,
  ...props
}: MultipleSelectProps) => {
  return (
    <SelectPrimitive.Root
      value="null"
      onValueChange={(value) => {
        onValuesChange?.(
          values.includes(value)
            ? values.filter((curr) => curr !== value)
            : values.concat(value),
        );
      }}
      {...props}
    />
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
  const {
    size,
    values = [],
    itemTextByValue,
  } = React.useContext(SelectContext);

  const { themeSize } = useTheme();

  return (
    <SelectPrimitive.Value ref={ref} placeholder={placeholder}>
      <React.Fragment>
        {values.length > 0
          ? values.map((value, index) => (
              <Tag
                key={index}
                variant="outline"
                size={size ?? themeSize}
                className="select-tag"
              >
                {itemTextByValue[value]}
              </Tag>
            ))
          : placeholder}
      </React.Fragment>
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
    error: {
      true: "select-trigger-error",
      false: "",
    },
  },
  defaultVariants: {
    size: undefined,
    error: false,
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
  const { size, error } = React.useContext(SelectContext);
  const { themeSize } = useTheme();
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectTriggerVariants({ size: size ?? themeSize, error, className }),
      )}
      {...props}
    >
      <React.Fragment>
        {icon && <Icon name={icon} size={ICON_SIZE[size ?? themeSize]} />}
        {children}
        <SelectPrimitive.Icon asChild>
          <Icon name="RiArrowDownSLine" size={ICON_SIZE[size ?? themeSize]} />
        </SelectPrimitive.Icon>
      </React.Fragment>
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
      className={cn("select-content", className)}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn("select-viewport")}>
        <ScrollArea maxHeight={maxHeight}>
          {children}
          <ScrollBar />
        </ScrollArea>
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("select-group-label", className)}
    {...props}
  />
));
SelectGroupLabel.displayName = SelectPrimitive.Label.displayName;

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
  children: string;
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
    <React.Fragment>
      <span className="select-item-check">
        <SelectPrimitive.ItemIndicator>
          <Icon name="RiCheckLine" size={20} />
        </SelectPrimitive.ItemIndicator>
      </span>
      {icon && <Icon name={icon} size={16} className="select-item-icon" />}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </React.Fragment>
  </SelectPrimitive.Item>
));
SingleSelectItem.displayName = SelectPrimitive.Item.displayName;

type MultipleSelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> & {
  icon?: IconNameType;
  values?: string[];
  children: string;
};
const MultipleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  MultipleSelectItemProps
>(({ icon, value, className, children, ...props }, ref) => {
  const { values = [], setItemTextByValue } = React.useContext(SelectContext);
  const isSelected = values.includes(value);

  React.useEffect(() => {
    setItemTextByValue((prev) => ({ ...prev, [value]: children }));
  }, [children]);

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn("select-item", className)}
      value={value}
      {...props}
    >
      <React.Fragment>
        {isSelected && (
          <span className="select-item-check">
            <Icon name="RiCheckLine" size={20} />
          </span>
        )}
        {icon && <Icon name={icon} size={16} className="select-item-icon" />}
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </React.Fragment>
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

const SelectLabel = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"strong">
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <strong ref={ref} className={cn("select-label", className)} {...rest} />
  );
});
SelectLabel.displayName = "SelectLabel";

const selectCaptionVariants = cva("select-caption", {
  variants: {
    variant: {
      default: "select-caption-default",
      success: "select-caption-success",
      info: "select-caption-info",
      error: "select-caption-error",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

interface SelectCaptionProps extends React.ComponentPropsWithoutRef<"span"> {
  variant?: CaptionType;
  icon?: IconNameType;
  size?: Size;
}

const SelectCaption = React.forwardRef<HTMLElement, SelectCaptionProps>(
  (props, ref) => {
    const {
      icon = undefined,
      variant = "default",
      size,
      className,
      children,
      ...rest
    } = props;
    const { themeSize } = useTheme();

    return (
      <span
        ref={ref}
        className={cn(selectCaptionVariants({ variant, className }))}
        {...rest}
      >
        <React.Fragment>
          <Icon
            name={icon ?? CAPTION_DEFAULT_ICON[variant]}
            size={ICON_SIZE[size ?? themeSize]}
            className="select-caption-icon"
          />
          {children}
        </React.Fragment>
      </span>
    );
  },
);
SelectCaption.displayName = "SelectCaption";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroupLabel,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectCaption,
};
