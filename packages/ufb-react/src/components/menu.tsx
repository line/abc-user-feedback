/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva } from 'class-variance-authority';

import { ICON_SIZE } from '../constants';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import type { IconNameType } from './icon';
import { Icon } from './icon';

const DefaultValue = {
  align: 'horizontal',
  size: 'small',
} as const;

const menuVariants = cva('menu', {
  variants: {
    align: {
      horizontal: 'menu-horizontal',
      vertical: 'menu-vertical',
    },
    defaultVariants: {
      align: DefaultValue.align,
    },
  },
});

const MenuContext = React.createContext<{
  align?: 'vertical' | 'horizontal';
  size?: 'small' | 'medium' | 'large';
}>({
  align: DefaultValue.align,
  size: DefaultValue.size,
});

const Menu = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
    align?: 'vertical' | 'horizontal';
    size?: 'small' | 'medium' | 'large';
  }
>(
  (
    {
      align = DefaultValue.align,
      size = DefaultValue.size,
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(menuVariants({ align, className }))}
      {...props}
    >
      <MenuContext.Provider value={{ align, size }}>
        {children}
      </MenuContext.Provider>
    </ToggleGroupPrimitive.Root>
  ),
);
Menu.displayName = ToggleGroupPrimitive.Root.displayName;

interface MenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> {
  iconL?: IconNameType;
  iconR?: IconNameType;
  badge?: React.ReactNode;
}

const menuItemVariants = cva('menu-item', {
  variants: {
    size: {
      small: 'menu-item-small',
      medium: 'menu-item-medium',
      large: 'menu-item-large',
    },
    defaultVariants: {
      size: DefaultValue.size,
    },
  },
});

const MenuItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  MenuItemProps
>(({ iconL, iconR, badge, children, className, ...props }, ref) => {
  const { size = DefaultValue.size } = React.useContext(MenuContext);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(menuItemVariants({ size, className }))}
      {...props}
    >
      {iconL && <Icon name={iconL} size={ICON_SIZE[size]} />}
      <span>{children}</span>
      {badge && (
        <Badge type="bold" color="default" radius="large">
          {badge}
        </Badge>
      )}
      {iconR && <Icon name={iconR} size={ICON_SIZE[size]} />}
    </ToggleGroupPrimitive.Item>
  );
});
MenuItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { Menu, MenuItem };
