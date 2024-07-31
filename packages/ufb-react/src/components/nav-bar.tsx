import * as React from "react";
import { cva } from "class-variance-authority";

import type { IconNameType } from "./icon";
import { cn } from "../lib/utils";
import { Divider } from "./divider";
import {
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownTrigger,
} from "./dropdown";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import { Menu, MenuItem } from "./menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const navBarVariants = cva("nav-bar", {
  variants: {},
  defaultVariants: {},
});

const NavBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(navBarVariants({ className }))} {...props}>
    {children}
  </div>
));
NavBar.displayName = "NavBar";

type NavBarMenuProps = React.ComponentPropsWithoutRef<typeof Menu> & {
  items?: React.ComponentPropsWithoutRef<typeof MenuItem>[];
};
const NavBarMenu = React.forwardRef<
  React.ElementRef<typeof Menu>,
  NavBarMenuProps
>(({ className, items, ...props }, ref) => (
  <Menu ref={ref} className={cn("nav-bar-menu", className)} {...props}>
    {items?.map((item, index) => <MenuItem key={index} {...item} />)}
  </Menu>
));
NavBarMenu.displayName = "NavBarMenu";

type NavBarLogoProps = React.ComponentPropsWithoutRef<typeof Icon> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;
const NavBarLogo = ({ className, name, ...props }: NavBarLogoProps) => (
  <button type="button" className={cn("nav-bar-logo", className)} {...props}>
    <Icon name={name} size={24} />
  </button>
);

type NavBarDividerProps = React.ComponentPropsWithoutRef<typeof Divider>;
const NavBarDivider = ({ className, ...props }: NavBarDividerProps) => (
  <Divider
    {...props}
    type="subtle"
    indent={8}
    orientation="vertical"
    className={cn("nav-bar-divider", className)}
  />
);

type NavBarSelectProps = React.ComponentPropsWithoutRef<typeof Select> &
  React.ComponentPropsWithoutRef<typeof SelectTrigger> & {
    items?: React.ComponentPropsWithoutRef<typeof SelectItem>[];
  };
const NavBarSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  NavBarSelectProps
>(({ className, icon, items, ...props }, ref) => (
  <Select {...props}>
    <SelectTrigger
      icon={icon}
      size="small"
      className={cn("nav-bar-select", className)}
    >
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent ref={ref}>
      <SelectGroup>
        {items?.map((item, index) => <SelectItem {...item} key={index} />)}
      </SelectGroup>
    </SelectContent>
  </Select>
));
NavBarSelect.displayName = "NavBarSelect";

const NavBarDropdownButton = React.forwardRef<
  React.ElementRef<typeof Dropdown>,
  React.ComponentPropsWithoutRef<typeof Dropdown> &
    React.ComponentPropsWithoutRef<typeof DropdownTrigger> & {
      triggerIcon: IconNameType;
      items?: React.ComponentPropsWithoutRef<typeof DropdownItem>[];
    }
>(({ triggerIcon, items, className, ...props }, ref) => (
  <Dropdown {...props}>
    <DropdownTrigger asChild className={cn("nav-bar-dropdown", className)}>
      <IconButton icon={triggerIcon} size="medium" variant="ghost" />
    </DropdownTrigger>
    <DropdownContent ref={ref} className="nav-bar-dropdown-content">
      <DropdownGroup>
        {items?.map((item, index) => <DropdownItem key={index} {...item} />)}
      </DropdownGroup>
    </DropdownContent>
  </Dropdown>
));
NavBarDropdownButton.displayName = "NavBarDropdownButton";

const NavBarButton = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof IconButton>) => (
  <IconButton
    size="medium"
    variant="ghost"
    className={cn("nav-bar-button", className)}
    {...props}
  />
);
NavBarButton.displayName = "NavBarButton";

export {
  NavBar,
  NavBarMenu,
  NavBarLogo,
  NavBarDivider,
  NavBarSelect,
  NavBarDropdownButton,
  NavBarButton,
};
