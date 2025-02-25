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
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { parseAsString, useQueryState } from 'nuqs';

import { Button, Icon, ToggleGroup, ToggleGroupItem } from '@ufb/react';

import type {
  DateRangeType,
  TableFilter,
  TableFilterField,
  TableFilterOperator,
} from '@/shared';
import {
  DateRangePicker,
  ISSUES,
  TableFilterPopover,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import CategoryTable from '@/shared/ui/category-table.ui';

import IssueFormDialog from './issue-form-dialog.ui';
import IssueKanban from './issue-kanban.ui';

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const IssueTable: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const perms = usePermissions(projectId);

  const [createdAtDateRange, setCreatedAtDateRange] =
    useState<DateRangeType>(null);

  const [filters, setFilters] = useState<TableFilter[]>([]);
  const [operator, setOperator] = useState<TableFilterOperator>('AND');
  const queries = useMemo(() => {
    return filters.reduce(
      (acc, filter) => {
        return acc.concat({
          [filter.key]: filter.value,
          condition: filter.condition,
        });
      },
      [] as Record<string, unknown>[],
    );
  }, [filters]);

  const overlay = useOverlay();
  const [viewType, setViewType] = useQueryState(
    'viewType',
    parseAsString.withDefault('kanban'),
  );

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
      format: 'string',
      key: 'name',
      name: 'Title',
      matchType: ['CONTAINS', 'IS'],
    },
    {
      format: 'string',
      key: 'description',
      name: 'Description',
      matchType: ['CONTAINS', 'IS'],
    },
    {
      format: 'ticket',
      key: 'externalIssueId',
      name: 'Ticket',
      matchType: ['IS'],
      ticketKey: issueTracker?.data.ticketKey,
    },
    {
      format: 'multiSelect',
      key: 'status',
      name: 'Status',
      matchType: ['IS'],
      options: ISSUES(t).map((issue) => ({ key: issue.key, name: issue.name })),
    },
    {
      format: 'date',
      key: 'updatedAt',
      name: 'Updated',
      matchType: ['BETWEEN', 'IS'],
    },
    {
      format: 'string',
      key: 'category',
      name: 'Category',
      matchType: ['CONTAINS', 'IS'],
    },
  ];
  const openIssueFormDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <IssueFormDialog
        close={close}
        isOpen={isOpen}
        onSubmit={async (data) => {
          await createIssue(data);
          close();
        }}
        issueTracker={issueTracker?.data}
      />
    ));
  };

  return (
    <>
      <div className="mb-3 flex justify-between">
        <Button
          variant="outline"
          onClick={openIssueFormDialog}
          disabled={!perms.includes('issue_create')}
        >
          <Icon name="RiAddLine" /> {t('main.feedback.issue-cell.create-issue')}
        </Button>
        <div className="flex gap-2">
          <DateRangePicker
            onChange={(v) => setCreatedAtDateRange(v)}
            value={createdAtDateRange}
            maxDate={new Date()}
          />
          <TableFilterPopover
            filterFields={filterFields}
            onSubmit={(f, o) => {
              setFilters(f);
              setOperator(o);
            }}
            tableFilters={filters}
          />
          <ToggleGroup
            type="single"
            value={viewType}
            onValueChange={(v) => {
              if (!v) return;
              void setViewType(v);
            }}
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
        <IssueKanban
          projectId={projectId}
          issueTracker={issueTracker?.data}
          createdAtDateRange={createdAtDateRange}
          queries={queries}
          operator={operator}
        />
      )}
      {viewType === 'list' && (
        <CategoryTable
          projectId={projectId}
          createdAtDateRange={createdAtDateRange}
          queries={queries}
          operator={operator}
        />
      )}
    </>
  );
};

export default IssueTable;
