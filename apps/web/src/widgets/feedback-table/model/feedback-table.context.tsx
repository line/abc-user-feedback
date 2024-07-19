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
import { createContext, useContext, useMemo } from 'react';
import dayjs from 'dayjs';

import type { DateRangeType } from '@/shared';
import { DATE_FORMAT, useQueryParamsState } from '@/shared';
import { EMPTY_FUNCTION } from '@/shared/utils/empty-function';

import { env } from '@/env';

const DEFAULT_DATE_RANGE: DateRangeType = {
  startDate: dayjs().subtract(env.NEXT_PUBLIC_MAX_DAYS, 'day').toDate(),
  endDate: dayjs().toDate(),
};

const DEFAULT_DATE_RANGE_STRING = {
  createdAt: `${dayjs(DEFAULT_DATE_RANGE.startDate).format(
    'YYYY-MM-DD',
  )}~${dayjs(DEFAULT_DATE_RANGE.endDate).format('YYYY-MM-DD')}`,
};

interface IFeedbackTableContext {
  query: Record<string, unknown>;
  setQuery: (_: Record<string, unknown>) => void;
  projectId: number;
  channelId: number;
  createdAtRange: DateRangeType;
  setCreatedAtRange: (_: DateRangeType) => void;
}
export const FeedbackTableContext = createContext<IFeedbackTableContext>({
  query: {},
  setQuery: EMPTY_FUNCTION,
  projectId: 0,
  channelId: 0,
  createdAtRange: DEFAULT_DATE_RANGE,
  setCreatedAtRange: EMPTY_FUNCTION,
});
interface IProps extends React.PropsWithChildren {
  projectId: number;
  channelId: number;
}

export const FeedbackTableProvider: React.FC<IProps> = (props) => {
  const { children, projectId, channelId } = props;

  const { query, setQuery } = useQueryParamsState(
    { projectId: String(projectId), channelId: String(channelId) },
    DEFAULT_DATE_RANGE_STRING,
    (input) => {
      if (!input.createdAt || typeof input.createdAt !== 'string') return false;

      const [starDate, endDate] = input.createdAt.split('~');
      if (dayjs(endDate).isAfter(dayjs(), 'day')) return false;
      if (dayjs(endDate).isBefore(dayjs(starDate), 'day')) return false;
      return (
        dayjs(endDate).diff(dayjs(starDate), 'day') <= env.NEXT_PUBLIC_MAX_DAYS
      );
    },
  );

  const createdAtRange = useMemo(() => {
    const queryStr = query.createdAt;
    if (!queryStr || typeof queryStr !== 'string') return null;

    const [startDateStr, endDateStr] = queryStr.split('~');

    return {
      startDate: dayjs(startDateStr).toDate(),
      endDate: dayjs(endDateStr).toDate(),
    };
  }, [query]);

  const setCreatedAtRange = (dateRange: DateRangeType) => {
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

  return (
    <FeedbackTableContext.Provider
      value={{
        query,
        setQuery,
        projectId,
        channelId,
        createdAtRange,
        setCreatedAtRange,
      }}
    >
      {children}
    </FeedbackTableContext.Provider>
  );
};

export function useFeedbackTable() {
  return useContext(FeedbackTableContext);
}
