import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import { Icon } from "./icon";

const radioGroupVariants = cva("radio-group", {
  variants: {
    orientation: {
      horizontal: "radio-group-horizontal",
      vertical: "radio-group-vertical",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ orientation, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(radioGroupVariants({ orientation, className }))}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ children, className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn("radio-item", className)}
      {...props}
    >
      <React.Fragment>
        <span className="radio">
          <RadioGroupPrimitive.Indicator className="radio-indicator">
            <Icon name="RiCircleFill" size={6} />
          </RadioGroupPrimitive.Indicator>
        </span>
        {children}
      </React.Fragment>
    </RadioGroupPrimitive.Item>
  );
});
RadioItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioItem };
