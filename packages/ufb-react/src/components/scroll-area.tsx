import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const scrollBarVariants = cva("scroll-bar", {
  variants: {
    orientation: {
      vertical: "scroll-bar-vertical",
      horizontal: "scroll-bar-horizontal",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    maxWidth?: string;
    maxHeight?: string;
  }
>(({ maxWidth, maxHeight, className, children, style, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("scroll-area", className)}
    style={{ ...style, maxWidth }}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className="scroll-area-viewport"
      style={{ maxHeight }}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(scrollBarVariants({ orientation, className }))}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="scroll-thumb" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
