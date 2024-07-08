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
import type { IconNameType } from '@ufb/ui';

import { cn, displayString } from '../utils';

interface IProps {
  onClick?: () => void;
  icon: { iconName: IconNameType; bgColor: '#5D7BE7' | '#48DECC' };
  title: string;
  description?: string | null;
  leftContent: { title: string; count?: number };
  rightContent: { title: string; count?: number };
}
const MainCard: React.FC<IProps> = (props) => {
  const { onClick, icon, title, description, leftContent, rightContent } =
    props;

  return (
    <div
      className={cn('card h-[204px] w-[452px] rounded border p-8', {
        'hover:cursor-pointer hover:opacity-50': !!onClick,
      })}
      onClick={onClick}
    >
      <div className="mb-10 flex gap-5">
        <div
          className="flex h-10 w-10 items-center justify-center rounded"
          style={{ backgroundColor: icon.bgColor }}
        >
          <Icon name={icon.iconName} className="text-inverse" size={20} />
        </div>
        <div className="flex-1">
          <p className="font-16-bold mb-1">{title}</p>
          <p className="font-12-regular text-secondary line-clamp-1 break-all">
            {displayString(description)}
          </p>
        </div>
      </div>
      <div className="flex gap-16">
        <div>
          <p className="font-12-regular mb-1">{leftContent.title}</p>
          <p className="font-24-bold">{leftContent.count?.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-12-regular mb-1">{rightContent.title}</p>
          <p className="font-24-bold">{rightContent.count?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
