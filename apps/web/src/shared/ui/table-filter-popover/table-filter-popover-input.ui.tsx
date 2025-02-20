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

import { Icon, InputBox, InputField, TextInput } from '@ufb/react';

import type { DateRangeType } from '@/shared/types';
import { IssueSelectBox } from '@/entities/issue';

import DateRangePicker from '../date-range-picker';
import { DatePicker, SelectInput, SelectSearchInput } from '../inputs';
import type {
  TableFilter,
  TableFilterField,
} from './table-filter-popover.type';

interface Props {
  filterfieid: TableFilterField;
  filter: TableFilter;
  onChange: (value?: unknown) => void;
}

const TableFilterPopoverInput = (props: Props) => {
  const { filter, onChange, filterfieid } = props;
  const value = filter.value;
  const { t } = useTranslation();

  return (
    <>
      {filterfieid.format === 'ticket' && (
        <InputField>
          <InputBox className="input input-small input-radius-medium">
            {filterfieid.ticketKey && <span>{filterfieid.ticketKey} - </span>}
            <input
              placeholder={t('v2.placeholder.text')}
              onChange={(e) => onChange(e.currentTarget.value)}
              value={value as string | undefined}
            />
          </InputBox>
        </InputField>
      )}
      {filterfieid.format === 'string' && (
        <InputField>
          <TextInput
            placeholder={t('v2.placeholder.text')}
            onChange={(e) => onChange(e.currentTarget.value)}
            value={(value as string | undefined) ?? ''}
          />
        </InputField>
      )}
      {filterfieid.format === 'number' && (
        <InputField>
          <TextInput
            placeholder={t('v2.placeholder.text')}
            onChange={(e) => onChange(Number(e.currentTarget.value))}
            value={(value as number | undefined) ?? ''}
            type="number"
          />
        </InputField>
      )}
      {filterfieid.format === 'date' && (
        <>
          {filter.condition === 'BETWEEN' ?
            <DateRangePicker
              onChange={(v) =>
                onChange({
                  gte: dayjs(v?.startDate).startOf('day').toISOString(),
                  lt: dayjs(v?.endDate).endOf('day').toISOString(),
                })
              }
              value={
                (value ?
                  {
                    startDate: dayjs(
                      (value as { gte: string; lt: string }).gte,
                    ).toDate(),
                    endDate: dayjs(
                      (value as { gte: string; lt: string }).lt,
                    ).toDate(),
                  }
                : null) as DateRangeType
              }
            >
              <InputField className="w-full">
                <InputBox>
                  <Icon
                    name="RiCalendarEventLine"
                    className="absolute-y-center absolute left-2"
                    size={16}
                  />
                  <TextInput
                    placeholder={t('v2.placeholder.text')}
                    className="pl-7"
                    value={
                      value ?
                        `${dayjs((value as { gte: string; lt: string }).gte).format('YYYY-MM-DD')} ~ ${dayjs((value as { gte: string; lt: string }).lt).format('YYYY-MM-DD')}`
                      : ''
                    }
                  />
                </InputBox>
              </InputField>
            </DateRangePicker>
          : <DatePicker
              value={value as string | undefined}
              onChange={onChange}
            />
          }
        </>
      )}
      {filterfieid.format === 'select' && (
        <SelectSearchInput
          options={filterfieid.options.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          onChange={(value) =>
            onChange(filterfieid.options.find((v) => v.name === value)?.key)
          }
          value={filterfieid.options.find((v) => v.key === value)?.name}
        />
      )}
      {filterfieid.format === 'multiSelect' && (
        <SelectInput
          type="multiple"
          options={filterfieid.options.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          onValuesChange={(values) => {
            onChange(
              filterfieid.options
                .filter((v) => values.includes(v.name))
                .map((v) => v.key),
            );
          }}
          values={filterfieid.options
            .filter((v) =>
              (value as (string | number)[] | undefined)?.includes(v.key),
            )
            .map((v) => v.name)}
        />
      )}
      {filterfieid.format === 'issue' && (
        <IssueSelectBox
          onChange={onChange}
          value={value ? String(value) : undefined}
        />
      )}
    </>
  );
};

export default TableFilterPopoverInput;
