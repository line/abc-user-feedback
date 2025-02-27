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
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { createParser, parseAsString, useQueryState } from 'nuqs';

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
  const [queries, setQueries] = useQueryState<Record<string, unknown>[]>(
    'queries',
    createParser({
      parse(value) {
        return JSON.parse(value) as Record<string, unknown>[];
      },
      serialize(value) {
        return JSON.stringify(value);
      },
    }).withDefault([]),
  );

  const updateFilter = async (
    tableFilters: TableFilter[],
    operator: TableFilterOperator,
  ) => {
    const result = tableFilters.reduce(
      (acc, filter) => {
        return acc.concat({
          [filter.key]: filter.value,
          condition: filter.condition,
        });
      },
      [] as Record<string, unknown>[],
    );

    if (createdAtDateRange) {
      await setQueries(
        result
          .filter((v) => !v.createdAt)
          .concat({
            createdAt: {
              gte: dayjs(createdAtDateRange.startDate).toISOString(),
              lt: dayjs(createdAtDateRange.endDate).toISOString(),
            },
            condition: 'BETWEEN',
          }),
      );
    } else {
      await setQueries(result);
    }
    setOperator(operator);
  };
  const onChangeDateRange = async (value: DateRangeType) => {
    setCreatedAtDateRange(value);
    if (!value) {
      await setQueries((queries) => queries.filter((v) => !v.createdAt));
    } else {
      await setQueries((queries) =>
        queries
          .filter((v) => !v.createdAt)
          .concat({
            createdAt: {
              gte: dayjs(value.startDate).toISOString(),
              lt: dayjs(value.endDate).toISOString(),
            },
            condition: 'BETWEEN',
          }),
      );
    }
  };

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
      format: 'select',
      key: 'status',
      name: 'Status',
      matchType: ['IS'],
      options: ISSUES(t).map((issue) => ({ key: issue.key, name: issue.name })),
    },
    {
      format: 'ticket',
      key: 'externalIssueId',
      name: 'Ticket',
      matchType: ['IS'],
      ticketKey: issueTracker?.data.ticketKey,
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

  useEffect(() => {
    const tableFilter = queries.map((v) => {
      const key = Object.keys(v)[0];
      if (!key || typeof key !== 'string' || key === 'createdAt') return null;

      const value = v[key];
      const field = filterFields.find((v) => v.key === key);
      if (!field) return null;

      return {
        key,
        name: field.name,
        value,
        format: field.format,
        condition: v.condition,
      };
    });

    setFilters(tableFilter.filter((v) => !!v) as TableFilter[]);
  }, [queries]);

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
            onChange={onChangeDateRange}
            value={createdAtDateRange}
            maxDate={new Date()}
          />
          <TableFilterPopover
            filterFields={filterFields}
            onSubmit={updateFilter}
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
          queries={queries}
          operator={operator}
        />
      )}
      {viewType === 'list' && (
        <CategoryTable
          projectId={projectId}
          queries={queries}
          operator={operator}
        />
      )}
    </>
  );
};

export default IssueTable;
