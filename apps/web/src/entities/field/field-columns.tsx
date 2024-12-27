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
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';

import { Badge, Icon, Tag } from '@ufb/react';

import {
  DATE_TIME_FORMAT,
  displayString,
  RowDragHandleCell,
  SortingTableHead,
} from '@/shared';

import { FIELD_PROPERTY_TEXT } from './field-utils';
import {
  FIELD_FORMAT_ICON_MAP,
  FIELD_STATUS_COLOR_MAP,
} from './field.constant';
import type { FieldInfo } from './field.type';
import OptionListPopover from './ui/option-list-popover.ui';

const columnHelper = createColumnHelper<FieldInfo>();

export const getFieldColumns = (reorder?: (data: FieldInfo[]) => void) =>
  [
    reorder ?
      columnHelper.display({
        id: 'drag-handle',
        header: () => (
          <Icon
            name="RiDraggable"
            className="text-neutral-tertiary"
            size={16}
          />
        ),
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 10,
      })
    : null,
    columnHelper.accessor('key', {
      header: 'Key',
      cell: ({ getValue }) => <span>{displayString(getValue())}</span>,
    }),
    columnHelper.accessor('name', {
      header: 'Display Name',
      cell: ({ getValue }) => <span>{displayString(getValue())}</span>,
    }),
    columnHelper.accessor('format', {
      header: 'Format',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <Icon name={FIELD_FORMAT_ICON_MAP[getValue()]} size={16} />
          {getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('options', {
      header: 'Select Option',
      cell: ({ getValue }) => {
        const options = getValue() ?? [];
        return options.length > 0 ?
            <OptionListPopover options={options} />
          : '-';
      },
    }),
    columnHelper.accessor('property', {
      header: 'Property',
      cell: ({ getValue }) => (
        <Tag variant="secondary" radius="large">
          {FIELD_PROPERTY_TEXT[getValue()]}
        </Tag>
      ),
      filterFn: (row, id, value: FieldInfo['property'][]) => {
        return value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge color={FIELD_STATUS_COLOR_MAP[getValue()]} radius="large">
          {getValue()}
        </Badge>
      ),
      filterFn: (row, id, value: FieldInfo['status'][]) => {
        return value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: ({ getValue }) => <span>{displayString(getValue())}</span>,
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <SortingTableHead column={column}>Created</SortingTableHead>
      ),
      cell: ({ getValue }) => (
        <span>
          {getValue() ? dayjs(getValue()).format(DATE_TIME_FORMAT) : '-'}
        </span>
      ),
    }),
  ].filter((v) => !!v);
