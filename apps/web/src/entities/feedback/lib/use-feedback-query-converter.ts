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

import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { createParser, useQueryState } from 'nuqs';

import type {
  DateRangeType,
  SearchQuery,
  TableFilter,
  TableFilterField,
  TableFilterFieldFotmat,
  TableFilterOperator,
} from '@/shared';
import { client } from '@/shared';

import { env } from '@/env';

const toQuery = (
  projectId: number,
): Record<TableFilterFieldFotmat, (valeu: unknown) => unknown> => ({
  number: (value) => Number(value),
  issue: async (value) => {
    if (typeof value === 'string') {
      const { data } = await client.post({
        path: '/api/admin/projects/{projectId}/issues/search',
        pathParams: { projectId },
        body: {
          queries: [{ key: 'name', value, condition: 'IS' }] as SearchQuery[],
        },
      });
      const result = data?.items.find((v) => v.name === value);
      return result ? [result.id] : [];
    }
    if (Array.isArray(value)) {
      return await Promise.all(
        value.map(async (v: string) => {
          const issueId = parseInt(v);
          if (!isNaN(issueId)) return issueId;

          const { data } = await client.post({
            path: '/api/admin/projects/{projectId}/issues/search',
            pathParams: { projectId },
            body: {
              queries: [
                { key: 'name', value: v, condition: 'IS' },
              ] as SearchQuery[],
            },
          });
          return data?.items.find((vv) => vv.name === v)?.id;
        }),
      );
    }
  },
  string: (value) => value,
  select: (value) => value,
  date: (value) => value,
  ticket: (value) => value,
  multiSelect: (value) => value,
});

const DEFAULT_DATE_RANGE = {
  gte: dayjs()
    .subtract(env.NEXT_PUBLIC_MAX_DAYS - 1, 'day')
    .toDate(),
  lt: dayjs().endOf('day').toDate(),
};

const useFeedbackQueryConverter = (input: {
  projectId: number;
  filterFields: TableFilterField[];
}) => {
  const { projectId, filterFields } = input;

  const [operator, setOperator] = useState<TableFilterOperator>('AND');
  const [queries, setQueries] = useQueryState<SearchQuery[]>(
    'queries',
    createParser({
      parse: (value) => JSON.parse(value) as SearchQuery[],
      serialize: (value) => JSON.stringify(value),
    }).withDefault([
      { key: 'createdAt', value: DEFAULT_DATE_RANGE, condition: 'IS' },
    ]),
  );

  const dateRange = useMemo(() => {
    const dateQuery = queries.find((v) => v.key === 'createdAt');

    const createdAt = dateQuery?.value as
      | { gte: string; lt: string }
      | undefined;

    return createdAt ?
        {
          startDate: dayjs(createdAt.gte).toDate(),
          endDate: dayjs(createdAt.lt).toDate(),
        }
      : null;
  }, [queries]);

  const onChangeDateRange = useCallback(async (value: DateRangeType) => {
    if (!value) return;
    await setQueries((queries) =>
      queries
        .filter((v) => v.key !== 'createdAt')
        .concat({
          key: 'createdAt',
          value: {
            gte: dayjs(value.startDate).toISOString(),
            lt: dayjs(value.endDate).toISOString(),
          },
          condition: 'IS',
        }),
    );
  }, []);

  const tableFilters = useMemo(() => {
    return queries
      .map((v) => {
        const key = v.key;
        if (key === 'createdAt') return null;
        const value = v.value;

        const field = filterFields.find((v) => v.key === key);
        if (!field) return null;

        return {
          key,
          name: field.name,
          value,
          format: field.format,
          condition: v.condition,
        };
      })
      .filter((v) => !!v) as TableFilter[];
  }, [queries, filterFields]);

  const onChageTableFilters = useCallback(
    async (tableFilters: TableFilter[], operator: TableFilterOperator) => {
      const result = await Promise.all(
        tableFilters.map(async ({ condition, format, key, value }) => ({
          key,
          value: await toQuery(projectId)[format](value),
          condition,
        })),
      );
      if (result.length === 0 && !dateRange) {
        await setQueries([
          { key: 'createdAt', value: DEFAULT_DATE_RANGE, condition: 'IS' },
        ]);
        return;
      }

      setOperator(operator);
      if (dateRange) {
        await setQueries(
          result
            .filter((v) => v.key !== 'createdAt')
            .concat({
              key: 'createdAt',
              value: {
                gte: dayjs(dateRange.startDate).toISOString(),
                lt: dayjs(dateRange.endDate).toISOString(),
              },
              condition: 'IS',
            }),
        );
      } else {
        await setQueries(result);
      }
    },
    [dateRange],
  );

  return {
    queries: queries.filter(
      (v) =>
        filterFields.some((vv) => vv.key === v.key) || v.key === 'createdAt',
    ),
    tableFilters: tableFilters.filter((v) =>
      filterFields.some((vv) => vv.key === v.key),
    ),
    operator,
    dateRange,
    updateTableFilters: onChageTableFilters,
    updateDateRage: onChangeDateRange,
  };
};

export default useFeedbackQueryConverter;
