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
import type { CaptionType } from '../lib/types';
import { cn } from '../lib/utils';
import type { Size } from '../types';
import type { IconNameType } from './icon';
import { Icon } from './icon';
import { ScrollArea, ScrollBar } from './scroll-area';
import { Tag } from './tag';
import useTheme from './use-theme';

interface Item {
  icon?: SelectItemProps['icon'];
  children: SelectItemProps['children'];
}
interface SelectContextProps {
  type: SelectProps['type'];
  size?: SelectProps['size'];
  error?: SelectProps['error'];
  value?: SingleSelectProps['value'];
  values?: MultipleSelectProps['values'];
  itemByValue: Record<string, Item>;
  setItemByValue: React.Dispatch<React.SetStateAction<Record<string, Item>>>;
}
const SelectContext = React.createContext<SelectContextProps>({
  type: 'single',
  size: undefined,
  error: false,
  value: undefined,
  values: [],
  setItemByValue: () => {},
  itemByValue: {},
});

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

type SelectProps = {
  type?: 'single' | 'multiple';
  size?: Size;
  error?: boolean;
} & SingleSelectProps &
  MultipleSelectProps;

const Select = ({
  type = 'single',
  size,
  error = false,
  value,
  values = [],
  onValueChange,
  onValuesChange,
  ...props
}: SelectProps) => {
  const { themeSize } = useTheme();
  const [singleValue, setSingleValue] = React.useState<string | undefined>(
    value,
  );
  const [multipleValues, setMultipleValues] = React.useState<string[]>(values);
  const [itemByValue, setItemByValue] = React.useState<Record<string, Item>>(
    {},
  );

  const handleSingleValueChange = (value: string) => {
    setSingleValue(value);
    onValueChange?.(value);
  };

  const handleMultipleValuesChange = (values: string[]) => {
    setMultipleValues(values);
    onValuesChange?.(values);
  };

  React.useEffect(() => {
    if (singleValue === value) return;
    setSingleValue(value);
  }, [value]);

  React.useEffect(() => {
    if (
      values.every((v) => multipleValues.includes(v)) &&
      multipleValues.every((v) => values.includes(v))
    )
      return;
    setMultipleValues(values);
  }, [values]);

  return (
    <SelectContext.Provider
      value={{
        type,
        size: size ?? themeSize,
        value: singleValue,
        values: multipleValues,
        error,
        itemByValue,
        setItemByValue,
      }}
    >
      <div
        className={cn(selectVariants({ size: size ?? themeSize }))}
        {...props}
      >
        {type === 'single' ?
          <SingleSelect
            {...props}
            value={singleValue}
            onValueChange={handleSingleValueChange}
          />
        : <MultipleSelect
            {...props}
            values={multipleValues}
            onValuesChange={handleMultipleValuesChange}
          />
        }
      </div>
    </SelectContext.Provider>
  );
};
Select.displayName = 'Select';

type SingleSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
>;

const SingleSelect = SelectPrimitive.Root;

type MultipleSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
> & {
  values?: string[];
  onValuesChange?: (values: string[]) => void;
};
const MultipleSelect = ({
  values = [],
  onValuesChange,
  ...props
}: MultipleSelectProps) => {
  return (
    <SelectPrimitive.Root
      value="null"
      onValueChange={(value) => {
        onValuesChange?.(
          values.includes(value) ?
            values.filter((curr) => curr !== value)
          : values.concat(value),
        );
      }}
      {...props}
    />
  );
};
MultipleSelect.displayName = 'MultipleSelect';

const SelectGroup = SelectPrimitive.Group;

const SelectValue = ({
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>) => {
  const { type = 'single' } = React.useContext(SelectContext);
  return type === 'single' ?
      <SingleSelectValue {...props} />
    : <MultipleSelectValue {...props} />;
};

const SingleSelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ placeholder }, ref) => {
  const { size, itemByValue, value = '' } = React.useContext(SelectContext);
  const { themeSize } = useTheme();

  return (
    <SelectPrimitive.Value ref={ref} placeholder={placeholder}>
      <SelectPrimitive.Icon asChild>
        <Icon
          name={itemByValue[value]?.icon}
          size={ICON_SIZE[size ?? themeSize]}
        />
      </SelectPrimitive.Icon>
      <Slottable>{itemByValue[value]?.children}</Slottable>
    </SelectPrimitive.Value>
  );
});
SingleSelectValue.displayName = 'SingleSelectValue';

