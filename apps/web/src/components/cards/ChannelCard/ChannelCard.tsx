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
import { useMemo } from 'react';

import type { IconNameType } from '@ufb/ui';
import { Icon } from '@ufb/ui';

import type { ColorType } from '@/types/color.type';

interface IProps extends React.PropsWithChildren {
  isChecked?: boolean;
  value?: React.ReactNode;
  rightChildren?: React.ReactNode;
  color: ColorType;
  iconName: IconNameType;
  name: string;
}

const ChannelCard: React.FC<IProps> = (props) => {
  const { isChecked, value, rightChildren, color, iconName, name } = props;

  const { bg, icon } = useMemo(() => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-quaternary', icon: 'text-blue-primary' };
      case 'green':
        return { bg: 'bg-green-quaternary', icon: 'text-green-primary' };
      default:
        return { bg: '', icon: '' };
    }
  }, [color]);

  return (
    <div
      className={[
        'flex w-[360px] items-center gap-4 rounded border p-2',
        !isChecked ? 'opacity-50' : '',
      ].join(' ')}
    >
      <div
        className={bg + ' flex h-14 w-14 items-center justify-center rounded'}
      >
        <Icon name={iconName} className={icon} size={24} />
      </div>
      <div className="flex-1">
        <p className="font-14-regular text-secondary">{name}</p>
        <p className="font-20-bold text-primary">{value}</p>
      </div>
      {rightChildren}
    </div>
  );
};

export default ChannelCard;
