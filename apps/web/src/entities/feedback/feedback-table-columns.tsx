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

import { Icon } from '@ufb/react';

import { ExpandableText, TableCheckbox } from '@/shared';
import type { FieldInfo } from '@/entities/field';

import { FIELD_FORMAT_ICON_MAP } from '../field/field.constant';
import type { Feedback } from './feedback.type';
import EditableCell from './ui/editable-cell';
import FeedbackCell from './ui/feedback-cell';
import IssueCell from './ui/issue-cell';

const columnHelper = createColumnHelper<Feedback>();

export const getColumns = (fieldData: FieldInfo[]) =>
  [
    columnHelper.display({
      id: 'select',
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
          {info.getValue()}
        </ExpandableText>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('issues', {
      id: 'issues',
      size: 150,
      minSize: 150,
      header: () => (
        <div className="flex items-center gap-1">
          <Icon name={FIELD_FORMAT_ICON_MAP.multiSelect} size={16} />
          Issue
        </div>
      ),
      cell: (info) => <IssueCell issues={info.getValue()} />,
      enableSorting: false,
    }),
  ].concat(
    fieldData
      .filter((v) => v.key !== 'id' && v.key !== 'issues')
      .map((field) =>
        columnHelper.accessor(field.key, {
          id: field.key,
          size: field.format === 'text' ? 200 : 150,
          minSize: 75,
          header: () => (
            <div className="flex items-center gap-1">
              <Icon name={FIELD_FORMAT_ICON_MAP[field.format]} size={16} />
              {field.name}
            </div>
          ),
          cell: (info) =>
            field.property === 'EDITABLE' ?
              <EditableCell
                field={field}
                value={info.getValue()}
                isExpanded={info.row.getIsExpanded()}
                feedbackId={info.row.original.id}
              />
            : <FeedbackCell
                field={field}
                isExpanded={info.row.getIsExpanded()}
                value={info.getValue()}
              />,
          enableSorting:
            field.format === 'date' &&
            (field.key === 'createdAt' || field.key === 'updatedAt'),
        }),
      ),
  );
