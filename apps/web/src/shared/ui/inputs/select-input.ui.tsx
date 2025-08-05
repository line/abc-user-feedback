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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

interface Props {
  placeholder?: string;
  options: {
    label: string;
    value: string;
    icon?: IconNameType;
    disabled?: boolean;
  }[];
  label?: string;
  value?: string;
  onChange?: (value?: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: Size;
  clearable?: boolean;
}

const SelectInput: React.FC<Props> = (props) => {
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
    <Select
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
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
        {clearable && !!value && (
          <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
            <Icon
              name="RiCloseCircleFill"
              className="z-20"
              onClick={() => {
                onChange?.(undefined);
              }}
            />
          </Button>
        )}
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {options.map(({ label, value, icon, disabled }) => (
          <SelectItem key={value} value={value} disabled={disabled}>
            {icon && <Icon name={icon} size={16} className="mr-2" />}
            {label}
          </SelectItem>
        ))}
      </SelectContent>
      {error && <Caption variant="error">{error}</Caption>}
    </Select>
  );
};

export default SelectInput;
