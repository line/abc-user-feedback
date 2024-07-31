import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { Color, Radius } from "../lib/types";
import { cn } from "../lib/utils";

type BadgeType = "bold" | "subtle" | "outline";

const badgeVariants = cva("badge", {
  variants: {
    radius: {
      large: "badge-radius-large",
      medium: "badge-radius-medium",
      small: "badge-radius-small",
    },
    type: {
      bold: "badge-bold",
      subtle: "badge-subtle",
      outline: "badge-outline",
    },
    color: {
      default: "badge-default",
      blue: "badge-blue",
      orange: "badge-orange",
      red: "badge-red",
      green: "badge-green",
    },
  },
  defaultVariants: {
    radius: "medium",
    type: "bold",
    color: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  radius?: Radius;
  type?: BadgeType;
  color?: Color;
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      radius = "medium",
      type = "bold",
      color = "default",
      className,
      asChild,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ radius, type, color }), className)}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
