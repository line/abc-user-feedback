import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { Color, Radius } from "../lib/types";
import { cn } from "../lib/utils";
import useTheme from "./use-theme";

type BadgeType = "bold" | "subtle" | "outline";

const badgeVariants = cva("badge", {
  variants: {
    radius: {
      large: "badge-radius-large",
      medium: "badge-radius-medium",
      small: "badge-radius-small",
    },
    type: {
      bold: "",
      subtle: "",
      outline: "",
    },
    color: {
      default: "",
      blue: "",
      orange: "",
      red: "",
      green: "",
    },
  },
  compoundVariants: [
    {
      type: "bold",
      color: "default",
      className: "badge-bold-default",
    },
    {
      type: "bold",
      color: "blue",
      className: "badge-bold-blue",
    },
    {
      type: "bold",
      color: "orange",
      className: "badge-bold-orange",
    },
    {
      type: "bold",
      color: "red",
      className: "badge-bold-red",
    },
    {
      type: "bold",
      color: "green",
      className: "badge-bold-green",
    },
    {
      type: "subtle",
      color: "default",
      className: "badge-subtle-default",
    },
    {
      type: "subtle",
      color: "blue",
      className: "badge-subtle-blue",
    },
    {
      type: "subtle",
      color: "orange",
      className: "badge-subtle-orange",
    },
    {
      type: "subtle",
      color: "red",
      className: "badge-subtle-red",
    },
    {
      type: "subtle",
      color: "green",
      className: "badge-subtle-green",
    },
    {
      type: "outline",
      color: "default",
      className: "badge-outline-default",
    },
    {
      type: "outline",
      color: "blue",
      className: "badge-outline-blue",
    },
    {
      type: "outline",
      color: "orange",
      className: "badge-outline-orange",
    },
    {
      type: "outline",
      color: "red",
      className: "badge-outline-red",
    },
    {
      type: "outline",
      color: "green",
      className: "badge-outline-green",
    },
  ],
  defaultVariants: {
    radius: undefined,
    type: "bold",
    color: "default",
  },
});

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  radius?: Radius;
  type?: BadgeType;
  color?: Color;
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    { radius, type = "bold", color = "default", className, asChild, ...props },
    ref,
  ) => {
    const { themeRadius } = useTheme();
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(
          badgeVariants({ radius: radius ?? themeRadius, type, color }),
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, type BadgeProps };
