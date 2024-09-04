import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { ButtonVariant, Radius, Size } from "../lib/types";
import type { IconNameType } from "./icon";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Spinner } from "./spinner";
import useTheme from "./use-theme";

const defaultVariants: {
  variant: ButtonVariant;
  size?: Size;
  radius?: Radius;
  loading?: boolean;
} = {
  variant: "primary",
  size: undefined,
  radius: undefined,
  loading: false,
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
    loading: {
      true: "!text-transparent",
      false: "",
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

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: ButtonVariant;
  size?: Size;
  radius?: Radius;
  iconL?: IconNameType;
  iconR?: IconNameType;
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type = "button",
      variant = "primary",
      size,
      radius,
      disabled = false,
      iconL,
      iconR,
      loading = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { themeSize, themeRadius } = useTheme();
    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size: size ?? themeSize,
            radius: radius ?? themeRadius,
            loading,
            className,
          }),
        )}
        type={type}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {iconL && (
          <Icon
            name={iconL}
            size={ICON_SIZE[size ?? themeSize]}
            aria-hidden
            className="button-leading-icon"
          />
        )}
        <Slottable>{children}</Slottable>
        {iconR && (
          <Icon
            name={iconR}
            size={ICON_SIZE[size ?? themeSize]}
            aria-hidden
            className="button-trailing-icon"
          />
        )}
        {loading && (
          <span className={cn(buttonLoadingVariants({ variant }))}>
            <Spinner size={size ?? themeSize} />
          </span>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, buttonVariants };
