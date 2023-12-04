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
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useInterval } from 'react-use';

import { DashboardCard } from '@/components';
import { useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
}

const TodayFeedbackCard: React.FC<IProps> = ({ projectId }) => {
  const [count, setCount] = useState(60);

  const { data: currentData, refetch: refetchCurrentData } = useOAIQuery({
    path: '/api/statistics/feedback/count',
    variables: {
      from: dayjs().startOf('day').toISOString(),
      to: dayjs().endOf('day').toISOString(),
      projectId,
    },
  });

  const { data: previousData, refetch: refetchPreviousData } = useOAIQuery({
    path: '/api/statistics/feedback/count',
    variables: {
      from: dayjs().subtract(1, 'day').startOf('day').toISOString(),
      to: dayjs().subtract(1, 'day').endOf('day').toISOString(),
      projectId,
    },
  });

  const percentage = useMemo(() => {
    if (!currentData || !previousData || currentData.count === 0) return 0;
    return ((currentData.count - previousData.count) / currentData.count) * 100;
  }, [currentData, previousData]);

  useInterval(() => {
    if (count === 0) {
      refetchCurrentData();
      refetchPreviousData();
      setCount(60);
    } else setCount((prev) => prev - 1);
  }, 1000);

  return (
    <DashboardCard
      count={currentData?.count ?? 0}
      title="오늘 피드백 수"
      description={`오늘 수집된 피드백의 개수입니다. (${dayjs().format(
        'YYYY/MM/DD',
      )})`}
      percentage={percentage}
      autofreshCount={count}
    />
  );
};

export default TodayFeedbackCard;
