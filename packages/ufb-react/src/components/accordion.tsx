import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva } from "class-variance-authority";

import type { Size } from "../types";
import { ICON_SIZE } from "../constants";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

const DefaultValue = {
  iconSize: "small",
  iconAlign: "right",
  useDivider: true,
  useBorder: false,
  useBgColor: false,
} as const;

const AccordionContext = React.createContext<{
  iconSize: Size;
  iconAlign: "left" | "right";
  useDivider: boolean;
  useBgColor: boolean;
}>({
  iconSize: DefaultValue.iconSize,
  iconAlign: DefaultValue.iconAlign,
  useDivider: DefaultValue.useDivider,
  useBgColor: DefaultValue.useBgColor,
});

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    iconSize?: Size;
    iconAlign?: "left" | "right";
    useDivider?: boolean;
    useBorder?: boolean;
    useBgColor?: boolean;
  }
>(
  (
    {
      iconAlign = DefaultValue.iconAlign,
      iconSize = DefaultValue.iconSize,
      useDivider = DefaultValue.useDivider,
      useBorder = DefaultValue.useBorder,
      useBgColor = DefaultValue.useBgColor,
      className,
      ...props
    },
    ref,
  ) => (
    <AccordionContext.Provider
      value={{ iconAlign, iconSize, useDivider, useBgColor }}
    >
      <AccordionPrimitive.Root
        ref={ref}
        className={cn("accordion", useBorder && "accordion-border", className)}
        {...props}
      />
    </AccordionContext.Provider>
  ),
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { useDivider } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        "accordion-item",
        useDivider && "accordion-item-border",
        className,
      )}
      {...props}
    />
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { iconSize, iconAlign, useBgColor } =
    React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "accordion-trigger",
          useBgColor && "accordion-trigger-bg",
          className,
        )}
        {...props}
      >
        {iconAlign === "left" && (
          <Icon name="RiArrowDownSLine" size={ICON_SIZE[iconSize]} />
        )}
        <strong>{children}</strong>
        {iconAlign === "right" && (
          <Icon name="RiArrowDownSLine" size={ICON_SIZE[iconSize]} />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const accordionContentVariants = cva("accordion-content", {
  variants: {
    iconAlign: {
      left: "",
      right: "",
    },
    iconSize: {
      small: "",
      medium: "",
      large: "",
    },
  },
  compoundVariants: [
    {
      iconAlign: "left",
      iconSize: "small",
      className: "accordion-content-inset-small",
    },
    {
      iconAlign: "left",
      iconSize: "medium",
      className: "accordion-content-inset-medium",
    },
    {
      iconAlign: "left",
      iconSize: "large",
      className: "accordion-content-inset-large",
    },
  ],
  defaultVariants: {
    iconAlign: DefaultValue.iconAlign,
    iconSize: DefaultValue.iconSize,
  },
});

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { iconAlign, iconSize } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="accordion-content-box"
      {...props}
    >
      <div
        className={cn(
          accordionContentVariants({ iconAlign, iconSize, className }),
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
