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
import { memo, useEffect, useMemo, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import {
  BasicTable,
  DATE_TIME_FORMAT,
  ExpandableText,
  ImagePreviewButton,
  ISSUES,
} from '@/shared';
import { IssueBadge } from '@/entities/issue';
import type { Issue } from '@/entities/issue';
import type { FeedbackColumnType } from '@/widgets/feedback-table/feedback-table-columns';
import EditableCell from '@/widgets/feedback-table/ui/editable-cell';

import type { FieldInfo } from '../field.type';

const columnHelper = createColumnHelper<FeedbackColumnType>();

interface IProps {
  fields: FieldInfo[];
}

const PreviewTable: React.FC<IProps> = ({ fields }) => {
  const [rows, setRows] = useState<FeedbackColumnType[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fakeRows: FeedbackColumnType[] = [];
    const issues: Issue[] = faker.helpers
      .uniqueArray(() => faker.word.sample(), 10)
      .map((v, i) => ({
        id: i + 1,
        createdAt: faker.date.recent().toString(),
        description: faker.lorem.sentence(),
        feedbackCount: faker.number.int(),
        updatedAt: faker.date.recent().toString(),
        name: v,
        status: faker.helpers.arrayElement(ISSUES(t).map((v) => v.key)),
      }));

    for (let i = 1; i <= 20; i++) {
      const fakeData: FeedbackColumnType = {
        id: i,
        createdAt: dayjs().add(i, 'hour').toString(),
        updatedAt: dayjs().add(i, 'hour').toString(),
        issues: faker.helpers.arrayElements(issues, {
          min: 0,
          max: 4,
        }),
      };
      for (const field of fields) {
        if (field.key === 'id') continue;
        if (field.key === 'issues') continue;
        if (field.key === 'createdAt') continue;
        if (field.key === 'updatedAt') continue;
        fakeData[field.name] =
          field.format === 'date' ? faker.date.anytime()
          : field.format === 'keyword' ? faker.word.noun()
          : field.format === 'multiSelect' ?
            faker.helpers.arrayElements(
              (field.options ?? []).map((v) => v.name),
            )
          : field.format === 'select' ?
            faker.helpers.arrayElement((field.options ?? []).map((v) => v.name))
          : field.format === 'number' ? faker.number.int()
          : field.format === 'text' ? faker.lorem.text()
          : faker.helpers.arrayElements(
              Array.from(
                { length: faker.number.int({ min: 1, max: 15 }) },
                () => '/assets/images/sample_image.png',
              ),
            );
      }
      fakeRows.push(fakeData);
    }
    setRows(fakeRows);
  }, [fields]);

  const columns = useMemo(
    () =>
      fields.map((field) =>
        columnHelper.accessor(field.key, {
          size:
            field.key === 'id' ? 50
            : field.format === 'text' ? 200
            : 150,
          header: () => field.name,
          cell: (info) =>
            field.key === 'issues' ?
              <div className="scrollbar-hide flex items-center gap-1 overflow-hidden">
                {(info.getValue() as Issue[] | undefined)?.map((v, i) => (
                  <IssueBadge key={i} issue={v} />
                ))}
              </div>
            : field.property === 'EDITABLE' ?
              <EditableCell
                field={field}
                value={info.getValue() as unknown}
                isExpanded={info.row.getIsExpanded()}
                feedbackId={info.row.original.id}
              />
            : typeof info.getValue() === 'undefined' ? undefined
            : field.format === 'date' ?
              dayjs(info.getValue() as string).format(DATE_TIME_FORMAT)
            : field.format === 'multiSelect' ?
              ((info.getValue() ?? []) as string[]).join(', ')
            : field.format === 'text' ?
              <ExpandableText isExpanded={info.row.getIsExpanded()}>
                {info.getValue() as string}
              </ExpandableText>
            : field.format === 'images' ?
              <ImagePreviewButton urls={(info.getValue() ?? []) as string[]} />
            : String(info.getValue()),
        }),
      ),
    [fields],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onEnd',
  });

  return (
    <div className="overflow-x-auto">
      <BasicTable table={table} className="table-fixed" />
    </div>
  );
};

export default memo(
  PreviewTable,
  (prev, next) => JSON.stringify(prev.fields) === JSON.stringify(next.fields),
);
