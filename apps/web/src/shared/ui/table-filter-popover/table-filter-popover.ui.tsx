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
import TableFilterPopoverSelectOperator from './table-filter-popover-select-operator.ui';
import type {
  TableFilter,
  TableFilterCondition,
  TableFilterField,
  TableFilterFieldFotmat,
  TableFilterOperator,
} from './table-filter-popover.type';

const OperatorMap: Record<TableFilterFieldFotmat, TableFilterCondition> = {
  date: 'IS',
  keyword: 'IS',
  multiSelect: 'IS',
  select: 'IS',
  issue: 'IS',
  number: 'IS',
  text: 'CONTAINS',
};

interface Props {
  tableFilters: TableFilter[];
  filterFields: TableFilterField[];
  onSubmit: (filters: TableFilter[], operator: TableFilterOperator) => void;
}

const TableFilerPopover = (props: Props) => {
  const { filterFields, onSubmit, tableFilters } = props;
  const { t } = useTranslation();

  const [filters, setFilters] = useState<TableFilter[]>(tableFilters);
  const [open, setOpen] = useState(false);

  const [operator, setOperator] = useState<TableFilterOperator>('AND');

  useEffect(() => {
    if (filters.length !== 0) return;
    resetFilters();
  }, [filterFields]);

  const addFilter = () => {
    const filterField = filters[0];
    if (!filterField) return;
    void setFilters([...filters, filterField]);
  };

  const updateFilter = (index: number, field: TableFilterField) => {
    setFilters(
      filters.map((filter, i) =>
        i === index ?
          {
            key: field.key,
            name: field.name,
            format: field.format,
            condition: OperatorMap[field.format],
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
    const { format, key, name } = filterFields[0];
    setFilters([{ key, condition: OperatorMap[format], format, name }]);
    setOperator('AND');
  };

  const onChangeValue = (index: number, value?: string) => {
    setFilters(
      filters.map((filter, i) => (i === index ? { ...filter, value } : filter)),
    );
  };

  const getValue = (index: number) => {
    return filters[index]?.value;
  };

  const renderOperator = (filter: TableFilter) => {
    const filterField = filterFields.find((field) => field.key === filter.key);
    if (!filterField) return <></>;
    return <TableFilterPopoverSelectOperator filterField={filterField} />;
  };

  const renderInput = (filter: TableFilter, index: number) => {
    const filterField = filterFields.find((field) => field.key === filter.key);
    if (!filterField) return <></>;
    return (
      <TableFilterPopoverInput
        filterField={filterField}
        onChange={(value) => onChangeValue(index, value)}
        value={getValue(index)}
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
      <PopoverContent className="min-w-[500px] p-4">
        <p className="text-title-h5">Filter</p>
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
                      options={filterFields.map((field) => ({
                        label: field.name,
                        value: field.name,
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
            <Button onClick={submitFilters}>{t('v2.button.confirm')}</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableFilerPopover;
