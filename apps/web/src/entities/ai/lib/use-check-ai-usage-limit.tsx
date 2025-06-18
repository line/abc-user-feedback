/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useLocalStorage } from 'react-use';

import { toast } from '@ufb/react';

import { useOAIQuery } from '@/shared';

const useCheckAIUsageLimit = (projectId: number) => {
  const { data: aiIntegrations } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });
  const { data: aiUsageLimit } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/usages',
    variables: {
      projectId,
      from: dayjs().startOf('month').toISOString(),
      to: dayjs().endOf('month').toISOString(),
    },
  });
  const [checkedTotalLimitTime, setCheckedTotalLimitTime] =
    useLocalStorage<string>(
      `totalLimit-${projectId}-${dayjs().format('YYYY-MM')}`,
    );
  const [isCheckedNotificationLimit, setIsCheckedNotificationLimit] =
    useLocalStorage(
      `notificationLimit-${projectId}-${dayjs().format('YYYY-MM')}`,
      false,
    );

  useEffect(() => {
    if (aiIntegrations?.apiKey === '') return;

    if (aiUsageLimit && aiIntegrations) {
      const totalUsage = aiUsageLimit.reduce(
        (acc, usage) => acc + usage.usedTokens,
        0,
      );
      const totalLimit = aiIntegrations.tokenThreshold;
      if (!totalLimit) return;
      if (
        totalUsage >= totalLimit &&
        (!checkedTotalLimitTime ||
          dayjs(checkedTotalLimitTime).add(1, 'day').isBefore(dayjs()))
      ) {
        setCheckedTotalLimitTime(dayjs().toISOString());
        toast.error('AI usage limit exceeded for this month.');
        return;
      }

      const notificationLimit = aiIntegrations.notificationThreshold;
      if (!notificationLimit) return;
      if (totalUsage >= notificationLimit && !isCheckedNotificationLimit) {
        toast.warning('AI usage limit approaching for this month.');
        setIsCheckedNotificationLimit(true);
        return;
      }
    }
  }, [aiUsageLimit, aiIntegrations]);
};

export default useCheckAIUsageLimit;
