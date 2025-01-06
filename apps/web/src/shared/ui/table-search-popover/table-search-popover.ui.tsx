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
import { useTranslation } from 'react-i18next';

import {
  Button,
  Icon,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@ufb/react';

import { ComboboxSelectInput, SelectInput } from '@/shared';

import TableSearchPopoverInput from './table-search-popover-input.ui';
import TableSearchPopoverSelectOperator from './table-search-popover-select-operator.ui';
import type {
  Filter,
  FilterField,
  FilterFieldFotmat,
  Operator,
} from './table-search-popover.type';

const OperatorMap: Record<FilterFieldFotmat, Operator> = {
  date: 'is',
  keyword: 'is',
  multiSelect: 'is',
  select: 'is',
  number: 'is',
  text: 'contains',
};

interface Props {
  filterFields: FilterField[];
  onSubmit: (filters: Filter[], joinOperator: 'and' | 'or') => void;
}

const TableSearchPopover = (props: Props) => {
  const { filterFields, onSubmit } = props;
  const { t } = useTranslation();

  const [filters, setFilters] = useState<Filter[]>([]);
  const [open, setOpen] = useState(false);

  const [joinOperator, setJoinOperator] = useState<'and' | 'or'>('and');

  useEffect(() => {
    if (filters.length !== 0) return;
    resetFilters();
  }, [filterFields]);

  const addFilter = () => {
    const filterField = filters[0];
    if (!filterField) return;
    void setFilters([...filters, filterField]);
  };

  const updateFilter = (index: number, field: FilterField) => {
    setFilters(
      filters.map((filter, i) =>
        i === index ?
          { key: field.key, operator: OperatorMap[field.format] }
        : filter,
      ),
    );
  };
  const deleteFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    if (!filterFields[0]) return;
    const { format, key } = filterFields[0];
    setFilters([{ key, operator: OperatorMap[format] }]);
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

  const renderOperator = (filter: Filter) => {
    const filterField = filterFields.find((field) => field.key === filter.key);
    if (!filterField) return <></>;
    return <TableSearchPopoverSelectOperator filterField={filterField} />;
  };

  const renderInput = (filter: Filter, index: number) => {
    const filterField = filterFields.find((field) => field.key === filter.key);
    if (!filterField) return <></>;
    return (
      <TableSearchPopoverInput
        filterField={filterField}
        onChange={(value) => onChangeValue(index, value)}
        value={getValue(index)}
      />
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon name="RiFilter3Line" />
          Search
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[500px] p-4">
        <p className="text-title-h5">Search</p>
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
                    : <SelectInput
                        options={[
                          { label: 'And', value: 'and' },
                          { label: 'Or', value: 'or' },
                        ]}
                        value={joinOperator}
                        disabled
                      />
                    }
                  </td>
                  <td>
                    <ComboboxSelectInput
                      onChange={(value) => {
                        console.log('value: ', value);
                        const field = filterFields.find(
                          (field) => field.key === value,
                        );
                        if (!field) return;
                        updateFilter(index, field);
                      }}
                      value={filter.key}
                      options={filterFields.map((field) => ({
                        label: field.name,
                        value: field.key,
                      }))}
                    />
                  </td>
                  <td>{renderOperator(filter)}</td>
                  <td>{renderInput(filter, index)}</td>
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
          <Button variant="outline" onClick={addFilter}>
            {t('v2.button.addFilter')}
          </Button>
          <div className="flex gap-2">
            <PopoverClose asChild>
              <Button variant="outline" onClick={() => resetFilters()}>
                {t('v2.button.cancel')}
              </Button>
            </PopoverClose>
            <Button
              onClick={() => {
                onSubmit(filters, joinOperator);
                setOpen(false);
              }}
            >
              {t('v2.button.confirm')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableSearchPopover;
