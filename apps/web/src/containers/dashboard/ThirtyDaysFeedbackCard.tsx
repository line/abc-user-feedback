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

import { DashboardCard } from '@/components';
import { useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
}

const ThirtyDaysFeedbackCard: React.FC<IProps> = ({ projectId }) => {
  const { data: yesterDay } = useOAIQuery({
    path: '/api/statistics/feedback/count',
    variables: {
      from: dayjs().subtract(30, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(1, 'day').endOf('day').toISOString(),
      projectId,
    },
  });
  const { data } = useOAIQuery({
    path: '/api/statistics/feedback/count',
    variables: {
      from: dayjs().subtract(60, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(31, 'day').endOf('day').toISOString(),
      projectId,
    },
  });

  const percentage = useMemo(() => {
    if (!yesterDay || !data || yesterDay.count === 0) return 0;
    return ((yesterDay.count - data.count) / yesterDay.count) * 100;
  }, [yesterDay, data]);

  return (
    <DashboardCard
      count={yesterDay?.count ?? 0}
      title="지난 30일 피드백 수"
      description={`지난 30일 동안 수집된 피드백의 개수입니다. (${dayjs()
        .subtract(7, 'day')
        .format('YYYY/MM/DD')} - ${dayjs()
        .subtract(1, 'day')
        .format('YYYY/MM/DD')})`}
      percentage={percentage}
    />
  );
};

export default ThirtyDaysFeedbackCard;