const MultipleSelectValue = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Value>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ placeholder, ...props }, ref) => {
  const { size, values = [], itemByValue } = React.useContext(SelectContext);

  const { themeSize } = useTheme();

  return (
    <SelectPrimitive.Value ref={ref} placeholder={placeholder} {...props}>
      {values.length > 0 ?
        values.map((value, index) => (
          <Tag
            key={index}
            variant="outline"
            size={size ?? themeSize}
            className="select-tag"
          >
            {itemByValue[value]?.children}
            <Icon name={itemByValue[value]?.icon} />
          </Tag>
        ))
      : placeholder}
    </SelectPrimitive.Value>
  );
});
MultipleSelectValue.displayName = 'MultipleSelectValue';

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
  icon?: IconNameType;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, icon, children, ...props }, ref) => {
  const { size, error } = React.useContext(SelectContext);
  const { themeSize } = useTheme();
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectTriggerVariants({ size: size ?? themeSize, error, className }),
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={ICON_SIZE[size ?? themeSize]} />}
      <Slottable>{children}</Slottable>
      <SelectPrimitive.Icon asChild>
        <Icon name="RiArrowDownSLine" size={ICON_SIZE[size ?? themeSize]} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    maxHeight?: string;
  }
>(({ maxHeight, className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn('select-content mt-1', className)}
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
));
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
SelectGroupLabel.displayName = SelectPrimitive.Label.displayName;

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

type SelectItemProps = SingleSelectItemProps & MultipleSelectItemProps;

const SelectItem = ({ ...props }: SelectItemProps) => {
  const { type = 'single' } = React.useContext(SelectContext);

  return type === 'single' ?
      <SingleSelectItem {...props} />
    : <MultipleSelectItem {...props} />;
};
SelectItem.displayName = 'SelectItem';

type SingleSelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> & {
  icon?: IconNameType;
  children: React.ReactNode;
};
const SingleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SingleSelectItemProps
>(({ value, className, icon, children, ...props }, ref) => {
  const { setItemByValue } = React.useContext(SelectContext);

  React.useEffect(() => {
    setItemByValue((prev) => ({ ...prev, [value]: { icon, children } }));
  }, [children]);

  return (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        selectItemVariants({ check: icon ? 'right' : 'left', className }),
      )}
      {...props}
    >
      <SelectPrimitive.ItemIndicator
        className={cn(
          selectItemCheckVariants({ check: icon ? 'right' : 'left' }),
        )}
      >
        <Icon name="RiCheckLine" size={20} />
      </SelectPrimitive.ItemIndicator>
      {icon && <Icon name={icon} size={16} className="select-item-icon" />}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SingleSelectItem.displayName = SelectPrimitive.Item.displayName;

type MultipleSelectItemProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Item
> & {
  icon?: IconNameType;
  values?: string[];
  children: React.ReactNode;
};
const MultipleSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  MultipleSelectItemProps
>(({ icon, value, className, children, ...props }, ref) => {
  const { values = [], setItemByValue } = React.useContext(SelectContext);
  const isSelected = values.includes(value);

  React.useEffect(() => {
    setItemByValue((prev) => ({ ...prev, [value]: { icon, children } }));
  }, [children]);

  return (
    <SelectPrimitive.Item
      ref={ref}
      value={value}
      className={cn(
        selectItemVariants({ check: icon ? 'right' : 'left', className }),
      )}
      {...props}
    >
      {isSelected && (
        <span
          className={cn(
            selectItemCheckVariants({ check: icon ? 'right' : 'left' }),
          )}
        >
          <Icon name="RiCheckLine" size={20} />
        </span>
      )}
      {icon && <Icon name={icon} size={16} className="select-item-icon" />}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
MultipleSelectItem.displayName = 'MultipleSelectItem';

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
SelectLabel.displayName = 'SelectLabel';

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
  size?: Size;
  asChild?: boolean;
}

const SelectCaption = React.forwardRef<HTMLElement, SelectCaptionProps>(
  (props, ref) => {
    const {
      icon = undefined,
      variant = 'default',
      size,
      className,
      children,
      asChild,
      ...rest
    } = props;
    const { themeSize } = useTheme();
    const Comp = asChild ? Slot : 'span';

    return (
      <Comp
        ref={ref}
        className={cn(selectCaptionVariants({ variant, className }))}
        {...rest}
      >
        <Icon
          name={icon ?? CAPTION_DEFAULT_ICON[variant]}
          size={ICON_SIZE[size ?? themeSize]}
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
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroupLabel,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectCaption,
};
