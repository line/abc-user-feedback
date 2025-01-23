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
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Button, Icon, ToggleGroup, ToggleGroupItem } from '@ufb/react';

import type { TableFilterField } from '@/shared';
import {
  DateRangePicker,
  ISSUES,
  TableFilterPopover,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import CategoryTable from '@/shared/ui/category-table.ui';

import { env } from '@/env';
import { useIssueQuery } from '../lib';
import IssueFormDialog from './issue-form-dialog.ui';
import IssueKanbanColumn from './issue-kanban-column.ui';

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const IssueTable: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { dateRange, setDateRange } = useIssueQuery(projectId);

  const overlay = useOverlay();
  const [viewType, setViewType] = useState('kanban');

  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });
  const { mutateAsync: createIssue } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/issues',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects/{projectId}/issues/search'],
        });
      },
    },
  });

  const filterFields: TableFilterField[] = [
    {
      format: 'text',
      key: 'name',
      name: 'Title',
    },
    {
      format: 'select',
      key: 'status',
      name: 'Status',
      options: ISSUES(t).map((issue) => ({ key: issue.key, name: issue.name })),
    },
    {
      format: 'text',
      key: 'description',
      name: 'Description',
    },
    {
      format: 'text',
      key: 'ticket',
      name: 'Ticke',
    },
  ];
  const openIssueFormDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <IssueFormDialog
        close={close}
        isOpen={isOpen}
        onSubmit={async (data) => {
          await createIssue({ name: data.name });
          close();
        }}
        issueTracker={issueTracker?.data}
      />
    ));
  };

  return (
    <>
      <div className="mb-3 flex justify-between">
        <Button variant="outline" onClick={openIssueFormDialog}>
          <Icon name="RiAddLine" /> {t('main.feedback.issue-cell.create-issue')}
        </Button>
        <div className="flex gap-2">
          <DateRangePicker
            onChange={(v) => setDateRange(v)}
            value={dateRange}
            maxDate={new Date()}
            maxDays={env.NEXT_PUBLIC_MAX_DAYS}
          />
          <TableFilterPopover
            onSubmit={(filters) => console.log(filters)}
            filterFields={filterFields}
            tableFilters={[]}
          />
          <ToggleGroup
            type="single"
            value={viewType}
            onValueChange={setViewType}
          >
            <ToggleGroupItem value="kanban" className="w-24">
              <Icon name="RiCarouselView" />
              Kanban
            </ToggleGroupItem>
            <ToggleGroupItem value="list" className="w-24">
              <Icon name="RiListCheck" />
              List
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {viewType === 'kanban' && (
        <div className="grid grid-cols-5 items-start gap-4">
          {ISSUES(t).map((issue) => (
            <IssueKanbanColumn
              key={issue.key}
              issue={issue}
              projectId={projectId}
              issueTracker={issueTracker?.data}
            />
          ))}
        </div>
      )}
      {viewType === 'list' && <CategoryTable projectId={projectId} />}
    </>
  );
};

export default IssueTable;
