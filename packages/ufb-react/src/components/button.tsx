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

const buttonVariants = cva("button", {
  variants: {
    variant: {
      primary: "button-primary",
      secondary: "button-secondary",
      destructive: "button-destructive",
      ghost: "button-ghost",
      outline: "button-outline",
    },
    size: {
      small: "button-small",
      medium: "button-medium",
      large: "button-large",
    },
    radius: {
      small: "button-radius-small",
      medium: "button-radius-medium",
      large: "button-radius-large",
    },
  },
  defaultVariants,
});

const buttonLoadingVariants = cva("button-loading", {
  variants: {
    variant: {
      primary: "button-loading-primary",
      secondary: "button-loading-secondary",
      destructive: "button-loading-destructive",
      ghost: "button-loading-ghost",
      outline: "button-loading-outline",
    },
  },
  defaultVariants,
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: ButtonVariant;
  size?: Size;
  radius?: Radius;
  iconL?: IconNameType;
  iconR?: IconNameType;
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "small",
      radius = "medium",
      disabled = false,
      iconL,
      iconR,
      isLoading,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, radius, className }),
          isLoading && "text-transparent",
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {iconL && (
          <Icon
            name={iconL}
            size={ICON_SIZE[size]}
            aria-hidden
            className="button-leading-icon"
          />
        )}
        {children}
        {iconR && (
          <Icon
            name={iconR}
            size={ICON_SIZE[size]}
            aria-hidden
            className="button-trailing-icon"
          />
        )}
        {isLoading && (
          <span className={cn(buttonLoadingVariants({ variant }))}>
            <Spinner
              size={size === "large" || size === "medium" ? "large" : "small"}
            />
          </span>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
