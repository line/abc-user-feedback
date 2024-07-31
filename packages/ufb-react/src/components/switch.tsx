import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";

import type { Color } from "../lib/types";
import { cn } from "../lib/utils";

const switchVariants = cva("switch", {
  variants: {
    color: {
      default: "switch-default",
      blue: "switch-blue",
      orange: "switch-orange",
      red: "switch-red",
      green: "switch-green",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  color?: Color;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ color, className, children, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ color }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn("switch-thumb")} />
    {children}
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
