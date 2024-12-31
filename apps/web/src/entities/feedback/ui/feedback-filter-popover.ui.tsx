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

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Calendar,
  Icon,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  TextInput,
} from '@ufb/react';

import { ComboboxSelectInput, SelectInput } from '@/shared';
import type { Field } from '@/entities/field';

interface Props {
  fields: Field[];
}

const FeedbackFilterPopover = (props: Props) => {
  const { fields } = props;
  const { t } = useTranslation();

  const [filters, setFilters] = useState<{ field: Field; value?: string }[]>(
    [],
  );

  const [joinOperator, setJoinOperator] = useState<'and' | 'or'>('and');

  useEffect(() => {
    if (filters.length !== 0) return;
    resetFilters();
  }, [fields]);

  const addFilter = () => {
    const filterField = filters[0];
    if (!filterField) return;
    void setFilters([...filters, filterField]);
  };

  const updateFilter = (index: number, field: Field) => {
    setFilters(filters.map((filter, i) => (i === index ? { field } : filter)));
  };
  const deleteFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    if (!fields[0]) return;
    setFilters([{ field: fields[0] }]);
    setJoinOperator('and');
  };

  const onChangeValue = (index: number, value: string) => {
    setFilters(
      filters.map((filter, i) => (i === index ? { ...filter, value } : filter)),
    );
  };

  const getValue = (index: number) => {
    return filters[index]?.value;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon name="RiSearchLine" />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[500px] p-4">
        <h1>Filter</h1>
        <div className="py-4">
          <table>
            <tbody>
              {filters.map((filter, index) => (
                <tr key={index} className="[&>td]:p-1.5">
                  <td>
                    {index === 0 ?
                      'Where'
                    : index === 1 ?
                      <SelectInput
                        options={[
                          { label: 'And', value: 'and' },
                          { label: 'Or', value: 'or' },
                        ]}
                        value={joinOperator}
                        onChange={(value) =>
                          setJoinOperator(value as 'and' | 'or')
                        }
                      />
                    : <p className="text-center">{joinOperator}</p>}
                  </td>
                  <td>
                    <ComboboxSelectInput
                      onChange={(value) => {
                        const field = fields.find(
                          (field) => field.id === Number(value),
                        );

                        if (!field) return;
                        updateFilter(index, field);
                      }}
                      value={String(filter.field.id)}
                      options={fields.map((field) => ({
                        label: field.name,
                        value: String(field.id),
                      }))}
                    />
                  </td>
                  <td>
                    {filter.field.format === 'text' && 'Contains'}
                    {filter.field.format === 'keyword' && 'Is'}
                    {filter.field.format === 'number' && 'Is'}
                    {filter.field.format === 'date' && 'Is Between'}
                    {filter.field.format === 'select' && 'Is'}
                    {filter.field.format === 'multiSelect' && 'Is'}
                  </td>
                  <td>
                    {filter.field.format === 'text' && (
                      <TextInput
                        className="w-full"
                        onChange={(e) =>
                          onChangeValue(index, e.currentTarget.value)
                        }
                      />
                    )}
                    {filter.field.format === 'keyword' && (
                      <TextInput
                        className="w-full"
                        onChange={(e) =>
                          onChangeValue(index, e.currentTarget.value)
                        }
                      />
                    )}
                    {filter.field.format === 'number' && (
                      <TextInput
                        className="w-full"
                        type="number"
                        onChange={(e) =>
                          onChangeValue(index, e.currentTarget.value)
                        }
                      />
                    )}
                    {filter.field.format === 'date' && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Icon name="RiCalendar2Line" />
                            {getValue(index) ?? 'Select Date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            onSelect={(date) =>
                              onChangeValue(
                                index,
                                dayjs(date).format('YYYY-MM-DD'),
                              )
                            }
                            selected={dayjs(getValue(index)).toDate()}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                    {filter.field.format === 'select' && (
                      <ComboboxSelectInput
                        options={
                          filter.field.options?.map((option) => ({
                            label: option.name,
                            value: option.key,
                          })) ?? []
                        }
                        onChange={(value) => onChangeValue(index, value)}
                        placeholder={t('v2.placeholder.select')}
                        value={getValue(index)}
                      />
                    )}
                    {filter.field.format === 'multiSelect' && (
                      <ComboboxSelectInput
                        options={
                          filter.field.options?.map((option) => ({
                            label: option.name,
                            value: option.key,
                          })) ?? []
                        }
                        onChange={(value) => onChangeValue(index, value)}
                        placeholder={t('v2.placeholder.select')}
                        value={getValue(index)}
                      />
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      onClick={() => deleteFilter(index)}
                    >
                      <Icon name="RiDeleteBin6Line" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between">
          <Button onClick={addFilter}>Add Filter</Button>
          <div className="flex gap-2">
            <PopoverClose asChild>
              <Button variant="outline" onClick={() => resetFilters()}>
                {t('v2.button.cancel')}
              </Button>
            </PopoverClose>
            <Button>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackFilterPopover;
