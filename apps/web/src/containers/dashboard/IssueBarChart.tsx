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
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { SimpleBarChart } from '@/components/charts';
import { ISSUES } from '@/constants/issues';
import { Path } from '@/constants/path';
import { useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const IssueBarChart: React.FC<IProps> = ({ from, projectId, to }) => {
  const router = useRouter();

  const { t } = useTranslation();
  const { data } = useOAIQuery({
    path: '/api/statistics/issue/count-by-status',
    variables: {
      from: dayjs(from).startOf('day').toISOString(),
      to: dayjs(to).endOf('day').toISOString(),
      projectId,
    },
    queryOptions: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
    },
  });

  return (
    <SimpleBarChart
      data={ISSUES(t).map(({ key, name }) => ({
        name,
        value: data?.statistics.find((v) => v.status === key)?.count ?? 0,
      }))}
      title="전체 이슈 현황"
      description="이슈 상태에 따른 전체 이슈 현황을 나타냅니다."
      height={400}
      onClick={(data) => {
        if (!data) return;
        const issue = ISSUES(t).find((v) => v.name === data.name);
        router.push({
          pathname: Path.ISSUE,
          query: { projectId, status: issue?.key },
        });
      }}
    />
  );
};

export default IssueBarChart;
