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
  data: string | number;
  percentage?: number;
  description?: string;
}

const DashboardCard: React.FC<IProps> = (props) => {
  const { title, data, percentage, description } = props;

  return (
    <div className="border-fill-tertiary bg-tertiary flex h-[108px] w-[220px] flex-col gap-[10px] rounded border p-3">
      <p className="line-clamp-2 flex-1">
        {title}
        {description && (
          <DescriptionTooltip description={description} placement="bottom" />
        )}
      </p>
      <div className="flex items-center gap-2">
        <p className="font-24-bold">
          {typeof data === 'number' ? data.toLocaleString() : data}
        </p>
        {typeof percentage === 'undefined' ? (
          <></>
        ) : isNaN(percentage) || !isFinite(percentage) ? (
          <Icon name="StableLine" className="text-secondary" size={16} />
        ) : (
          <div className="flex items-center gap-0.5">
            {percentage === 0 ? (
              <Icon name="StableLine" className="text-secondary" size={16} />
            ) : percentage > 0 ? (
              <Icon name="TriangleUp" className="text-blue-primary" size={16} />
            ) : (
              <Icon
                name="TriangleDown"
                className="text-red-primary"
                size={16}
              />
            )}
            <p
              className={
                percentage === 0
                  ? 'text-secondary'
                  : percentage > 0
                  ? 'text-blue-primary'
                  : 'text-red-primary'
              }
            >
              {parseFloat(Math.abs(percentage).toFixed(1))}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
