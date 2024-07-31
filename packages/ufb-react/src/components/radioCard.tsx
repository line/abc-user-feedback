import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

import type { Radius } from "../types";
import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

const radioCardGroupVariants = cva("radio-card-group", {
  variants: {
    orientation: {
      horizontal: "radio-card-group-horizontal",
      vertical: "radio-card-group-vertical",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const RadioGroupContext = React.createContext<RadioCardGroupProps>({
  cardType: "vertical",
  radius: "medium",
});

type RadioCardGroupProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  cardType?: "horizontal" | "vertical";
  radius?: Radius;
};

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioCardGroupProps
>(
  (
    {
      orientation = "horizontal",
      radius = "medium",
      cardType = "vertical",
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <RadioGroupPrimitive.Root
        className={cn(radioCardGroupVariants({ orientation, className }))}
        {...props}
        ref={ref}
      >
        <RadioGroupContext.Provider value={{ cardType, radius }}>
          {children}
        </RadioGroupContext.Provider>
      </RadioGroupPrimitive.Root>
    );
  },
);
RadioCardGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioCardVariants = cva("radio-card", {
  variants: {
    type: {
      vertical: "radio-card-vertical",
      horizontal: "radio-card-horizontal",
    },
    radius: {
      small: "radio-card-radius-small",
      medium: "radio-card-radius-medium",
      large: "radio-card-radius-large",
    },
  },
  defaultVariants: {
    type: "vertical",
    radius: "medium",
  },
});

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioCardVariants> & {
      icon?: IconNameType;
      title?: React.ReactNode;
      description?: React.ReactNode;
    }
>(({ icon, title, description, className, ...props }, ref) => {
  const { radius, cardType: type } = React.useContext(RadioGroupContext);
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioCardVariants({ type, radius, className }))}
      {...props}
    >
      {icon && <Icon name={icon} size={24} />}
      <span className="radio-card-text">
        {title && <strong className="radio-card-title">{title}</strong>}
        {description && (
          <span className="radio-card-description">{description}</span>
        )}
      </span>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioCardGroup, RadioCard };
