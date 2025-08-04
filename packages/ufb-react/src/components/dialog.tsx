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
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { Radius } from "../types";
import { ALERT_DEFAULT_ICON } from "../constants";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";
import useTheme from "./use-theme";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  DialogPrimitive.DialogTriggerProps &
    React.ComponentPropsWithoutRef<typeof Button>
>(({ variant = "outline", children, ...props }, ref) => {
  if (props.asChild) {
    return (
      <DialogPrimitive.Trigger ref={ref} {...props}>
        {children}
      </DialogPrimitive.Trigger>
    );
  }

  return (
    <DialogPrimitive.Trigger asChild>
      <Button variant={variant} ref={ref} {...props}>
        {children}
      </Button>
    </DialogPrimitive.Trigger>
  );
});
DialogTrigger.displayName = DialogPrimitive.DialogTrigger.displayName;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ variant, ...props }, ref) => (
  <DialogPrimitive.Close asChild>
    <Button ref={ref} variant={variant ?? "outline"} {...props} />
  </DialogPrimitive.Close>
));
DialogClose.displayName = "DialogClose";

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
      <DialogOverlay>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            dialogContentVariants({ radius: radius ?? themeRadius, className }),
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close asChild>
            <Button
              size="medium"
              variant="ghost"
              className="dialog-close"
              aria-label="Close"
            >
              <Icon name="RiCloseLine" />
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
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
  const { className, name, size = 32, variant, ...rest } = props;
  return (
    <Icon
      {...rest}
      name={name ?? ALERT_DEFAULT_ICON[variant ?? "default"]}
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

interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}
const DialogBody = ({ asChild, className, ...props }: DialogBodyProps) => {
  const Comp = asChild ? Slot : "div";
  return (
    <ScrollArea>
      <Comp className={cn("dialog-body", className)} {...props} />
      <ScrollBar />
    </ScrollArea>
  );
};
DialogBody.displayName = "DialogBody";

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
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogIcon,
};
