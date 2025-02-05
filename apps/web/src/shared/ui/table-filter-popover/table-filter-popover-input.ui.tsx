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

import { TextInput } from '@ufb/react';

import type { DateRangeType } from '@/shared/types';
import { IssueSelectBox } from '@/entities/issue';

import DateRangePicker from '../date-range-picker';
import { SelectSearchInput } from '../inputs';
import type { TableFilterField } from './table-filter-popover.type';

interface Props {
  filterField: TableFilterField;
  onChange: (value?: unknown) => void;
  value?: unknown;
}

const TableFilterPopoverInput = (props: Props) => {
  const { filterField, onChange, value } = props;

  return (
    <>
      {filterField.format === 'text' && (
        <TextInput
          onChange={(e) => onChange(e.currentTarget.value)}
          value={value as string | undefined}
        />
      )}
      {filterField.format === 'keyword' && (
        <TextInput
          onChange={(e) => onChange(e.currentTarget.value)}
          value={value as string | undefined}
        />
      )}
      {filterField.format === 'number' && (
        <TextInput
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          value={value as number | undefined}
          type="number"
        />
      )}
      {filterField.format === 'date' && (
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
        />
      )}
      {(filterField.format === 'select' ||
        filterField.format === 'multiSelect') && (
        <SelectSearchInput
          options={
            filterField.options?.map((option) => ({
              label: option.name,
              value: option.key,
            })) ?? []
          }
          onChange={onChange}
          value={String(value)}
        />
      )}
      {filterField.format === 'issue' && (
        <IssueSelectBox onChange={onChange} value={String(value)} />
      )}
    </>
  );
};

export default TableFilterPopoverInput;
