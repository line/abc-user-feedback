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
import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';
import type { Radius } from '../types';
import useTheme from './use-theme';

const radioCardGroupVariants = cva('radio-card-group', {
  variants: {
    orientation: {
      horizontal: 'radio-card-group-horizontal',
      vertical: 'radio-card-group-vertical',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const RadioGroupContext = React.createContext<RadioCardGroupProps>({
  cardType: 'vertical',
  radius: 'medium',
});

type RadioCardGroupProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  cardType?: 'horizontal' | 'vertical';
  radius?: Radius;
};

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioCardGroupProps
>(
  (
    {
      orientation = 'horizontal',
      radius,
      cardType = 'vertical',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const { themeRadius } = useTheme();
    return (
      <RadioGroupPrimitive.Root
        className={cn(radioCardGroupVariants({ orientation, className }))}
        {...props}
        ref={ref}
      >
        <RadioGroupContext.Provider
          value={{ cardType, radius: radius ?? themeRadius }}
        >
          {children}
        </RadioGroupContext.Provider>
      </RadioGroupPrimitive.Root>
    );
  },
);
RadioCardGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioCardVariants = cva('radio-card', {
  variants: {
    type: {
      vertical: 'radio-card-vertical',
      horizontal: 'radio-card-horizontal',
    },
    radius: {
      small: 'radio-card-radius-small',
      medium: 'radio-card-radius-medium',
      large: 'radio-card-radius-large',
    },
  },
  defaultVariants: {
    type: 'vertical',
    radius: undefined,
  },
});

const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioCardVariants> & {
      icon?: React.ReactNode;
      title?: React.ReactNode;
      description?: React.ReactNode;
    }
>(({ icon, title, description, className, ...props }, ref) => {
  const { radius, cardType: type } = React.useContext(RadioGroupContext);
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioCardVariants({ type, radius, className }))}
      {...props}
    >
      {icon}
      <span className="radio-card-text">
        {title && <strong className="radio-card-title">{title}</strong>}
        {description && (
          <span className="radio-card-description">{description}</span>
        )}
      </span>
    </RadioGroupPrimitive.Item>
  );
});
RadioCard.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioCardGroup, RadioCard };
