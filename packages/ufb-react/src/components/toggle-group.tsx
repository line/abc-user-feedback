import type * as TogglePrimitive from "@radix-ui/react-toggle";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";

import type { Radius, Size } from "../lib/types";
import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

const toggleVariants = cva("toggle-group-item", {
  variants: {
    size: {
      small: "toggle-group-item-small",
      medium: "toggle-group-item-medium",
      large: "toggle-group-item-large",
    },
    radius: {
      small: "toggle-group-item-radius-small",
      medium: "toggle-group-item-radius-medium",
      large: "toggle-group-item-radius-large",
    },
  },
  defaultVariants: {
    size: "small",
    radius: "medium",
  },
});

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "small",
  radius: "medium",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, size, radius, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("toggle-group", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ size, radius }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    Omit<VariantProps<typeof toggleVariants>, "disabled"> {
  icon?: IconNameType;
  size?: Size;
  radius?: Radius;
  value: string;
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(
  (
    { className, children, icon, size, radius, disabled, value, ...props },
    ref,
  ) => {
    const context = React.useContext(ToggleGroupContext);

    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({
            size: context.size ?? size,
            radius: context.radius ?? radius,
          }),
          className,
        )}
        value={value}
        disabled={disabled}
        {...props}
      >
        {icon && <Icon name={icon} aria-hidden size={20} />}
        {children}
      </ToggleGroupPrimitive.Item>
    );
  },
);

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
