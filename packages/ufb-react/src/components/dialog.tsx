import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";

import type { Radius } from "../types";
import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Icon } from "./icon";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("dialog", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva("dialog-content", {
  variants: {
    radius: {
      large: "dialog-content-radius-large",
      medium: "dialog-content-radius-medium",
      small: "dialog-content-radius-small",
    },
    defaultVariants: {
      radius: "medium",
    },
  },
});

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  radius?: Radius;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ radius = "medium", className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ radius, className }))}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="dialog-close">
        <Icon name="RiCloseLine" size={20} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const Dialog_Icon_Color_Map: Record<string, string> = {
  RiErrorWarningFill: "dialog-icon-orange",
  RiInformation2Fill: "dialog-icon-blue",
  RiCheckboxCircleFill: "dialog-icon-green",
  RiCloseCircleFill: "dialog-icon-red",
};

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconNameType;
}

const DialogHeader = ({
  icon,
  className,
  children,
  ...props
}: DialogHeaderProps) => (
  <div className={cn("dialog-header", className)} {...props}>
    {icon && (
      <Icon
        name={icon}
        size={32}
        className={cn("dialog-icon", Dialog_Icon_Color_Map[icon])}
      />
    )}
    {children}
  </div>
);
DialogHeader.displayName = "DialogHeader";

const dialogFooterVariants = cva("dialog-footer", {
  variants: {
    align: {
      left: "dialog-footer-left",
      right: "dialog-footer-right",
      center: "dialog-footer-center",
      between: "dialog-footer-between",
      full: "dialog-footer-full",
    },
    defaultVariants: {
      align: "right",
    },
  },
});

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "right" | "center" | "between" | "full";
}

const DialogFooter = ({
  align = "right",
  className,
  ...props
}: DialogFooterProps) => (
  <div className={cn(dialogFooterVariants({ align, className }))} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("dialog-title", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("dialog-description", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
