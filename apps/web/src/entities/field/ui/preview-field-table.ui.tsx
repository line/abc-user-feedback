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
import { memo, useMemo } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { BasicTable } from '@/shared';
import { usePreviewFeedback } from '@/entities/feedback';
import { getColumns } from '@/entities/feedback/feedback-table-columns';

import type { FieldInfo } from '../field.type';

interface IProps {
  fields: FieldInfo[];
}

const PreviewFieldTable: React.FC<IProps> = ({ fields }) => {
  const columns = useMemo(
    () => getColumns(fields, true).filter((v) => v.id !== 'feedback-checkbox'),
    [fields],
  );
  const feedbacks = usePreviewFeedback(fields);

  const table = useReactTable({
    columns,
    data: feedbacks,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
  });

  return (
    <div className="h-full overflow-auto">
      <BasicTable table={table} className="table-fixed" />
    </div>
  );
};

export default memo(
  PreviewFieldTable,
  (prev, next) => JSON.stringify(prev.fields) === JSON.stringify(next.fields),
);
