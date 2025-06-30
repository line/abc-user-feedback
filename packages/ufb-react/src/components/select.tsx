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
import * as SelectPrimitive from '@radix-ui/react-select';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { CAPTION_DEFAULT_ICON, ICON_SIZE } from '../constants';
import type { CaptionType, Size } from '../lib/types';
import { cn } from '../lib/utils';
import type { IconNameType } from './icon';
import { Icon } from './icon';
import { ScrollArea, ScrollBar } from './scroll-area';
import useTheme from './use-theme';

type SelectContextType = {
  size: Size;
};

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined,
);

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error('Select components must be used within <Select>');
  return ctx;
}
interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  className?: string;
  size?: Size;
}

const selectVariants = cva('select', {
  variants: {
    size: {
      small: 'select-small',
      medium: 'select-medium',
      large: 'select-large',
    },
    defaultVariants: {
      size: undefined,
    },
  },
});

const Select = ({ size, className, ...props }: SelectProps) => {
  const { themeSize } = useTheme();
  return (
    <SelectContext.Provider value={{ size: size ?? themeSize }}>
      <div
        className={cn(selectVariants({ size: size ?? themeSize, className }))}
      >
        <SelectPrimitive.Root {...props}></SelectPrimitive.Root>
      </div>
    </SelectContext.Provider>
  );
};

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const selectTriggerVariants = cva('select-trigger', {
  variants: {
    size: {
      small: 'select-trigger-small',
      medium: 'select-trigger-medium',
      large: 'select-trigger-large',
    },
    error: {
      true: 'select-trigger-error',
      false: '',
    },
  },
  defaultVariants: {
    size: undefined,
    error: false,
  },
});

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: boolean;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ error, className, children, ...props }, ref) => {
  const { size } = useSelectContext();

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ size, error, className }))}
      {...props}
    >
      <Slottable>{children}</Slottable>
      <SelectPrimitive.Icon asChild>
        <Icon name="RiArrowDownSLine" size={ICON_SIZE[size]} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  maxHeight?: string;
}

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    { maxHeight = 'auto', className, children, position = 'popper', ...props },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn('select-content', className)}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className={cn('select-viewport')}>
          <ScrollArea maxHeight={maxHeight}>
            {children}
            <ScrollBar />
          </ScrollArea>
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('select-group-label', className)}
    {...props}
  />
));
SelectGroupLabel.displayName = 'SelectGroupLabel';

const selectItemVariants = cva('select-item', {
  variants: {
    check: {
      left: 'select-item-left',
      right: 'select-item-right',
    },
  },
  defaultVariants: {
    check: 'left',
  },
});

const selectItemCheckVariants = cva('select-item-check', {
  variants: {
    check: {
      left: 'select-item-check-left',
      right: 'select-item-check-right',
    },
  },
  defaultVariants: {
    check: 'left',
  },
});

type SelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
>;
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      selectItemVariants({
        check: typeof children === 'string' ? 'left' : 'right',
        className,
      }),
    )}
    {...props}
  >
    <SelectPrimitive.ItemIndicator
      className={cn(
        selectItemCheckVariants({
          check: typeof children === 'string' ? 'left' : 'right',
        }),
      )}
    >
      <Icon name="RiCheckLine" size={16} />
    </SelectPrimitive.ItemIndicator>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('select-separator', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectLabel = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'strong'>
>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <strong ref={ref} className={cn('select-label', className)} {...rest} />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const selectCaptionVariants = cva('select-caption', {
  variants: {
    variant: {
      default: 'select-caption-default',
      success: 'select-caption-success',
      info: 'select-caption-info',
      error: 'select-caption-error',
    },
    defaultVariants: {
      variant: 'default',
    },
  },
});

interface SelectCaptionProps extends React.ComponentPropsWithoutRef<'span'> {
  variant?: CaptionType;
  icon?: IconNameType;
  asChild?: boolean;
}

const SelectCaption = React.forwardRef<HTMLElement, SelectCaptionProps>(
  (props, ref) => {
    const {
      icon = undefined,
      variant = 'default',
      className,
      children,
      asChild,
      ...rest
    } = props;
    const { size } = useSelectContext();
    const Comp = asChild ? Slot : 'span';

    return (
      <Comp
        ref={ref}
        className={cn(selectCaptionVariants({ variant, className }))}
        {...rest}
      >
        <Icon
          name={icon ?? CAPTION_DEFAULT_ICON[variant]}
          size={ICON_SIZE[size]}
          className="select-caption-icon"
        />
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);
SelectCaption.displayName = 'SelectCaption';

export {
  Select,
  SelectLabel,
  SelectCaption,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
};
