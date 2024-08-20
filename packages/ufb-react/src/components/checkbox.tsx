import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva } from "class-variance-authority";

import type { Size } from "../lib/types";
import { CHECK_ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

type CheckboxVariant = "check" | "indeterminate";

const defaultVariants: {
  variant: CheckboxVariant;
  size: Size;
} = {
  variant: "check",
  size: "small",
};

const checkboxVariants = cva("checkbox", {
  variants: {
    variant: {
      check: "checkbox-check",
      indeterminate: "checkbox-indeterminate",
    },
    size: {
      small: "checkbox-small",
      medium: "checkbox-medium",
      large: "checkbox-large",
    },
  },
  defaultVariants,
});

const checkVariants = cva("check", {
  variants: {
    size: {
      small: "check-small",
      medium: "check-medium",
      large: "check-large",
    },
  },
  defaultVariants,
});

const checkboxIconVariants = cva("checkbox-icon", {
  variants: {
    variant: {
      check: "checkbox-icon-check",
      indeterminate: "checkbox-icon-indeterminate",
    },
  },
  defaultVariants,
});

interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    "type"
  > {
  variant?: CheckboxVariant;
  size?: Size;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      variant = defaultVariants.variant,
      size = defaultVariants.size,
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ variant, size, className }))}
      {...props}
    >
      <span className={cn(checkVariants({ size }))}>
        <CheckboxPrimitive.Indicator
          className={cn(checkboxIconVariants({ variant }))}
        >
          <Icon
            name={variant === "check" ? "RiCheckLine" : "RiSubtractLine"}
            size={CHECK_ICON_SIZE[size]}
          />
        </CheckboxPrimitive.Indicator>
      </span>
      {children}
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, type CheckboxProps };
