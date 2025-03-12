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
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
} from "./dropdown";
import { Icon } from "./icon";

const DefaultValue = {
  orientation: "horizontal",
  size: "small",
} as const;

const menuVariants = cva("menu", {
  variants: {
    orientation: {
      horizontal: "menu-horizontal",
      vertical: "menu-vertical",
    },
    defaultVariants: {
      orientation: DefaultValue.orientation,
    },
  },
});

const MenuContext = React.createContext<{
  orientation?: "vertical" | "horizontal";
  size?: "small" | "medium" | "large";
}>({
  orientation: DefaultValue.orientation,
  size: DefaultValue.size,
});

const Menu = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
    orientation?: "vertical" | "horizontal";
    size?: "small" | "medium" | "large";
  }
>(
  (
    {
      orientation = DefaultValue.orientation,
      size = DefaultValue.size,
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(menuVariants({ orientation, className }))}
      {...props}
    >
      <MenuContext.Provider value={{ orientation, size }}>
        {children}
      </MenuContext.Provider>
    </ToggleGroupPrimitive.Root>
  ),
);
Menu.displayName = ToggleGroupPrimitive.Root.displayName;

const menuItemVariants = cva("!menu-item", {
  variants: {
    size: {
      small: "!menu-item-small",
      medium: "!menu-item-medium",
      large: "!menu-item-large",
    },
    defaultVariants: {
      size: DefaultValue.size,
    },
  },
});

const MenuItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ children, className, ...props }, ref) => {
  const { size = DefaultValue.size } = React.useContext(MenuContext);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(menuItemVariants({ size, className }))}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
MenuItem.displayName = ToggleGroupPrimitive.Item.displayName;

const MenuDropdown = Dropdown;

const MenuDropdownTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownTrigger>
>(({ variant = "ghost", className, children, ...props }, ref) => {
  const { size = DefaultValue.size, orientation } =
    React.useContext(MenuContext);

  if (props.asChild) {
    return (
      <DropdownTrigger
        className={cn(menuItemVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </DropdownTrigger>
    );
  }

  return (
    <DropdownTrigger
      ref={ref}
      variant={variant}
      className={cn(
        "flex justify-between",
        menuItemVariants({ size, className }),
      )}
      {...props}
    >
      {children}
      {orientation === "vertical" && <Icon name="RiArrowRightSLine" />}
    </DropdownTrigger>
  );
});
MenuDropdownTrigger.displayName = "MenuDropdownTrigger";

const MenuDropdownContent = DropdownContent;
const MenuDropdownGroup = DropdownGroup;
const MenuDropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownItem>,
  React.ComponentPropsWithoutRef<typeof MenuItem>
>(({ className, ...props }, ref) => (
  <DropdownItem ref={ref} className={cn("menu-dropdown-item", className)}>
    <MenuItem {...props} />
  </DropdownItem>
));
MenuDropdownItem.displayName = "MenuDropdownItem";

export {
  Menu,
  MenuItem,
  MenuDropdown,
  MenuDropdownTrigger,
  MenuDropdownContent,
  MenuDropdownGroup,
  MenuDropdownItem,
};
