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

import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { createParser, parseAsStringLiteral, useQueryState } from 'nuqs';

import type {
  DateRangeType,
  SearchQuery,
  TableFilter,
  TableFilterField,
  TableFilterFieldFotmat,
  TableFilterOperator,
} from '@/shared';
import { client, TableFilterOperators } from '@/shared';

const toQuery = (
  projectId: number,
): Record<TableFilterFieldFotmat, (value: unknown) => unknown> => ({
  number: (value) => Number(value),
  issue: async (value) => {
    const { data } = await client.post({
      path: '/api/admin/projects/{projectId}/issues/search',
      pathParams: { projectId },
      body: {
        queries: [{ key: 'name', value, condition: 'IS' }] as SearchQuery[],
      },
    });
    const result = data?.items.find((v) => v.name === value);
    return result ? [result.id] : [];
  },
  string: (value) => value,
  select: (value) => value,
  date: (value) => value,
  ticket: (value) => value,
  multiSelect: (value) => value,
});

const useIssueQueryConverter = (input: {
  projectId: number;
  filterFields: TableFilterField[];
}) => {
  const { projectId, filterFields } = input;

  const [operator, setOperator] = useQueryState<TableFilterOperator>(
    'operator',
    parseAsStringLiteral(TableFilterOperators).withDefault('AND'),
  );
  const [queries, setQueries] = useQueryState<SearchQuery[]>(
    'queries',
    createParser({
      parse: (value) => JSON.parse(value) as SearchQuery[],
      serialize: (value) => JSON.stringify(value),
    }).withDefault([]),
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

  const onChangeDateRange = useCallback(
    async (value: DateRangeType) => {
      if (!value) return;
      if (value.startDate === null || value.endDate === null) {
        await setQueries((queries) =>
          queries.filter((v) => v.key !== 'createdAt'),
        );
        return;
      }
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
    },
    [queries],
  );

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
    queries: queries.filter((v) => !!v.value),
    tableFilters,
    operator,
    dateRange,
    updateTableFilters: onChageTableFilters,
    updateDateRage: onChangeDateRange,
  };
};

export default useIssueQueryConverter;
