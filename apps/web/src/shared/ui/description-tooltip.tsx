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

import { Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ufb/react';

import { cn, displayString } from '../utils';

export interface ITooltipProps {
  description: string;
  color?: 'red';
  side?: 'bottom' | 'top' | 'right' | 'left';
}

const DescriptionTooltip: React.FC<ITooltipProps> = ({
  description,
  color,
  side,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon
          name="RiInformation2Line"
          size={12}
          className={cn(
            color === 'red' ? 'text-tint-red' : 'text-neutral-tertiary',
            'ml-1',
          )}
        />
      </TooltipTrigger>
      <TooltipContent className="whitespace-pre-line text-left" side={side}>
        {displayString(description)}
      </TooltipContent>
    </Tooltip>
  );
};

export default DescriptionTooltip;
