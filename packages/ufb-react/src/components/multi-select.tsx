/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../types";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { Tag } from "./tag";
import useTheme from "./use-theme";

type MultiSelectItemType = { value: string; label: React.ReactNode };

type MultiSelectContextType = {
  disabled: boolean;
  size: Size;
  radius: Radius;
  selectedItems: MultiSelectItemType[];
  setSelectedItems: (items: MultiSelectItemType[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOption: (item: MultiSelectItemType) => void;
  registeredItems: MultiSelectItemType[];
  registerItem: (item: MultiSelectItemType) => void;
};

const MultiSelectContext = React.createContext<
  MultiSelectContextType | undefined
>(undefined);

function useMultiSelectContext() {
  const ctx = React.useContext(MultiSelectContext);
  if (!ctx)
    throw new Error("MultiSelect components must be used within <MultiSelect>");
  return ctx;
}

interface MultiSelectProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
}

const selectVariants = cva("select", {
  variants: {
    size: {
      small: "select-small",
      medium: "select-medium",
      large: "select-large",
    },
    defaultVariants: { size: undefined },
  },
});

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  function MultiSelect(
    {
      value,
      defaultValue = [],
      onValueChange,
      children,
      className,
      size,
      radius,
      disabled = false,
    },
    ref,
  ) {
    const { themeSize, themeRadius } = useTheme();

    const [registeredItems, setRegisteredItems] = React.useState<
      MultiSelectItemType[]
    >([]);
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isOpen, setIsOpen] = React.useState(false);

    const values = value ?? selectedValues;
    const setValues = (vals: string[]) => {
      if (onValueChange) onValueChange(vals);
      if (value === undefined) setSelectedValues(vals);
    };

    const registerItem = React.useCallback((item: MultiSelectItemType) => {
      setRegisteredItems((prev) =>
        prev.find((i) => i.value === item.value) ? prev : [...prev, item],
      );
    }, []);

    const selectedItems = React.useMemo(
      () =>
        values
          .map((val) => registeredItems.find((item) => item.value === val))
          .filter(Boolean) as MultiSelectItemType[],
      [values, registeredItems],
    );

    const toggleOption = (item: MultiSelectItemType) => {
      setValues(
        values.includes(item.value)
          ? values.filter((v) => v !== item.value)
          : [...values, item.value],
      );
    };

    const hiddenRegisterItems = (
      <div style={{ display: "none" }}>
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            (child.type as React.ForwardRefExoticComponent<HTMLElement>)
              .displayName === "MultiSelectItem"
          ) {
            return child;
          }
          if (
            React.isValidElement(child) &&
            (child.props as { children?: React.ReactNode }).children
          ) {
            return React.Children.map(
              (child.props as { children?: React.ReactNode }).children,
              (c) => c,
            );
          }
          return null;
        })}
      </div>
    );

    return (
      <MultiSelectContext.Provider
        value={{
          disabled,
          size: size ?? themeSize,
          radius: radius ?? themeRadius,
          selectedItems,
          setSelectedItems: (items) => setValues(items.map((i) => i.value)),
          isOpen,
          setIsOpen,
          toggleOption,
          registeredItems,
          registerItem,
        }}
      >
        {hiddenRegisterItems}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <div
            ref={ref}
            className={cn(
              selectVariants({
                size: size ?? themeSize,
                className,
              }),
            )}
          >
            {children}
          </div>
        </Popover>
      </MultiSelectContext.Provider>
    );
  },
);

interface MultiSelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const selectTriggerVariants = cva("select-trigger", {
  variants: {
    size: {
      small: "select-trigger-small",
      medium: "select-trigger-medium",
      large: "select-trigger-large",
    },
    radius: {
      small: "select-trigger-radius-small",
      medium: "select-trigger-radius-medium",
      large: "select-trigger-radius-large",
    },
  },
  defaultVariants: { size: undefined, radius: undefined },
});

const MultiSelectTrigger = React.forwardRef<
  HTMLButtonElement,
  MultiSelectTriggerProps
>(function MultiSelectTrigger({ asChild, ...props }, ref) {
  const Comp = asChild ? Slot : MultiSelectTriggerButton;

  return (
    <PopoverTrigger asChild>
      <Comp ref={ref} {...props} />
    </PopoverTrigger>
  );
});

interface MultiSelectTriggerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}

const MultiSelectTriggerButton = React.forwardRef<
  HTMLButtonElement,
  MultiSelectTriggerButtonProps
>(function MultiSelectTrigger({ className, children, ...props }, ref) {
  const { size, radius, disabled } = useMultiSelectContext();
  return (
    <button
      ref={ref}
      type="button"
      aria-haspopup="listbox"
      className={cn(selectTriggerVariants({ size, radius, className }))}
      data-placeholder
      disabled={disabled}
      {...props}
    >
      <Slottable>{children}</Slottable>
      <Icon name="RiArrowDownSLine" size={ICON_SIZE[size]} />
    </button>
  );
});

interface MultiSelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
}

const MultiSelectContent = React.forwardRef<
  HTMLDivElement,
  MultiSelectContentProps
>(function MultiSelectContent(
  { className, children, maxHeight = "auto", ...props },
  ref,
) {
  return (
    <PopoverContent
      ref={ref}
      className={cn("select-content", className)}
      {...props}
    >
      <div className={cn("select-viewport")}>
        <ScrollArea maxHeight={maxHeight}>
          {children}
          <ScrollBar />
        </ScrollArea>
      </div>
    </PopoverContent>
  );
});

const selectItemVariants = cva("select-item", {
  variants: { check: { left: "select-item-left", right: "select-item-right" } },
  defaultVariants: { check: "left" },
});

const selectItemCheckVariants = cva("select-item-check", {
  variants: {
    check: { left: "select-item-check-left", right: "select-item-check-right" },
  },
  defaultVariants: { check: "left" },
});

interface MultiSelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
const MultiSelectItem = React.forwardRef<HTMLDivElement, MultiSelectItemProps>(
  function MultiSelectItem({ value, children, className }, ref) {
    const { selectedItems, toggleOption, registerItem } =
      useMultiSelectContext();
    const isSelected = selectedItems.some((item) => item.value === value);

    // Register this item on mount
    React.useEffect(() => {
      registerItem({ value, label: children });
    }, [value, children, registerItem]);

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        className={cn(
          selectItemVariants({
            check: typeof children === "string" ? "left" : "right",
            className,
          }),
        )}
        onClick={() => toggleOption({ value, label: children })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            toggleOption({ value, label: children });
        }}
      >
        {isSelected && (
          <span
            className={cn(
              selectItemCheckVariants({
                check: typeof children === "string" ? "left" : "right",
              }),
            )}
          >
            <Icon name="RiCheckLine" size={16} />
          </span>
        )}
        <Slottable>{children}</Slottable>
      </div>
    );
  },
);
MultiSelectItem.displayName = "MultiSelectItem";

const MultiSelectValue = React.forwardRef<
  HTMLSpanElement,
  { placeholder?: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>
>(function MultiSelectValue({ placeholder, ...props }, ref) {
  const { selectedItems, size } = useMultiSelectContext();

  if (selectedItems.length === 0) {
    return (
      <span ref={ref} {...props}>
        {placeholder}
      </span>
    );
  }

  return (
    <span ref={ref} {...props}>
      {selectedItems.map((item) => (
        <Tag
          key={item.value}
          variant="outline"
          size={size}
          className="select-tag"
        >
          {item.label}
        </Tag>
      ))}
    </span>
  );
});

export {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectTriggerButton,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectValue,
};
