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
import { useMemo } from 'react';
import { getCountry } from 'countries-and-timezones';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ufb/react';

import type { Timezone } from '../project.type';
import { getTimezoneOptions } from '../timezone.util';

const getLabel = (timezone?: Timezone) => {
  if (!timezone) return '';
  const country = getCountry(timezone.countryCode);
  return `(${timezone.offset}) ${timezone.name}, ${country?.name}`;
};

interface IProps {
  value?: Timezone;
  onChange?: (timezone?: Timezone) => void;
  disabled?: boolean;
}

const TimezoneSelectBox: React.FC<IProps> = ({ onChange, value, disabled }) => {
  const options = useMemo(() => getTimezoneOptions(), []);

  return (
    <Select
      value={value?.name}
      onValueChange={(v) => onChange?.(options.find((o) => o.name === v))}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent maxHeight="360px">
        {options.map((option) => (
          <SelectItem key={option.name} value={option.name}>
            {getLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimezoneSelectBox;
