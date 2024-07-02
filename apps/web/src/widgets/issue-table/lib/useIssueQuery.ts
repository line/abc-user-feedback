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
import dayjs from 'dayjs';

import { DATE_FORMAT } from '@/shared';

import useQueryParamsState from '@/hooks/useQueryParamsState';
import type { DateRangeType } from '@/types/date-range.type';

export const useIssueQuery = (projectId: number) => {
  const { query, setQuery } = useQueryParamsState(
    { projectId },
    { status: 'total' },
    (input) => {
      if (!input.createdAt) return true;
      const [starDate, endDate] = input.createdAt.split('~');
      if (dayjs(endDate).isAfter(dayjs(), 'day')) return false;
      if (dayjs(endDate).isBefore(dayjs(starDate), 'day')) return false;
      return true;
    },
  );

  const dateRange = useMemo(() => {
    const queryStr = query['createdAt'];
    if (!queryStr) return null;

    const [startDateStr, endDateStr] = queryStr.split('~');

    return {
      startDate: dayjs(startDateStr).toDate(),
      endDate: dayjs(endDateStr).toDate(),
    };
  }, [query]);

  const setDateRange = (dateRange: DateRangeType) => {
    setQuery({
      ...query,
      createdAt:
        dateRange ?
          `${dayjs(dateRange.startDate).format(DATE_FORMAT)}~${dayjs(
            dateRange.endDate,
          ).format(DATE_FORMAT)}`
        : undefined,
    });
  };

  const formattedQuery = useMemo(() => {
    return Object.entries(query).reduce((prev, [key, value]) => {
      if (key === 'status' && value === 'total') return prev;
      if (key === 'createdAt' || key === 'updatedAt') {
        const [startDate, endDate] = value.split('~');
        return {
          ...prev,
          [key]: {
            gte: dayjs(startDate).startOf('day').toISOString(),
            lt: dayjs(endDate).endOf('day').toISOString(),
          },
        };
      }
      return { ...prev, [key]: value };
    }, {});
  }, [query]);

  return { query, setQuery, dateRange, setDateRange, formattedQuery };
};
