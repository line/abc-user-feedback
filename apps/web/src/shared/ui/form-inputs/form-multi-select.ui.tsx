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
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectTriggerButton,
  MultiSelectValue,
} from '@ufb/react';

import type { CommonFormItemType } from '@/shared/types';

interface Props extends CommonFormItemType<string[]> {
  onChange: (value?: string[]) => void;
  options: {
    label: string;
    value: string;
    icon?: IconNameType;
  }[];
}

const FormMultiSelect = (props: Props) => {
  const { label, value, onChange, disabled, options, placeholder, required } =
    props;
  const { t } = useTranslation();
  return (
    <FormItem>
      <FormLabel>
        {label} {required && <span className="text-tint-red">*</span>}
      </FormLabel>
      <MultiSelect
        onValueChange={onChange}
        value={value ?? []}
        disabled={disabled}
      >
        <MultiSelectTrigger asChild>
          <FormControl>
            <MultiSelectTriggerButton>
              <MultiSelectValue
                placeholder={placeholder ?? t('v2.placeholder.select')}
              />
            </MultiSelectTriggerButton>
          </FormControl>
        </MultiSelectTrigger>
        <MultiSelectContent className="max-h-60 overflow-auto">
          {options.map(({ label, value, icon }) => (
            <MultiSelectItem key={value} value={value}>
              {icon && <Icon name={icon} size={16} className="mr-2" />}
              {label}
            </MultiSelectItem>
          ))}
        </MultiSelectContent>
      </MultiSelect>
      <FormMessage />
    </FormItem>
  );
};

export default FormMultiSelect;
