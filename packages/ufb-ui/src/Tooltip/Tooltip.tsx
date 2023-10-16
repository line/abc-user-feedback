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
import { useState } from 'react';

import { Icon, Popover, PopoverContent, PopoverTrigger } from '..';

export interface ITooltipProps {
  title: string;
  iconSize?: number;
}

export const Tooltip: React.FC<ITooltipProps> = ({ title, iconSize = 14 }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Icon
          name="InfoCircleFill"
          size={iconSize}
          className="text-tertiary cursor-pointer"
          onMouseOver={() => setOpen(true)}
          onMouseOut={() => setOpen(false)}
        />
      </PopoverTrigger>
      <PopoverContent>
        <p className="bg-secondary whitespace-pre-line rounded p-2">{title}</p>
      </PopoverContent>
    </Popover>
  );
};
