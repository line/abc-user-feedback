import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";

import type { Radius } from "../types";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import useTheme from "./use-theme";

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
      radius: undefined,
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
>(({ radius, className, children, ...props }, ref) => {
  const { themeRadius } = useTheme();
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          dialogContentVariants({ radius: radius ?? themeRadius, className }),
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close asChild>
          <IconButton
            icon="RiCloseLine"
            size="medium"
            variant="ghost"
            className="dialog-close"
            aria-label="Close"
          />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const dialogIconVariants = cva("dialog-icon", {
  variants: {
    variant: {
      default: "dialog-icon-default",
      warning: "dialog-icon-warning",
      success: "dialog-icon-success",
      error: "dialog-icon-error",
      informative: "dialog-icon-informative",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const DialogIcon = (
  props: React.ComponentPropsWithoutRef<typeof Icon> &
    VariantProps<typeof dialogIconVariants>,
) => {
  const { className, name, size = 32, variant = "default", ...rest } = props;
  return (
    <Icon
      {...rest}
      name={name}
      size={size}
      className={cn(dialogIconVariants({ variant, className }))}
    />
  );
};
DialogIcon.displayName = "DialogIcon";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("dialog-header", className)} {...props} />
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
  DialogIcon,
};
