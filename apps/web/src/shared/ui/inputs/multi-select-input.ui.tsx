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
import type { IconNameType, Size } from '@ufb/react';
import {
  Button,
  Caption,
  Icon,
  Label,
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@ufb/react';

interface Props {
  placeholder?: string;
  options: { label: string; value: string; icon?: IconNameType }[];
  label?: string;
  value: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: Size;
  clearable?: boolean;
}

const MultiSelectInput: React.FC<Props> = (props) => {
  const {
    placeholder,
    options,
    label,
    value,
    onChange,
    disabled,
    required,
    error,
    size,
    clearable = false,
  } = props;

  return (
    <MultiSelect
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      size={size}
    >
      {label && (
        <Label>
          {label} {required && <span className="text-tint-red">*</span>}
        </Label>
      )}
      <MultiSelectTrigger>
        <MultiSelectValue placeholder={placeholder} />
        {clearable && value.length > 0 && (
          <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
            <Icon
              name="RiCloseCircleFill"
              className="z-20"
              onClick={() => onChange?.([])}
            />
          </Button>
        )}
      </MultiSelectTrigger>
      <MultiSelectContent className="max-h-[200px] overflow-auto">
        {options.map(({ label, value, icon }) => (
          <MultiSelectItem key={value} value={value}>
            {icon && <Icon name={icon} size={16} className="mr-2" />}
            {label}
          </MultiSelectItem>
        ))}
      </MultiSelectContent>
      {error && <Caption variant="error">{error}</Caption>}
    </MultiSelect>
  );
};

export default MultiSelectInput;
