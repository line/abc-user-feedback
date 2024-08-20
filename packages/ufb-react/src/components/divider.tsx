import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const dividerVariants = cva("divider", {
  variants: {
    type: {
      bold: "divider-bold",
      subtle: "divider-subtle",
    },
    orientation: {
      horizontal: "divider-horizontal",
      vertical: "divider-vertical",
    },
    indent: {
      0: "",
      8: "",
      16: "",
      24: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      indent: 8,
      className: "divider-horizontal-indent-8",
    },
    {
      orientation: "horizontal",
      indent: 16,
      className: "divider-horizontal-indent-16",
    },
    {
      orientation: "horizontal",
      indent: 24,
      className: "divider-horizontal-indent-24",
    },
    {
      orientation: "vertical",
      indent: 8,
      className: "divider-vertical-indent-8",
    },
    {
      orientation: "vertical",
      indent: 16,
      className: "divider-vertical-indent-16",
    },
    {
      orientation: "vertical",
      indent: 24,
      className: "divider-vertical-indent-24",
    },
  ],
  defaultVariants: {
    type: "bold",
    orientation: "horizontal",
    indent: 0,
  },
});

interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  type?: "bold" | "subtle";
  indent?: 0 | 8 | 16 | 24;
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  (
    {
      type = "bold",
      indent = 0,
      orientation = "horizontal",
      className,
      decorative = true,
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(dividerVariants({ type, orientation, indent, className }))}
      {...props}
    />
  ),
);
Divider.displayName = SeparatorPrimitive.Root.displayName;

export { Divider };
