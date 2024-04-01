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
import type { MouseEventHandler } from 'react';
import { useMemo } from 'react';

import type { IconNameType } from '../Icon';
import { Icon } from '../Icon';
import type { ColorType } from '../types/color.type';

interface IProps extends React.PropsWithChildren {
  left?: {
    iconName: IconNameType;
    onClick?: MouseEventHandler<HTMLOrSVGElement>;
  };
  right?: {
    iconName: IconNameType;
    onClick?: MouseEventHandler<HTMLOrSVGElement>;
    disabled?: boolean;
  };
  color?: ColorType | 'black';
  type?: 'primary' | 'secondary' | 'tertiary';
  size?: 'md' | 'sm';
}

const bgColorPrimary = {
  black: 'bg-fill-primary',
  red: 'bg-red-primary',
  orange: 'bg-orange-primary',
  yellow: 'bg-yellow-primary',
  green: 'bg-green-primary',
  blue: 'bg-blue-primary',
  navy: 'bg-navy-primary',
  purple: 'bg-purple-primary',
};

const bgColor = {
  black: 'bg-fill-quaternary',
  red: 'bg-red-quaternary',
  orange: 'bg-orange-quaternary',
  yellow: 'bg-yellow-quaternary',
  green: 'bg-green-quaternary',
  blue: 'bg-blue-quaternary',
  navy: 'bg-navy-quaternary',
  purple: 'bg-purple-quaternary',
};

const textColor = {
  black: 'text-primary',
  red: 'text-red-primary',
  orange: 'text-orange-primary',
  yellow: 'text-yellow-primary',
  green: 'text-green-primary',
  blue: 'text-blue-primary',
  navy: 'text-navy-primary',
  purple: 'text-purple-primary',
};

const disabledTextColor = {
  black: 'text-tertiary',
  red: 'text-red-tertiary',
  orange: 'text-orange-tertiary',
  yellow: 'text-yellow-tertiary',
  green: 'text-green-tertiary',
  blue: 'text-blue-tertiary',
  navy: 'text-navy-tertiary',
  purple: 'text-purple-tertiary',
};

export const Badge: React.FC<IProps> = (props) => {
  const {
    children,
    left,
    right,
    color = 'black',
    type = 'primary',
    size = 'md',
  } = props;

  const { textColorCN, rightIconColorCN } = useMemo(() => {
    switch (type) {
      case 'primary':
        return {
          textColorCN: 'text-above-primary',
          rightIconColorCN:
            !right?.disabled ? 'text-above-primary' : 'text-above-tertiary',
        };
      case 'secondary':
        return {
          textColorCN: textColor[color],
          rightIconColorCN:
            !right?.disabled ? textColor[color] : disabledTextColor[color],
        };
      case 'tertiary':
        return {
          textColorCN: 'text-primary',
          rightIconColorCN: !right?.disabled ? 'text-primary' : 'text-tertiary',
        };
      default:
        return { textColorCN: '', rightIconColorCN: '' };
    }
  }, [type, color, right]);

  const bgCN = useMemo(() => {
    switch (type) {
      case 'primary':
        return bgColorPrimary[color];
      case 'secondary':
      case 'tertiary':
        return bgColor[color];
      default:
        return '';
    }
  }, [type, color]);

  const { fontSize, iconSize, padding } = useMemo(() => {
    switch (size) {
      case 'md':
        return { fontSize: 'font-12-bold', iconSize: 12, padding: 'py-1 px-3' };
      case 'sm':
        return {
          fontSize: 'font-10-bold',
          iconSize: 10,
          padding: 'py-0.5 px-1.5',
        };
      default:
        return { fontSize: 'font-12-bold', iconSize: 12, padding: 'py-1 px-3' };
    }
  }, [size]);

  return (
    <div
      className={[
        'inline-flex items-center gap-1 rounded-full',
        bgCN,
        fontSize,
        padding,
      ].join(' ')}
    >
      {left && (
        <Icon
          name={left.iconName}
          size={iconSize}
          onClick={left.onClick}
          className={left.onClick ? 'cursor-pointer' : ''}
        />
      )}
      <span className={['whitespace-nowrap', textColorCN].join(' ')}>
        {children}
      </span>
      {right && (
        <Icon
          name={right.iconName}
          size={iconSize}
          onClick={!right.disabled ? right.onClick : undefined}
          className={[
            rightIconColorCN,
            !right.disabled && right.onClick ? 'cursor-pointer' : '',
            right.disabled ? 'cursor-not-allowed' : '',
          ].join(' ')}
        />
      )}
    </div>
  );
};
