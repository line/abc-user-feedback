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
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Calendar,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TextInput,
} from '@ufb/react';

import { ComboboxSelectInput } from '../inputs';
import type { FilterField } from './table-search-popover.type';

interface Props {
  filterField: FilterField;
  onChange: (value: string) => void;
  value?: string;
}

const TableSearchPopoverInput = (props: Props) => {
  const { filterField, onChange, value } = props;
  const { t } = useTranslation();

  const inputProps = {
    className: 'w-full',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(e.currentTarget.value),
    value,
  };

  return (
    <>
      {filterField.format === 'text' && <TextInput {...inputProps} />}
      {filterField.format === 'keyword' && <TextInput {...inputProps} />}
      {filterField.format === 'number' && (
        <TextInput {...inputProps} type="number" />
      )}
      {filterField.format === 'date' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="!text-base-normal w-full justify-start"
            >
              <Icon name="RiCalendar2Line" />
              {value ?? 'Select Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              onSelect={(date) => onChange(dayjs(date).format('YYYY-MM-DD'))}
              selected={dayjs(value).toDate()}
            />
          </PopoverContent>
        </Popover>
      )}
      {(filterField.format === 'select' ||
        filterField.format === 'multiSelect') && (
        <ComboboxSelectInput
          options={
            filterField.options?.map((option) => ({
              label: option.name,
              value: option.key,
            })) ?? []
          }
          onChange={onChange}
          placeholder={t('v2.placeholder.select')}
          value={value}
        />
      )}
    </>
  );
};

export default TableSearchPopoverInput;
