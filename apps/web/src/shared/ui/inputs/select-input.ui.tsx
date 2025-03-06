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
import type { IconNameType, Size } from '@ufb/react';
import {
  Button,
  Icon,
  Select,
  SelectCaption,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

interface Props {
  placeholder?: string;
  options: { label: string; value: string; icon?: IconNameType }[];
  label?: string;
  value?: string;
  values?: string[];
  onChange?: (value?: string) => void;
  onValuesChange?: (value?: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  type?: 'single' | 'multiple';
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
    values,
    onChange,
    onValuesChange,
    disabled,
    required,
    type = 'single',
    error,
    size,
    clearable = false,
  } = props;

  return (
    <Select
      value={value}
      values={values}
      onValueChange={onChange}
      onValuesChange={onValuesChange}
      disabled={disabled}
      type={type}
      size={size}
    >
      {label && (
        <SelectLabel>
          {label} {required && <span className="text-tint-red">*</span>}
        </SelectLabel>
      )}
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
        {clearable && (!!value || (!!values && values.length > 0)) && (
          <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
            <Icon
              name="RiCloseCircleFill"
              className="z-20"
              onClick={() => {
                onChange?.(undefined);
                onValuesChange?.([]);
              }}
            />
          </Button>
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value, icon }) => (
          <SelectItem key={value} value={value} icon={icon}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
      {error && <SelectCaption variant="error">{error}</SelectCaption>}
    </Select>
  );
};

export default SelectInput;
