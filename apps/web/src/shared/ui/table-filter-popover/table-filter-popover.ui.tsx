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
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';

import {
  Badge,
  Button,
  Icon,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@ufb/react';

import { SelectInput, SelectSearchInput } from '@/shared';

import TableFilterPopoverInput from './table-filter-popover-input.ui';
import TableFilterPopoverSelectCondition from './table-filter-popover-select-condition.ui';
import type {
  TableFilter,
  TableFilterCondition,
  TableFilterField,
  TableFilterOperator,
} from './table-filter-popover.type';

interface Props {
  tableFilters: TableFilter[];
  filterFields: TableFilterField[];
  onSubmit: (filters: TableFilter[], operator: TableFilterOperator) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table?: Table<any>;
}

const TableFilterPopover = (props: Props) => {
  const { filterFields, onSubmit, tableFilters, table } = props;

  const { t } = useTranslation();

  const [filters, setFilters] = useState<TableFilter[]>(tableFilters);
  const [open, setOpen] = useState(false);
  const [operator, setOperator] = useState<TableFilterOperator>('AND');

  useEffect(() => {
    if (open) {
      if (tableFilters.length === 0) {
        resetFilters();
      } else {
        setFilters(tableFilters);
      }
    }
  }, [open, tableFilters]);

  const addFilter = () => {
    const filterField = filters[filters.length - 1];
    if (!filterField) resetFilters();
    else setFilters([...filters, filterField]);
  };

  const updateFilter = (index: number, field: TableFilterField) => {
    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index ?
          {
            key: field.key,
            name: field.name,
            format: field.format,
            condition: field.matchType[0] ?? filter.condition,
          }
        : filter,
      ),
    );
  };
  const deleteFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const resetFilters = () => {
    if (!filterFields[0]) return;
    const { format, key, name, matchType } = filterFields[0];

    if (!matchType[0]) return;
    setFilters([{ key, condition: matchType[0], format, name }]);
    setOperator('AND');
  };

  const onChangeValue = (index: number, value?: unknown) => {
    setFilters((prev) =>
      prev.map((filter, i) => (i === index ? { ...filter, value } : filter)),
    );
  };

  const onChangeCondition = (
    index: number,
    condition: TableFilterCondition,
  ) => {
    setFilters((prev) =>
      prev.map((filter, i) =>
        i === index ? { ...filter, condition } : filter,
      ),
    );
  };

  const renderOperator = (filter: TableFilter, index: number) => {
    const filterField = filterFields.find((field) => field.key === filter.key);
    if (!filterField) return <></>;

    return (
      <TableFilterPopoverSelectCondition
        field={filterField}
        filter={filter}
        onChange={(value) => {
          onChangeCondition(index, value);
          onChangeValue(index, undefined);
        }}
      />
    );
  };

  const renderInput = (filter: TableFilter, index: number) => {
    const filterField = filterFields.find((field) => field.key === filter.key);
    if (!filterField) return <></>;

    return (
      <TableFilterPopoverInput
        filterfieid={filterField}
        filter={filter}
        onChange={(value) => onChangeValue(index, value)}
      />
    );
  };

  const submitFilters = () => {
    onSubmit(filters, operator);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon name="RiFilter3Line" />
          Filter
          {tableFilters.length > 0 && (
            <Badge variant="subtle">{tableFilters.length}</Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[620px] p-4">
        <p className="text-title-h5">Filter</p>
        <div className="py-4">
          {filters.length > 0 ?
            <table className="w-full">
              <tbody>
                {filters.map((filter, index) => (
                  <tr key={index} className="[&>td]:p-1">
                    <td>
                      {index === 0 ?
                        <p className="min-w-20">Where</p>
                      : index === 1 ?
                        <SelectInput
                          options={[
                            { label: 'And', value: 'AND' },
                            { label: 'Or', value: 'OR' },
                          ]}
                          value={operator}
                          onChange={(value) =>
                            setOperator(value as TableFilterOperator)
                          }
                        />
                      : <SelectInput
                          options={[
                            { label: 'And', value: 'AND' },
                            { label: 'Or', value: 'OR' },
                          ]}
                          value={operator}
                          disabled
                        />
                      }
                    </td>
                    <td>
                      <SelectSearchInput
                        onChange={(value) => {
                          const field = filterFields.find(
                            (field) => field.name === value,
                          );
                          if (!field) return;
                          updateFilter(index, field);
                        }}
                        value={filter.name}
                        options={filterFields
                          .filter(
                            (v) =>
                              !!v.visible ||
                              (table ?
                                table
                                  .getVisibleFlatColumns()
                                  .some((column) => column.id === v.key)
                              : true),
                          )
                          .map(({ name }) => ({ label: name, value: name }))}
                      />
                    </td>
                    <td>{renderOperator(filter, index)}</td>
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
          : <p className="text-neutral-tertiary">필터 조건을 추가해 주세요.</p>}
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={addFilter}>
            {t('v2.button.addFilter')}
          </Button>
          <div className="flex gap-2 [&>button]:min-w-20">
            <PopoverClose asChild>
              <Button variant="outline" onClick={() => resetFilters()}>
                {t('v2.button.cancel')}
              </Button>
            </PopoverClose>
            <Button onClick={submitFilters}>{t('v2.button.confirm')}</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableFilterPopover;
