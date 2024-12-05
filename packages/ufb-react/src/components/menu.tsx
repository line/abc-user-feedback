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

interface MenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {}

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
  MenuItemProps
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
  const { size = DefaultValue.size } = React.useContext(MenuContext);

  return (
    <DropdownTrigger
      ref={ref}
      variant={variant}
      className={cn("justify-between", menuItemVariants({ size, className }))}
      {...props}
    >
      <div className="flex">{children}</div>
      <Icon name="RiArrowRightSLine" />
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
