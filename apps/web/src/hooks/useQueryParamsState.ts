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
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { DATE_FORMAT } from '@/constants/dayjs-format';
import { DEFAULT_DATE_RANGE } from '@/constants/default-date-range';
import type { DateRangeType } from '@/types/date-range.type';
import { removeEmptyValueInObject } from '@/utils/remove-empty-value-in-object';

const useQueryParamsState = (
  pathname: string,
  defaultQuery: Record<string, any>,
) => {
  const router = useRouter();

  const query = useMemo(() => {
    const newQuery = Object.entries(router.query).reduce(
      (acc, [key, value]) => {
        if (key in defaultQuery) return acc;
        return { ...acc, [key]: value };
      },
      {} as Record<string, any>,
    );

    return removeEmptyValueInObject(newQuery);
  }, [router.query]);

  const createdAtRange = useMemo(() => {
    if (!query.createdAt) return DEFAULT_DATE_RANGE;

    const [startDate, endDate] = query.createdAt.split('~');

    return {
      startDate: dayjs(startDate).toDate(),
      endDate: dayjs(endDate).toDate(),
    };
  }, [query]);

  const setCreatedAtRange = useCallback(
    (dateRange: DateRangeType) => {
      if (!dateRange) return;
      const { startDate, endDate } = dateRange;
      router.push(
        {
          pathname,
          query: {
            ...defaultQuery,
            ...query,
            createdAt: `${dayjs(startDate).format(DATE_FORMAT)}~${dayjs(
              endDate,
            ).format(DATE_FORMAT)}`,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, query],
  );

  const setQuery = useCallback(
    (input: Record<string, any>) => {
      const newQuery = Object.entries(input).reduce(
        (acc, [key, value]) => {
          if (typeof value === 'object' && isDate(value)) {
            value = `${dayjs(value.gte).format(DATE_FORMAT)}~${dayjs(
              value.lt,
            ).format(DATE_FORMAT)}`;
          }
          return { ...acc, [key]: value };
        },
        {} as Record<string, any>,
      );
      if (createdAtRange) {
        const { startDate, endDate } = createdAtRange;
        newQuery['createdAt'] = `${dayjs(startDate).format(
          DATE_FORMAT,
        )}~${dayjs(endDate).format(DATE_FORMAT)}`;
      }

      router.push(
        {
          pathname,
          query: {
            ...defaultQuery,
            ...newQuery,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router, defaultQuery],
  );
  return { query, setQuery, createdAtRange, setCreatedAtRange };
};

export default useQueryParamsState;

const isDate = (value: any) => {
  return 'gte' in value && 'lt' in value;
};
