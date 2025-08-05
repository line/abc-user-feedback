/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import * as React from "react";
import { Slottable } from "@radix-ui/react-slot";
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
      <Slottable>{children}</Slottable>
      {side !== undefined && (
        <>
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
        </>
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
