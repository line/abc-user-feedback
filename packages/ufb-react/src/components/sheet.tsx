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
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Trigger>,
  SheetPrimitive.DialogTriggerProps &
    React.ComponentPropsWithoutRef<typeof Button>
>(({ variant = "outline", className, children, ...props }, ref) => {
  if (props.asChild) {
    return (
      <SheetPrimitive.Trigger
        className={cn("sheet-trigger", className)}
        ref={ref}
        {...props}
      >
        {children}
      </SheetPrimitive.Trigger>
    );
  }
  return (
    <SheetPrimitive.Trigger asChild>
      <Button
        variant={variant}
        className={cn("sheet-trigger", className)}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    </SheetPrimitive.Trigger>
  );
});
SheetTrigger.displayName = SheetPrimitive.Trigger.displayName;

const SheetClose = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ variant, ...props }, ref) => (
  <SheetPrimitive.Close asChild>
    <Button ref={ref} variant={variant ?? "outline"} {...props} />
  </SheetPrimitive.Close>
));
SheetClose.displayName = "SheetClose";

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn("sheet-overlay", className)}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva("sheet", {
  variants: {
    side: {
      top: "sheet-side-top",
      bottom: "sheet-side-bottom",
      left: "sheet-side-left",
      right: "sheet-side-right",
    },
    radius: {
      small: "sheet-radius-small",
      medium: "sheet-radius-medium",
      large: "sheet-radius-large",
    },
  },
  defaultVariants: {
    side: "right",
    radius: "small",
  },
});

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    { side = "right", radius = "small", className, children, ...props },
    ref,
  ) => (
    <SheetPortal>
      <SheetOverlay onClick={(e) => e.stopPropagation()}>
        <SheetPrimitive.Content
          ref={ref}
          className={cn(sheetVariants({ side, radius }), className)}
          {...props}
        >
          {children}
          <SheetPrimitive.Close asChild>
            <Button
              size="medium"
              variant="ghost"
              className="sheet-close"
              aria-label="Close"
            >
              <Icon name="RiCloseLine" />
            </Button>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetOverlay>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconNameType;
}
const SheetHeader = ({
  icon,
  children,
  className,
  ...props
}: SheetHeaderProps) => (
  <div className={cn("sheet-header", className)} {...props}>
    {icon && <Icon name={icon} size={38} className="sheet-icon" />}
    {children}
  </div>
);
SheetHeader.displayName = "SheetHeader";

interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}
const SheetBody = ({ asChild, className, ...props }: SheetBodyProps) => {
  const Comp = asChild ? Slot : "div";
  return (
    <ScrollArea>
      <Comp className={cn(className)} {...props} />
      <ScrollBar />
    </ScrollArea>
  );
};
SheetBody.displayName = "SheetBody";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("sheet-footer", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("sheet-title", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("sheet-description", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
