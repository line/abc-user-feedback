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
import { Icon } from '@ufb/ui';

import DescriptionTooltip from '../DescriptionTooltip';

interface IProps {
  title: string;
  count: number;
  percentage: number;
}

const DashboardCard: React.FC<IProps> = ({ title, count, percentage }) => {
  return (
    <div className="border-fill-tertiary flex flex-col gap-2 rounded border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p>{title}</p>
          <DescriptionTooltip description="피드백 누적 수" />
        </div>
        <button className="icon-btn icon-btn-tertiary">
          <Icon name="Dots" className="text-tertiary rotate-90" />
        </button>
      </div>
      <div className="flex gap-1 p-2">
        <p className="font-24-bold">{Number(count).toLocaleString()}</p>
        <p
          className={[
            percentage > 0 ? 'text-blue-primary' : 'text-red-primary',
            'flex items-center',
          ].join(' ')}
        >
          <Icon
            name={percentage > 0 ? 'TriangleUp' : 'TriangleDown'}
            className={
              percentage > 0 ? 'text-blue-primary' : 'text-red-primary'
            }
          />
          ({percentage}%)
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
