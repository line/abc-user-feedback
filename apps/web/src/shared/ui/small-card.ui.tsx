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

import type { ColorType, IconNameType } from '@ufb/ui';
import { Icon } from '@ufb/ui';

import { cn } from '../utils';

const COLORS: Record<ColorType, { bgColor: string; iconColor: string }> = {
  blue: {
    bgColor: 'bg-blue-quaternary',
    iconColor: 'text-blue-primary',
  },
  green: {
    bgColor: 'bg-green-quaternary',
    iconColor: 'text-green-primary',
  },
  navy: {
    bgColor: 'bg-navy-quaternary',
    iconColor: 'text-navy-primary',
  },
  red: {
    bgColor: 'bg-red-quaternary',
    iconColor: 'text-red-primary',
  },
  yellow: {
    bgColor: 'bg-yellow-quaternary',
    iconColor: 'text-yellow-primary',
  },
  purple: {
    bgColor: 'bg-purple-quaternary',
    iconColor: 'text-purple-primary',
  },
  orange: {
    bgColor: 'bg-orange-quaternary',
    iconColor: 'text-orange-primary',
  },
};

interface IProps {
  value?: React.ReactNode;
  color: ColorType;
  iconName: IconNameType;
  name: string;
}

const SmallCard: React.FC<IProps> = (props) => {
  const { value, color, iconName, name } = props;

  return (
    <div className="flex w-[360px] items-center gap-4 rounded border p-2">
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded',
          COLORS[color].bgColor,
        )}
      >
        <Icon name={iconName} className={COLORS[color].iconColor} size={24} />
      </div>
      <div className="flex-1">
        <p className="font-14-regular text-secondary">{name}</p>
        <p className="font-20-bold text-primary">{value}</p>
      </div>
    </div>
  );
};

export default SmallCard;
