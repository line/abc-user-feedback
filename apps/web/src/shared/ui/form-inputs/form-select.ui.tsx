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
import { useTranslation } from 'next-i18next';

import type { IconNameType } from '@ufb/react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Icon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

import type { CommonFormItemType } from '@/shared/types';

interface Props extends CommonFormItemType<string> {
  onChange: (value?: string) => void;
  options: {
    label: string;
    value: string;
    icon?: IconNameType;
    disabled?: boolean;
  }[];
}

const FormSelect = (props: Props) => {
  const { label, value, onChange, disabled, options, placeholder, required } =
    props;
  const { t } = useTranslation();
  return (
    <FormItem>
      <FormLabel>
        {label} {required && <span className="text-tint-red">*</span>}
      </FormLabel>
      <Select
        onValueChange={(v) => {
          if (!v) return;
          onChange(v);
        }}
        value={value ?? ''}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue
              placeholder={placeholder ?? t('v2.placeholder.select')}
            />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="max-h-60">
          {options.map(({ label, value, icon, disabled }) => (
            <SelectItem key={value} value={value} disabled={disabled}>
              {icon && <Icon name={icon} size={16} className="mr-2" />}
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default FormSelect;
