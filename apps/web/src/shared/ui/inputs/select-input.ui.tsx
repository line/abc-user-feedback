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
import type { IconNameType } from '@ufb/react';
import {
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
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  type?: 'single' | 'multiple';
  error?: string;
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
    type = 'single',
    error,
  } = props;

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      type={type}
    >
      {label && (
        <SelectLabel>
          {label} {required && <span className="text-tint-red">*</span>}
        </SelectLabel>
      )}
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ label, value, icon }) => (
          <SelectItem key={value} value={value} icon={icon}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
      {error && <SelectCaption variant="default">{error}</SelectCaption>}
    </Select>
  );
};

export default SelectInput;
