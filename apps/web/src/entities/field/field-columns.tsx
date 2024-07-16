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

import { Badge, Icon } from '@ufb/ui';

import { cn, displayString, usePermissions } from '@/shared';

import { FIELD_PROPERTY_TEXT, isDefaultField } from './field-utils';
import type { FieldInfo } from './field.type';
import FieldSettingPopover from './ui/field-setting-popover.ui';
import OptionListPopover from './ui/option-list-popover.ui';

const columnHelper = createColumnHelper<FieldInfo>();

export const getFieldColumns = (
  fieldRows: FieldInfo[],
  onClickDelete?: (input: { index: number }) => void,
  onClickModify?: (input: { index: number; field: FieldInfo }) => void,
  isInputStep?: boolean,
) => [
  columnHelper.accessor('key', {
    header: 'Key',
    cell: ({ getValue, row }) => (
      <span className={cn({ 'text-secondary': isDefaultField(row.original) })}>
        {displayString(getValue())}
      </span>
    ),
    size: 120,
  }),
  columnHelper.accessor('name', {
    header: 'Display Name',
    cell: ({ getValue, row }) => (
      <span className={cn({ 'text-secondary': isDefaultField(row.original) })}>
        {displayString(getValue())}
      </span>
    ),
    size: 150,
  }),
  columnHelper.accessor('format', {
    header: 'Format',
    cell: ({ getValue, row }) => (
      <span className={cn({ 'text-secondary': isDefaultField(row.original) })}>
        {displayString(getValue())}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue, row }) => (
      <span className={cn({ 'text-secondary': isDefaultField(row.original) })}>
        {displayString(getValue())}
      </span>
    ),
  }),
  columnHelper.accessor('options', {
    header: 'Options',
    cell: ({ getValue }) => {
      const options = getValue() ?? [];
      return options.length > 0 ? <OptionListPopover options={options} /> : '-';
    },
    size: 100,
  }),
  columnHelper.accessor('property', {
    header: 'Property',
    cell: ({ getValue }) => {
      return <Badge type="secondary">{FIELD_PROPERTY_TEXT[getValue()]}</Badge>;
    },
    size: 120,
  }),
  ...(onClickDelete ?
    [
      columnHelper.display({
        id: 'delete',
        header: () => <p className="w-full text-center">Delete</p>,
        cell: ({ row }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const perms = usePermissions();
          return (
            <div className="text-center">
              <button
                className="icon-btn icon-btn-sm icon-btn-tertiary"
                disabled={
                  isDefaultField(row.original) ||
                  (!isInputStep && !!row.original.createdAt) ||
                  (!isInputStep && !perms.includes('channel_field_update'))
                }
                onClick={() => onClickDelete({ index: row.index })}
              >
                <Icon name="TrashFill" />
              </button>
            </div>
          );
        },
        size: 125,
      }),
    ]
  : []),
  ...(onClickModify ?
    [
      columnHelper.display({
        id: 'edit',
        header: () => <p className="text-center">Edit</p>,
        cell: ({ row }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const perms = usePermissions();

          return (
            <div className="text-center">
              <FieldSettingPopover
                onSave={(input) =>
                  onClickModify({ field: input, index: row.index })
                }
                data={row.original}
                disabled={
                  isDefaultField(row.original) ||
                  (!isInputStep && !perms.includes('channel_field_update'))
                }
                fieldRows={fieldRows}
              />
            </div>
          );
        },
        size: 125,
      }),
    ]
  : []),
];
