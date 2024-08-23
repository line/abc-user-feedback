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
import type { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';

import { cn } from '../lib/utils';
import type { IconNameType } from './icon';
import { Icon } from './icon';
import { ScrollArea, ScrollBar } from './scroll-area';

const Dropdown = DropdownPrimitive.Root;

const DropdownTrigger = DropdownPrimitive.Trigger;

const DropdownGroup = DropdownPrimitive.Group;

const DropdownPortal = DropdownPrimitive.Portal;

const DropdownSub = DropdownPrimitive.Sub;

const DropdownRadioGroup = DropdownPrimitive.RadioGroup;

const DropdownSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubTrigger> & {
    inset?: boolean;
    iconL?: IconNameType;
    iconR?: IconNameType;
    caption?: React.ReactNode;
  }
>(({ iconL, iconR, caption, className, inset, children, ...props }, ref) => (
  <DropdownPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'dropdown-sub-trigger',
      inset && 'dropdown-sub-trigger-inset',
      className,
    )}
    {...props}
  >
    {iconL && <Icon name={iconL} size={16} />}
    <div className="dropdown-item-text">{children}</div>
    {caption && <span className="dropdown-caption">{caption}</span>}
    {iconR && <Icon name={iconR} size={16} />}
  </DropdownPrimitive.SubTrigger>
));
DropdownSubTrigger.displayName = DropdownPrimitive.SubTrigger.displayName;

const DropdownSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.SubContent
    ref={ref}
    className={cn('dropdown-sub-content', className)}
    {...props}
  />
));
DropdownSubContent.displayName = DropdownPrimitive.SubContent.displayName;

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content> & {
    maxHeight?: string;
  }
>(({ children, className, sideOffset = 4, maxHeight, ...props }, ref) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn('dropdown-content', className)}
      {...props}
    >
      <ScrollArea maxHeight={maxHeight}>
        {children}
        <ScrollBar />
      </ScrollArea>
    </DropdownPrimitive.Content>
  </DropdownPrimitive.Portal>
));
DropdownContent.displayName = DropdownPrimitive.Content.displayName;

const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item> & {
    inset?: boolean;
    iconL?: IconNameType;
    iconR?: IconNameType;
    caption?: React.ReactNode;
  }
>(({ iconL, iconR, caption, children, className, inset, ...props }, ref) => (
  <DropdownPrimitive.Item
    ref={ref}
    className={cn('dropdown-item', inset && 'dropdown-item-inset', className)}
    {...props}
  >
    {iconL && <Icon name={iconL} size={16} />}
    <div className="dropdown-item-text">{children}</div>
    {caption && <span className="dropdown-caption">{caption}</span>}
    {iconR && <Icon name={iconR} size={16} />}
  </DropdownPrimitive.Item>
));
DropdownItem.displayName = DropdownPrimitive.Item.displayName;

const DropdownCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownPrimitive.CheckboxItem
    ref={ref}
    className={cn('dropdown-checkbox', className)}
    checked={checked}
    {...props}
  >
    <span className="dropdown-checkbox-icon">
      <DropdownPrimitive.ItemIndicator>
        <Icon name="RiCheckLine" size={16} />
      </DropdownPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownPrimitive.CheckboxItem>
));
DropdownCheckboxItem.displayName = DropdownPrimitive.CheckboxItem.displayName;

const DropdownRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownPrimitive.RadioItem
    ref={ref}
    className={cn('dropdown-radio', className)}
    {...props}
  >
    <DropdownPrimitive.ItemIndicator className="dropdown-radio-icon">
      <Icon name="RiCircleFill" size={8} className="fill-current" />
    </DropdownPrimitive.ItemIndicator>
    {children}
  </DropdownPrimitive.RadioItem>
));
DropdownRadioItem.displayName = DropdownPrimitive.RadioItem.displayName;

const DropdownLabel = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownPrimitive.Label
    ref={ref}
    className={cn('dropdown-label', inset && 'dropdown-label-inset', className)}
    {...props}
  />
));
DropdownLabel.displayName = DropdownPrimitive.Label.displayName;

const DropdownSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownPrimitive.Separator
    ref={ref}
    className={cn('dropdown-separator', className)}
    {...props}
  />
));
DropdownSeparator.displayName = DropdownPrimitive.Separator.displayName;

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
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
