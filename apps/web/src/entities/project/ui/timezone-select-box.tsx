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
import { useMemo } from 'react';
import { getCountry } from 'countries-and-timezones';

import FormSelectSearch from '@/shared/ui/form-inputs/form-select-search.ui';

import type { Timezone } from '../project.type';
import { getTimezoneOptions } from '../timezone.util';

const getLabel = (timezone?: Timezone) => {
  if (!timezone) return '';
  const country = getCountry(timezone.countryCode);
  return `(${timezone.offset}) ${timezone.name}, ${country?.name}`;
};

const getSelectValue = (timezone?: Timezone) => {
  if (!timezone) return '';
  const country = getCountry(timezone.countryCode);
  return `${timezone.offset}_${timezone.name}_${timezone.countryCode}_${country?.name}`;
};

const getTimezonValue = (value: string): Timezone => {
  const [offset, name, countryCode] = value.split('_');
  if (!offset || !name || !countryCode)
    throw new Error('Invalid timezone value');
  return { offset, name, countryCode };
};

interface IProps {
  value?: Timezone;
  onChange?: (timezone?: Timezone) => void;
  disabled?: boolean;
}

const TimezoneSelectBox: React.FC<IProps> = ({
  onChange,
  value,
  disabled,
  ...props
}) => {
  const options = useMemo(() => getTimezoneOptions(), []);

  return (
    <FormSelectSearch
      label="Time Zone"
      options={options.map((option) => ({
        label: getLabel(option),
        value: getSelectValue(option),
      }))}
      value={getSelectValue(value)}
      onChange={(v) => {
        if (!v || typeof v !== 'string') return;
        onChange?.(getTimezonValue(v));
      }}
      disabled={disabled}
      required
      {...props}
    />
  );
};

export default TimezoneSelectBox;
