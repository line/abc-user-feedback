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
import { useMemo } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { BasicTable } from '@/shared';
import type { FieldInfo } from '@/entities/field';

import { getColumns } from '../feedback-table-columns';
import type { Feedback } from '../feedback.type';

interface Props {
  fields: FieldInfo[];
  feedbacks: Feedback[];
}

const FeedbackTable: React.FC<Props> = (props) => {
  const { fields, feedbacks } = props;
  const columns = useMemo(() => getColumns(fields), [fields]);

  const table = useReactTable({
    columns,
    data: feedbacks,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} createButton classname="table-fixed" />;
};

export default FeedbackTable;
