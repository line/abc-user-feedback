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

import { DashboardCard } from '@/components';

interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}

const TotalIssueCard: React.FC<IProps> = ({ from, to }) => {
  return (
    <DashboardCard
      count={0}
      title="전체 이슈 수"
      description={`특정 기간 동안 생성된 이슈 개수입니다. (${dayjs(
        from,
      ).format('YYYY/MM/DD')} - ${dayjs(to).format('YYYY/MM/DD')})`}
    />
  );
};

export default TotalIssueCard;
