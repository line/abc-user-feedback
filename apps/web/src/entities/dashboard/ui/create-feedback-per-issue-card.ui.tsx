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
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { DashboardCard, useOAIQuery } from '@/shared';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const CreateFeedbackPerIssueCard: React.FC<IProps> = (props) => {
  const { from, to, projectId } = props;

  const { t } = useTranslation();

  const { data } = useOAIQuery({
    path: '/api/admin/statistics/feedback/issued-ratio',
    variables: { from: from.toISOString(), to: to.toISOString(), projectId },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });
  return (
    <DashboardCard
      data={`${parseFloat(Math.abs((data?.ratio ?? 0) * 100).toFixed(1))}%`}
      title={t('dashboard-card.issue-ratio.title')}
      description={`${t('dashboard-card.issue-ratio.description', {
        targetDate: `${dayjs(from).format('YYYY/MM/DD')} - ${dayjs(to).format(
          'YYYY/MM/DD',
        )}`,
      })}`}
      type="issue"
    />
  );
};

export default CreateFeedbackPerIssueCard;
