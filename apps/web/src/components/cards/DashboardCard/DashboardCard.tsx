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

import { DescriptionTooltip } from '@/components/etc';

interface IProps {
  title: string;
  count: number;
  percentage?: number;
  description?: string;
}

const DashboardCard: React.FC<IProps> = (props) => {
  const { title, count, percentage, description } = props;
  return (
    <div className="border-fill-tertiary flex min-w-[220px] flex-col gap-2 rounded border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <p>{title}</p>
          {description && <DescriptionTooltip description={description} />}
        </div>
        <button className="icon-btn icon-btn-tertiary">
          <Icon name="Dots" className="text-tertiary rotate-90" />
        </button>
      </div>
      <div className="flex gap-2 p-2">
        <p className="font-24-bold">{Number(count).toLocaleString()}</p>
        {typeof percentage !== 'undefined' && (
          <div className="flex items-center">
            {percentage !== 0 && (
              <Icon
                name={percentage > 0 ? 'TriangleUp' : 'TriangleDown'}
                className={
                  percentage > 0 ? 'text-blue-primary' : 'text-red-primary'
                }
              />
            )}
            <p
              className={
                percentage === 0
                  ? 'text-primary'
                  : percentage > 0
                  ? 'text-blue-primary'
                  : 'text-red-primary'
              }
            >
              ({parseFloat(Math.abs(percentage).toFixed(1))}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
