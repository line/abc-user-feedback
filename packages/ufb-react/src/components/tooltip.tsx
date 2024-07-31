import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const tooltipVariants = cva("tooltip", {
  variants: {
    textAlign: {
      left: "tooltip-text-left",
      center: "tooltip-text-center",
      right: "tooltip-text-right",
    },
    defaultVariants: {
      textAlign: "center",
    },
  },
});

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  textAlign?: "left" | "center" | "right";
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      title,
      children,
      className,
      side,
      sideOffset = 4,
      textAlign = "center",
      ...props
    },
    ref,
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      sideOffset={sideOffset}
      className={cn(tooltipVariants({ textAlign, className }))}
      {...props}
    >
      {title && <strong className={cn("tooltip-title")}>{title}</strong>}
      {children}
      {side !== undefined && (
        <React.Fragment>
          <TooltipPrimitive.TooltipArrow
            width={10}
            height={6}
            className={cn("tooltip-arrow-border")}
          />
          <TooltipPrimitive.TooltipArrow
            width={8}
            height={5}
            className={cn("tooltip-arrow")}
          />
        </React.Fragment>
      )}
    </TooltipPrimitive.Content>
  ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  type TooltipContentProps,
};
