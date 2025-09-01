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
import type { ColumnDef, DisplayColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';

import { Icon } from '@ufb/react';

import { cn, ExpandableText, TableCheckbox } from '@/shared';
import { FieldFormatLabel } from '@/entities/field';
import type { FieldInfo } from '@/entities/field';

import { FIELD_FORMAT_ICON_MAP } from '../field/field.constant';
import type { Issue } from '../issue';
import type { Feedback } from './feedback.type';
import FeedbackCell from './ui/feedback-cell';
import IssueCell from './ui/issue-cell';

const columnHelper = createColumnHelper<Feedback>();

export const getColumns = (
  fieldData: FieldInfo[],
  isPreview?: boolean,
): ColumnDef<Feedback>[] =>
  [
    columnHelper.display({
      id: 'feedback-checkbox',
      header: ({ table }) => (
        <TableCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onCheckedChange: (checked) => table.toggleAllRowsSelected(checked),
          }}
        />
      ),
      cell: ({ row }) => (
        <TableCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onCheckedChange: (checked) => row.toggleSelected(checked),
          }}
        />
      ),
      size: 50,
      enableResizing: false,
    }),
  ].concat(
    fieldData.map((field) =>
      field.key === 'id' ?
        columnHelper.accessor('id', {
          id: 'id',
          size: 100,
          minSize: 100,
          header: () => (
            <div className="flex items-center gap-1">
              <Icon name={FIELD_FORMAT_ICON_MAP.number} size={16} />
              {fieldData.find((v) => v.key === 'id')?.name}
            </div>
          ),
          cell: (info) => (
            <ExpandableText isExpanded={info.row.getIsExpanded()}>
              {info.getValue() as number}
            </ExpandableText>
          ),
          enableSorting: false,
        })
      : field.key === 'issues' ?
        columnHelper.accessor('issues', {
          id: 'issues',
          size: 150,
          minSize: 150,
          header: () => <FieldFormatLabel format="multiSelect" name="Issue" />,
          cell: ({ getValue, row }) => (
            <div className={cn({ 'overflow-hidden': !row.getIsExpanded() })}>
              <div className={cn('flex', { 'w-max': !row.getIsExpanded() })}>
                <IssueCell
                  issues={getValue() as Issue[]}
                  feedbackId={Number(row.id)}
                  isPreview={isPreview}
                />
              </div>
            </div>
          ),
          enableSorting: false,
        })
      : columnHelper.accessor(field.key, {
          id: field.key,
          size: field.format === 'text' ? 200 : 150,
          minSize: 75,
          header: () => (
            <FieldFormatLabel format={field.format} name={field.name} />
          ),
          cell: (info) => (
            <FeedbackCell
              field={field}
              isExpanded={info.row.getIsExpanded()}
              value={info.getValue()}
              feedbackId={Number(info.row.id)}
            />
          ),
          meta: {
            truncate: !(
              field.format === 'select' ||
              field.format === 'multiSelect' ||
              field.format === 'images'
            ),
          },
          enableSorting:
            field.format === 'date' &&
            (field.key === 'createdAt' || field.key === 'updatedAt'),
        }),
    ) as DisplayColumnDef<Feedback>[],
  );
