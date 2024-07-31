import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { ButtonVariant, Radius, Size } from "../lib/types";
import type { IconNameType } from "./icon";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

const defaultVariants: {
  variant: ButtonVariant;
  size: Size;
  radius: Radius;
} = {
  variant: "primary",
  size: "small",
  radius: "medium",
};

const iconButtonVariants = cva("icon-button", {
  variants: {
    variant: {
      primary: "icon-button-primary",
      secondary: "icon-button-secondary",
      destructive: "icon-button-destructive",
      ghost: "icon-button-ghost",
      outline: "icon-button-outline",
    },
    size: {
      small: "icon-button-small",
      medium: "icon-button-medium",
      large: "icon-button-large",
    },
    radius: {
      small: "icon-button-radius-small",
      medium: "icon-button-radius-medium",
      large: "icon-button-radius-large",
    },
  },
  defaultVariants,
});

const iconButtonLoadingVariants = cva("icon-button-loading", {
  variants: {
    variant: {
      primary: "icon-button-loading-primary",
      secondary: "icon-button-loading-secondary",
      destructive: "icon-button-loading-destructive",
      ghost: "icon-button-loading-ghost",
      outline: "icon-button-loading-outline",
    },
  },
  defaultVariants,
});

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  variant?: ButtonVariant;
  size?: Size;
  radius?: Radius;
  icon: IconNameType;
  isLoading?: boolean;
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "small",
      radius = "medium",
      disabled = false,
      icon,
      isLoading,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          iconButtonVariants({ variant, size, radius, className }),
          isLoading && "text-transparent",
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        <Icon name={icon} size={ICON_SIZE[size]} aria-hidden />
        {isLoading && (
          <span className={cn(iconButtonLoadingVariants({ variant }))}>
            <Spinner
              size={size === "large" || size === "medium" ? "large" : "small"}
            />
          </span>
        )}
      </Comp>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
