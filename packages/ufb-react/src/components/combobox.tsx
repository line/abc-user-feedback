import type { DialogProps } from "@radix-ui/react-dialog";
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";

import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "./dialog";
import { Icon } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";

const Combobox = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn("combobox", className)}
    {...props}
  />
));
Combobox.displayName = CommandPrimitive.displayName;

type ComboboxDialogProps = DialogProps;

const ComboboxDialog = ({ children, ...props }: ComboboxDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Combobox>{children}</Combobox>
      </DialogContent>
    </Dialog>
  );
};

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

export {
  Combobox,
  ComboboxDialog,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSeparator,
};
