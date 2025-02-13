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
import dayjs from 'dayjs';
import { createParser, useQueryState } from 'nuqs';

import type {
  DateRangeType,
  TableFilter,
  TableFilterFieldFotmat,
  TableFilterOperator,
} from '@/shared';
import { client } from '@/shared';
import type { Field } from '@/entities/field';

import { env } from '@/env';

const toQuery = (
  projectId: number,
): Record<TableFilterFieldFotmat, (valeu: unknown) => unknown> => ({
  number: (value) => Number(value),
  issue: async (value) => {
    const { data } = await client.post({
      path: '/api/admin/projects/{projectId}/issues/search',
      pathParams: { projectId },
      body: {
        queries: [{ name: value, condition: 'IS' }] as Record<
          string,
          unknown
        >[],
      },
    });
    const result = data?.items.find((v) => v.name === value);
    return result ? [result.id] : [];
  },
  keyword: (value) => value,
  multiSelect: (value) => value,
  select: (value) => value,
  text: (value) => value,
  date: (value) => value,
});

// const toTableFilter = async (
//   projectId: number,
//   fields: Field[],
//   value: Record<string, unknown>,
// ): Promise<TableFilter> => {
//   const fieldKey = Object.keys(value).find((v) => v !== 'condition');
//   if (!fieldKey) throw new Error('Field key not found');
//   let currentValue = value[fieldKey];

//   if (fieldKey === 'issueIds') {
//     if (!currentValue) throw new Error('Issue not found');
//     const { data } = await client.get({
//       path: '/api/admin/projects/{projectId}/issues/{issueId}',
//       pathParams: {
//         projectId,
//         issueId: Number((currentValue as string[])[0]),
//       },
//     });
//     currentValue = data.id;
//   }

//   const field = fields.find((f) => f.key === fieldKey);
//   if (!field) throw new Error('Field not found');

//   return {
//     key: fieldKey,
//     name: field.name,
//     format: field.format as TableFilterFieldFotmat,
//     value: currentValue,
//     condition: value.condition as TableFilterCondition,
//   };
// };

const DEFAULT_DATE_RANGE = {
  startDate: dayjs()
    .subtract(env.NEXT_PUBLIC_MAX_DAYS - 1, 'day')
    .toDate(),
  endDate: dayjs().endOf('day').toDate(),
};

const useFeedbackQueryConverter = (input: {
  projectId: number;
  fields: Field[];
}) => {
  const { projectId } = input;

  const [tableFilters, setTableFilters] = useState<TableFilter[]>([]);
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

  const updateTableFilters = async (
    tableFilters: TableFilter[],
    operator: TableFilterOperator,
  ) => {
    const result = await Promise.all(
      tableFilters.map(async ({ condition, format, key, value }) => ({
        [key]: await toQuery(projectId)[format](value),
        condition,
      })),
    );

    setOperator(operator);
    setTableFilters(tableFilters);
    if (dateRange) {
      await setQueries(
        result
          .filter((v) => !v.createdAt)
          .concat({
            createdAt: {
              gte: dayjs(dateRange.startDate).toISOString(),
              lt: dayjs(dateRange.endDate).toISOString(),
            },
            condition: 'IS',
          }),
      );
    } else {
      await setQueries(result);
    }
  };

  const updateDateRage = async (value: DateRangeType) => {
    if (!value) return;
    await setQueries((queries) =>
      queries
        .filter((v) => !v.createdAt)
        .concat({
          createdAt: {
            gte: dayjs(value.startDate).toISOString(),
            lt: dayjs(value.endDate).toISOString(),
          },
          condition: 'IS',
        }),
    );
  };

  useEffect(() => {
    if (queries.length !== 0) return;
    void updateDateRage(DEFAULT_DATE_RANGE);
  }, []);

  const dateRange = useMemo(() => {
    const dateQuery = queries.find((v) => v.createdAt);

    const createdAt = dateQuery?.createdAt as
      | { gte: string; lt: string }
      | undefined;

    return createdAt ?
        {
          startDate: dayjs(createdAt.gte).toDate(),
          endDate: dayjs(createdAt.lt).toDate(),
        }
      : null;
  }, [queries]);

  // const updateQueries = async (queries: Record<string, unknown>[]) => {
  //   const result = await Promise.all(
  //     queries.map(async (query) => toTableFilter(projectId, fields, query)),
  //   );

  //   await updateTableFilters(result);
  //   await setQueries(queries);
  // };

  return {
    queries,
    tableFilters,
    operator,
    dateRange,
    updateTableFilters,
    updateDateRage,
  };
};

export default useFeedbackQueryConverter;
