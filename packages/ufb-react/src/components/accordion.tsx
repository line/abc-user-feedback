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
'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Slottable } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { ICON_SIZE } from '../constants';
import { cn } from '../lib/utils';
import type { Size } from '../types';
import { Icon } from './icon';

const DefaultValue = {
  iconSize: 'small',
  iconAlign: 'right',
  border: false,
} as const;

const AccordionContext = React.createContext<{
  iconSize: Size;
  iconAlign: 'left' | 'right';
}>({
  iconSize: DefaultValue.iconSize,
  iconAlign: DefaultValue.iconAlign,
});

const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    iconSize?: Size;
    iconAlign?: 'left' | 'right';
    border?: boolean;
  }
>(
  (
    {
      iconAlign = DefaultValue.iconAlign,
      iconSize = DefaultValue.iconSize,
      border = DefaultValue.border,
      className,
      ...props
    },
    ref,
  ) => (
    <AccordionContext.Provider value={{ iconAlign, iconSize }}>
      <AccordionPrimitive.Root
        ref={ref}
        className={cn('accordion', border && 'accordion-border', className)}
        {...props}
      />
    </AccordionContext.Provider>
  ),
);
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    divider?: boolean;
  }
>(({ divider = true, className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        'accordion-item',
        divider && 'accordion-item-border',
        className,
      )}
      {...props}
    />
  );
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { iconSize, iconAlign } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'accordion-trigger',
          iconAlign === 'left' && 'accordion-trigger-align-left',
          className,
        )}
        {...props}
      >
        {iconAlign === 'left' && (
          <Icon name="RiArrowDownSLine" size={ICON_SIZE[iconSize]} />
        )}
        <Slottable>{children}</Slottable>
        {iconAlign === 'right' && (
          <Icon name="RiArrowDownSLine" size={ICON_SIZE[iconSize]} />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const accordionContentVariants = cva('accordion-content', {
  variants: {
    iconAlign: {
      left: '',
      right: '',
    },
    iconSize: {
      small: '',
      medium: '',
      large: '',
    },
  },
  compoundVariants: [
    {
      iconAlign: 'left',
      iconSize: 'small',
      className: 'accordion-content-inset-small',
    },
    {
      iconAlign: 'left',
      iconSize: 'medium',
      className: 'accordion-content-inset-medium',
    },
    {
      iconAlign: 'left',
      iconSize: 'large',
      className: 'accordion-content-inset-large',
    },
  ],
  defaultVariants: {
    iconAlign: DefaultValue.iconAlign,
    iconSize: DefaultValue.iconSize,
  },
});

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { iconAlign, iconSize } = React.useContext(AccordionContext);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="accordion-content-box"
      {...props}
    >
      <div
        className={cn(
          accordionContentVariants({ iconAlign, iconSize, className }),
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
});

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
