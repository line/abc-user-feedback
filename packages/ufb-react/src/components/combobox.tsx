import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";

import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea, ScrollBar } from "./scroll-area";

const Combobox = Popover;
Combobox.displayName = "Combobox";

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    {...props}
    className={cn("combobox-content", className)}
  >
    <CommandPrimitive>{children}</CommandPrimitive>
  </PopoverContent>
));
ComboboxContent.displayName = CommandPrimitive.displayName;

const ComboboxInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="combobox-input-box" cmdk-input-wrapper="">
    <Icon name="RiSearchLine" size={16} className="combobox-icon" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn("combobox-input", className)}
      {...props}
    />
  </div>
));

ComboboxInput.displayName = CommandPrimitive.Input.displayName;

const ComboboxList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> & {
    maxHeight?: string;
  }
>(({ maxHeight, className, ...props }, ref) => (
  <ScrollArea maxHeight={maxHeight}>
    <CommandPrimitive.List
      ref={ref}
      className={cn("combobox-list", className)}
      {...props}
    />
    <ScrollBar />
  </ScrollArea>
));

ComboboxList.displayName = CommandPrimitive.List.displayName;

const ComboboxEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="combobox-empty" {...props} />
));

ComboboxEmpty.displayName = CommandPrimitive.Empty.displayName;

const ComboboxGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn("combobox-group", className)}
    {...props}
  />
));

ComboboxGroup.displayName = CommandPrimitive.Group.displayName;

const ComboboxSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("combobox-separator", className)}
    {...props}
  />
));
ComboboxSeparator.displayName = CommandPrimitive.Separator.displayName;

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    inset?: boolean;
    iconL?: IconNameType;
    iconR?: IconNameType;
    caption?: React.ReactNode;
  }
>(({ inset, iconL, iconR, caption, children, className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn("combobox-item", inset && "combobox-item-inset", className)}
    {...props}
  >
    <React.Fragment>
      {iconL && <Icon name={iconL} size={16} />}
      <div className="combobox-item-text">{children}</div>
      {caption && <span className="combobox-caption">{caption}</span>}
      {iconR && <Icon name={iconR} size={16} />}
    </React.Fragment>
  </CommandPrimitive.Item>
));

ComboboxItem.displayName = CommandPrimitive.Item.displayName;

const ComboboxSelectItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    iconL?: IconNameType;
    iconR?: IconNameType;
    caption?: React.ReactNode;
    checked?: boolean;
  }
>(({ iconL, iconR, caption, checked, children, className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn("combobox-item", className)}
    {...props}
  >
    <React.Fragment>
      <Icon
        name="RiCheckLine"
        size={20}
        color={checked ? "currentColor" : "transparent"}
      />
      {iconL && <Icon name={iconL} size={16} />}
      <div className="combobox-item-text">{children}</div>
      {caption && <span className="combobox-caption">{caption}</span>}
      {iconR && <Icon name={iconR} size={16} />}
    </React.Fragment>
  </CommandPrimitive.Item>
));

ComboboxSelectItem.displayName = "ComboboxSelectItem";

const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(
  (
    {
      variant = "outline",
      iconR = "RiArrowDownSLine",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant={variant}
          iconR={iconR}
          className={cn(
            "combobox-trigger",
            iconR === "RiArrowDownSLine" && "combobox-trigger-icon-rotate",
            className,
          )}
          {...props}
        >
          {children}
        </Button>
      </PopoverTrigger>
    );
  },
);
ComboboxTrigger.displayName = "ComboboxTrigger";

export {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSelectItem,
  ComboboxSeparator,
  ComboboxTrigger,
};
