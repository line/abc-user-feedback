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
"use client";

import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { Slottable } from "@radix-ui/react-slot";

import type { TriggerType } from "../lib/types";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Icon } from "./icon";
import { ScrollArea, ScrollBar } from "./scroll-area";

const DropdownContext = React.createContext<{
  trigger: TriggerType;
  isHover: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<TriggerType>>;
  setIsHover: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  trigger: "click",
  setTrigger: () => "click",
  isHover: false,
  setIsHover: () => false,
});

const Dropdown = ({
  open = false,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Root>) => {
  const [trigger, setTrigger] = React.useState<TriggerType>("click");
  const [isHover, setIsHover] = React.useState(false);
  return (
    <DropdownContext.Provider
      value={{ trigger, setTrigger, isHover, setIsHover }}
    >
      <DropdownPrimitive.Root
        {...props}
        open={open || isHover}
        onOpenChange={(open: boolean) => {
          setIsHover(open);
          onOpenChange?.(open);
        }}
      />
    </DropdownContext.Provider>
  );
};

const DropdownTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.Trigger>,
  DropdownPrimitive.DropdownMenuTriggerProps &
    React.ComponentPropsWithoutRef<typeof Button> & {
      trigger?: TriggerType;
    }
>(
  (
    {
      variant = "outline",
      trigger,
      onMouseEnter,
      onMouseLeave,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { setTrigger, setIsHover } = React.useContext(DropdownContext);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trigger === "hover") {
        setIsHover(true);
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (trigger === "hover") {
        setIsHover(false);
      }
      onMouseLeave?.(e);
    };

    React.useEffect(() => {
      if (trigger) {
        setTrigger(trigger);
      }
    }, []);

    if (props.asChild) {
      return (
        <DropdownPrimitive.Trigger
          className={cn("dropdown-trigger", className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={ref}
          {...props}
        >
          {children}
        </DropdownPrimitive.Trigger>
      );
    }

    return (
      <DropdownPrimitive.Trigger asChild>
        <Button
          variant={variant}
          className={cn("dropdown-trigger", className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </DropdownPrimitive.Trigger>
    );
  },
);
DropdownTrigger.displayName = DropdownPrimitive.DropdownMenuTrigger.displayName;

const DropdownGroup = DropdownPrimitive.Group;

const DropdownPortal = DropdownPrimitive.Portal;

const DropdownSub = DropdownPrimitive.Sub;

const DropdownRadioGroup = DropdownPrimitive.RadioGroup;

const DropdownSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownPrimitive.SubTrigger
      ref={ref}
      className={cn("dropdown-sub-trigger", className)}
      {...props}
    >
      {children}
    </DropdownPrimitive.SubTrigger>
  );
});
DropdownSubTrigger.displayName = DropdownPrimitive.SubTrigger.displayName;

const DropdownCaption = React.forwardRef<
  React.ComponentRef<"span">,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("dropdown-caption", className)} {...props} />
));
DropdownCaption.displayName = "DropdownCaption";

const DropdownSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.SubContent
    ref={ref}
    className={cn("dropdown-sub-content", className)}
    {...props}
  />
));
DropdownSubContent.displayName = DropdownPrimitive.SubContent.displayName;

const DropdownContent = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content> & {
    maxHeight?: string;
  }
>(
  (
    {
      children,
      className,
      sideOffset = 4,
      maxHeight,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref,
  ) => {
    const { trigger, setIsHover } = React.useContext(DropdownContext);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        setIsHover(true);
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        setIsHover(false);
      }
      onMouseLeave?.(e);
    };

    return (
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn("dropdown-content", className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          <ScrollArea maxHeight={maxHeight}>
            {children}
            <ScrollBar />
          </ScrollArea>
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    );
  },
);
DropdownContent.displayName = DropdownPrimitive.Content.displayName;

const DropdownItem = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ children, className, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    className={cn("dropdown-item", className)}
    {...props}
  >
    {children}
  </DropdownPrimitive.Item>
));
DropdownItem.displayName = DropdownPrimitive.Item.displayName;

const DropdownCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownPrimitive.CheckboxItem
    ref={ref}
    className={cn("dropdown-checkbox", className)}
    checked={checked}
    {...props}
  >
    <DropdownPrimitive.ItemIndicator className="dropdown-checkbox-icon">
      <Icon name="RiCheckLine" size={16} />
    </DropdownPrimitive.ItemIndicator>
    <Slottable>{children}</Slottable>
  </DropdownPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = DropdownPrimitive.CheckboxItem.displayName;

const DropdownRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownPrimitive.RadioItem
    ref={ref}
    className={cn("dropdown-radio", className)}
    {...props}
  >
    <DropdownPrimitive.ItemIndicator className="dropdown-radio-icon">
      <Icon name="RiCircleFill" size={8} className="fill-current" />
    </DropdownPrimitive.ItemIndicator>
    <Slottable>{children}</Slottable>
  </DropdownPrimitive.RadioItem>
));
DropdownRadioItem.displayName = DropdownPrimitive.RadioItem.displayName;

const DropdownLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Label
    ref={ref}
    className={cn("dropdown-label", className)}
    {...props}
  />
));
DropdownLabel.displayName = DropdownPrimitive.Label.displayName;

const DropdownSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Separator
    ref={ref}
    className={cn("dropdown-separator", className)}
    {...props}
  />
));
DropdownSeparator.displayName = DropdownPrimitive.Separator.displayName;

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownCaption,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownGroup,
  DropdownPortal,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownRadioGroup,
  type DropdownMenuCheckboxItemProps,
};
