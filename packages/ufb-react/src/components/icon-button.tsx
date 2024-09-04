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
    loading: {
      true: "!text-transparent",
      false: "",
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
  loading?: boolean;
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      type = "button",
      variant = "primary",
      size,
      radius,
      disabled = false,
      icon,
      loading = false,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const { themeSize, themeRadius } = useTheme();

    return (
      <Comp
        className={cn(
          iconButtonVariants({
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
        <React.Fragment>
          <Icon name={icon} size={ICON_SIZE[size ?? themeSize]} aria-hidden />
          {loading && (
            <span className={cn(iconButtonLoadingVariants({ variant }))}>
              <Spinner size={size ?? themeSize} />
            </span>
          )}
        </React.Fragment>
      </Comp>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
