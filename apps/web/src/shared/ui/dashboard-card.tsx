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
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';

import type { IconNameType } from '@ufb/react';
import { Icon } from '@ufb/react';

import { cn, DescriptionTooltip } from '@/shared';

interface IProps {
  title: string;
  data: string | number;
  percentage?: number;
  description: string;
  type: 'feedback' | 'issue';
}
const TYPE_MAP: Record<
  'feedback' | 'issue',
  { icon: IconNameType; color: string }
> = {
  feedback: { icon: 'RiMessage2Line', color: 'bg-sky-500' },
  issue: { icon: 'RiMegaphoneLine', color: 'bg-teal-400' },
};

const DashboardCard: React.FC<IProps> = (props) => {
  const { title, data, percentage, description, type } = props;

  const count = Number(data);

  return (
    <div className="shadow-default rounded-20 border-neutral-tertiary bg-neutral-primary flex h-[128px] w-[296px] flex-col border p-5">
      <div className="flex flex-1 flex-col gap-1.5">
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full',
            TYPE_MAP[type].color,
          )}
        >
          <Icon
            name={TYPE_MAP[type].icon}
            size={12}
            className="text-neutral-inverse"
          />
        </div>
        <h3>
          {title}
          <DescriptionTooltip description={description} side="bottom" />
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <NumberFlowGroup>
          <NumberFlow
            value={isNaN(count) ? 0 : count}
            format={{ style: 'decimal' }}
            className="text-title-h4"
          />
          {typeof percentage !== 'undefined' && isFinite(percentage) ?
            <NumberFlow
              value={percentage / 100}
              format={{
                style: 'percent',
                maximumFractionDigits: 1,
                signDisplay: 'always',
              }}
              className={cn(
                percentage === 0 && 'text-neutral-tertiary',
                percentage > 0 && 'text-tint-green',
                percentage < 0 && 'text-tint-red',
                'text-small-strong',
              )}
            />
          : <Icon
              name="RiSubtractFill"
              className="text-neutral-tertiary"
              size={12}
            />
          }
        </NumberFlowGroup>
      </div>
    </div>
  );
};

export default DashboardCard;
