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
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

import { Badge, Icon, Tag } from '@ufb/react';

import { DATE_TIME_FORMAT, displayString, RowDragHandleCell } from '@/shared';

import { FIELD_PROPERTY_TEXT } from './field-utils';
import {
  FIELD_FORMAT_ICON_MAP,
  FIELD_STATUS_COLOR_MAP,
} from './field.constant';
import type { FieldInfo } from './field.type';
import { AiFieldOptionPopover, SelectOptionListPopover } from './ui';

const DEFAULT_FIELD_COLUMNS_KEYS = ['id', 'createdAt', 'updatedAt', 'issues'];

const columnHelper = createColumnHelper<FieldInfo>();

export const getFieldColumns = (reorder?: (data: FieldInfo[]) => void) =>
  [
    reorder ?
      columnHelper.display({
        id: 'drag-handle',
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 30,
        enableSorting: false,
        meta: { truncate: false },
      })
    : null,
    columnHelper.accessor('key', {
      header: 'Key',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <span>{displayString(getValue())}</span>
          {DEFAULT_FIELD_COLUMNS_KEYS.includes(getValue()) && (
            <Badge variant="outline">Default</Badge>
          )}
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      header: 'Display Name',
      cell: ({ getValue }) => <span>{displayString(getValue())}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor('format', {
      header: 'Format',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Icon name={FIELD_FORMAT_ICON_MAP[getValue()]} size={16} />
          {getValue()}
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      header: 'Option',
      cell: ({ row }) => {
        if (
          (row.original.format === 'select' ||
            row.original.format === 'multiSelect') &&
          (row.original.options ?? []).length > 0
        ) {
          return (
            <SelectOptionListPopover options={row.original.options ?? []} />
          );
        }
        if (row.original.format === 'aiField') {
          return (
            <AiFieldOptionPopover
              aiFieldTemplateId={row.original.aiFieldTemplateId}
            />
          );
        }
        return '-';
      },
      enableSorting: false,
      meta: { truncate: false },
    }),
    columnHelper.accessor('property', {
      header: 'Property',
      cell: ({ getValue }) => (
        <Tag variant="secondary" radius="large">
          {FIELD_PROPERTY_TEXT[getValue()]}
        </Tag>
      ),
      enableSorting: false,
      filterFn: (row, _, value: string[]) => {
        return value.some((property) => property === row.getValue('property'));
      },
      meta: { truncate: false },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge color={FIELD_STATUS_COLOR_MAP[getValue()]} radius="large">
          {getValue()}
        </Badge>
      ),
      enableSorting: false,
      filterFn: (row, _, value: string[]) => {
        return value.some((status) => status === row.getValue('status'));
      },
      meta: { truncate: false },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ getValue }) => <span>{displayString(getValue())}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: ({ getValue }) => (
        <span>
          {getValue() ? dayjs(getValue()).format(DATE_TIME_FORMAT) : '-'}
        </span>
      ),
    }),
  ].filter((v) => !!v);
