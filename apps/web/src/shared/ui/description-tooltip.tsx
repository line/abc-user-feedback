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

import type { Placement } from '@floating-ui/react';

import { Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ufb/ui';

export interface ITooltipProps {
  description: string;
  placement?: Placement;
  color?: 'red';
}

const DescriptionTooltip: React.FC<ITooltipProps> = ({
  description,
  placement,
  color,
}) => {
  return (
    <Tooltip placement={placement ?? 'bottom'}>
      <TooltipTrigger className="ml-1 align-middle">
        <Icon
          name="InfoCircleFill"
          size={16}
          className={color === 'red' ? 'text-red-primary' : 'text-tertiary'}
        />
      </TooltipTrigger>
      <TooltipContent className="whitespace-pre-line">
        {description}
      </TooltipContent>
    </Tooltip>
  );
};

export default DescriptionTooltip;
