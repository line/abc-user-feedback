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
import minMax from 'dayjs/plugin/minMax';

import { CHART_FIVE_COLORS } from '@/constants/chart-colors';
import useDayCount from './useDayCount';

dayjs.extend(minMax);

const getDarkColor = () => {
  return (
    '#' +
    Array.from({ length: 6 })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
  );
};

const useLineChartData = (
  from: Date,
  to: Date,
  targetData: { id: number; name: string }[],
  data?: {
    id: number;
    statistics: { startDate: string; endDate: string; count: number }[];
  }[],
) => {
  const dataKeys = useMemo(
    () =>
      targetData.map((v, i) => ({
        color: CHART_FIVE_COLORS[i] ?? getDarkColor(),
        name: v.name,
      })),
    [targetData],
  );

  const dayCount = useDayCount(from, to);

  const chartData = useMemo(() => {
    if (!data) return [];

    const result = [];

    let currentDate = dayjs(to).endOf('day');
    const startDate = dayjs(from).startOf('day');

    while (currentDate.isAfter(startDate)) {
      const prevDate = dayjs.max(
        currentDate.subtract(dayCount > 50 ? 6 : 0, 'day'),
        dayjs(from),
      );
      if (!prevDate) throw new Error("Can't get prevDate");

      const channelData = targetData.reduce(
        (acc, cur) => {
          const currentData = data.find((v) => v.id === cur.id);
          const count =
            currentData?.statistics.find(
              (v) => v.endDate === currentDate.format('YYYY-MM-DD'),
            )?.count ?? 0;
          return { ...acc, [cur.name]: count };
        },
        {
          date:
            dayCount > 50
              ? `${prevDate.format('MM/DD')} - ${currentDate.format('MM/DD')}`
              : currentDate.format('MM/DD'),
        },
      );

      result.push(channelData);

      currentDate = prevDate.subtract(1, 'day');
    }
    return result.reverse();
  }, [data, dayCount, targetData]);

  return { chartData, dataKeys };
};

export default useLineChartData;
