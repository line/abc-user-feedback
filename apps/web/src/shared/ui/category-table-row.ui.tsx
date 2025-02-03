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

import { useEffect, useMemo, useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import { Badge, Icon } from '@ufb/react';

import type { Category } from '@/entities/category';
import type { Issue } from '@/entities/issue';
import { useIssueSearch } from '@/entities/issue';
import { getColumnsByCategory } from '@/widgets/issue-table/issue-table-columns';
import IssueDetailSheet from '@/widgets/issue-table/ui/issue-detail-sheet.ui';

import { useOAIQuery } from '../lib';
import { cn } from '../utils';
import { BasicTable, TablePagination } from './tables';

interface Props {
  projectId: number;
  category: Category;
}

const CategoryTableRow = (props: Props) => {
  const { projectId, category } = props;
  const overlay = useOverlay();

  const { t } = useTranslation();

  const [rows, setRows] = useState<Issue[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const columns = useMemo(
    () => getColumnsByCategory(t, projectId),
    [t, projectId],
  );

  const table = useReactTable({
    columns,
    data: rows,
    getCoreRowModel: getCoreRowModel(),
  });

  const { data } = useIssueSearch(projectId, {
    queries: [{ categoryId: category.id, condition: 'IS' }],
  });
  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const openIssueDetailOverlay = (data: Issue) => {
    overlay.open(({ close, isOpen }) => (
      <IssueDetailSheet
        close={close}
        data={data}
        isOpen={isOpen}
        projectId={projectId}
        issueTracker={issueTracker?.data}
      />
    ));
  };

  useEffect(() => {
    setRows(data?.items ?? []);
  }, [data]);

  return (
    <div>
      <div
        className={cn(
          'bg-neutral-tertiary flex h-12 items-center rounded-t px-4',
          { 'rounded-b': !isOpen },
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-2">
          <Icon
            name="RiArrowDownSLine"
            className={cn({ 'rotate-180': !isOpen })}
          />
          {category.name}
          {data?.meta.totalItems ?
            <Badge variant="outline" radius="large">
              {data.meta.totalItems}
            </Badge>
          : <></>}
        </div>
      </div>
      {isOpen && (
        <>
          <BasicTable
            table={table}
            disableRound
            onClickRow={(_, row) => openIssueDetailOverlay(row)}
          />
          <div className="flex h-12 w-full items-center rounded-b border border-t-0 px-4">
            <TablePagination table={table} disableRowSelect disableLimit />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryTableRow;
