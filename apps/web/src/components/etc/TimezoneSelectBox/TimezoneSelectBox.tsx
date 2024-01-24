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
import { useMemo, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { getCountry } from 'countries-and-timezones';

import { Icon, TextInput } from '@ufb/ui';

import type { TimezoneInfo } from '@/types/timezone-info';
import { getTimezoneOptions } from '@/utils/timezone';

const getLabel = (timezone?: TimezoneInfo) => {
  if (!timezone) return '';
  const country = getCountry(timezone.countryCode);
  return `(${timezone.offset}) ${timezone.name}, ${country?.name}`;
};

interface IProps {
  value?: TimezoneInfo;
  onChange?: (timezone: TimezoneInfo) => void;
  disabled?: boolean;
}

const TimezoneSelectBox: React.FC<IProps> = ({ onChange, value, disabled }) => {
  const [query, setQuery] = useState('');

  const options = useMemo(() => getTimezoneOptions(), []);

  const filteredOptions = useMemo(
    () =>
      query === ''
        ? options
        : options.filter((option) =>
            getLabel(option).toLowerCase().includes(query.toLowerCase()),
          ),
    [query, options],
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="input-label">Time Zone</p>
      <Listbox
        as="div"
        className="relative"
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <Listbox.Button className="input">
          {({ open }) => (
            <div className="flex w-full justify-between">
              {getLabel(value) ?? 'Select'}
              <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={20} />
            </div>
          )}
        </Listbox.Button>
        <Listbox.Options
          as="div"
          className="bg-primary absolute z-10 mt-1 w-full overflow-hidden rounded border"
        >
          <div className="p-2">
            <TextInput
              leftIconName="Search"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ul className="max-h-[200px] overflow-auto">
            {filteredOptions.map((option, index) => (
              <Listbox.Option
                key={index}
                value={option}
                className="hover:bg-fill-quaternary flex h-10 cursor-pointer items-center justify-between px-3"
              >
                {getLabel(option)}
                {JSON.stringify(option) === JSON.stringify(value) && (
                  <Icon name="Check" size={16} />
                )}
              </Listbox.Option>
            ))}
          </ul>
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default TimezoneSelectBox;
