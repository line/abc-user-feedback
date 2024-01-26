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
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { ISSUES } from '@/constants/issues';
import client from '@/libs/client';
import type { DateRangeType } from '@/types/date-range.type';

const useIssueCountByStatusAndCreatedAtRange = (
  createdAtRange: DateRangeType,
  projectId: number,
) => {
  const { t } = useTranslation();
  return useQuery({
    queryKey: ['all_issues', createdAtRange, projectId],
    queryFn: async () => {
      const result: { count: number; key: string }[] = [];
      const issues = ISSUES(t);
      for (const issue of issues) {
        const { data } = await client.post({
          path: '/api/admin/projects/{projectId}/issues/search',
          pathParams: { projectId },
          body: {
            limit: 1,
            page: 1,
            query: {
              status: issue.key,
              createdAt: createdAtRange
                ? {
                    gte: dayjs(createdAtRange?.startDate)
                      .startOf('day')
                      .toISOString(),
                    lt: dayjs(createdAtRange?.endDate)
                      .endOf('day')
                      .toISOString(),
                  }
                : undefined,
            } as any,
          },
        });
        result.push({ ...issue, count: data?.meta.totalItems ?? 0 });
      }
      const total = result?.reduce((prev, curr) => prev + curr.count, 0);
      return [{ key: 'total', count: total }].concat(result);
    },
  });
};
export default useIssueCountByStatusAndCreatedAtRange;
