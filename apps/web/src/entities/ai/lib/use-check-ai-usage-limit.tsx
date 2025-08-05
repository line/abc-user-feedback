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
import { useTranslation } from 'next-i18next';
import { useLocalStorage } from 'react-use';

import { Icon, toast } from '@ufb/react';

import { useOAIQuery } from '@/shared';

const useCheckAIUsageLimit = (projectId: number) => {
  const { t } = useTranslation();
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
    if (!aiIntegrations?.apiKey) return;

    if (aiUsageLimit) {
      const totalUsage = aiUsageLimit.reduce(
        (acc, usage) => acc + usage.usedTokens,
        0,
      );
      const totalLimit = aiIntegrations.tokenThreshold;
      if (!totalLimit) return;
      if (totalUsage >= totalLimit) {
        if (
          !checkedTotalLimitTime ||
          dayjs(checkedTotalLimitTime).add(1, 'day').isBefore(dayjs())
        ) {
          setCheckedTotalLimitTime(dayjs().toISOString());
          const toastId = toast.error(
            t('v2.toast.ai-function-terminated.title'),
            {
              description: t('v2.toast.ai-function-terminated.description'),
              cancel: {
                label: <Icon name="RiCloseFill" size={20} />,
                onClick: () => {
                  toast.dismiss(toastId);
                },
              },
              duration: Infinity,
            },
          );
        }
        return;
      }

      const notificationLimit = aiIntegrations.notificationThreshold;
      if (!notificationLimit) return;
      if (totalUsage >= notificationLimit) {
        if (!isCheckedNotificationLimit) {
          const toastId = toast.warning(
            t('v2.toast.ai-usage-limit-approaching.title'),
            {
              description: t(
                'v2.toast.ai-usage-limit-approaching.description',
                {
                  percentage: Math.round(
                    (notificationLimit / totalLimit) * 100,
                  ),
                },
              ),
              cancel: {
                label: <Icon name="RiCloseFill" size={20} />,
                onClick: () => {
                  toast.dismiss(toastId);
                },
              },
              duration: Infinity,
            },
          );
          setIsCheckedNotificationLimit(true);
        }
        return;
      }
    }
  }, [aiUsageLimit, aiIntegrations]);
};

export default useCheckAIUsageLimit;
