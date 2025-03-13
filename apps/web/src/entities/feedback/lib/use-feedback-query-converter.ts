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
import { decode, encode } from 'js-base64';
import { createParser, useQueryState } from 'nuqs';

import type {
  DateRangeType,
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
  const [queries, setQueries] = useQueryState<Record<string, unknown>[]>(
    'queries',
    createParser({
      parse: (value) => {
        return JSON.parse(decode(value)) as Record<string, unknown>[];
      },
      serialize: (value) => {
        return encode(JSON.stringify(value));
      },
    }).withDefault([{ createdAt: DEFAULT_DATE_RANGE, condition: 'IS' }]),
  );

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

  const onChangeDateRange = useCallback(async (value: DateRangeType) => {
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
  }, []);

  const tableFilters = useMemo(() => {
    return queries
      .map((v) => {
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
      })
      .filter((v) => !!v) as TableFilter[];
  }, [queries, filterFields]);

  const onChageTableFilters = useCallback(
    async (tableFilters: TableFilter[], operator: TableFilterOperator) => {
      const result = await Promise.all(
        tableFilters.map(async ({ condition, format, key, value }) => ({
          [key]: await toQuery(projectId)[format](value),
          condition,
        })),
      );
      if (result.length === 0 && !dateRange) {
        await setQueries([{ createdAt: DEFAULT_DATE_RANGE, condition: 'IS' }]);
        return;
      }

      setOperator(operator);
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
    },
    [dateRange],
  );

  return {
    queries: queries.filter(
      (v) =>
        filterFields.some((vv) => vv.key === Object.keys(v)[0]) ||
        Object.keys(v)[0] === 'createdAt',
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
