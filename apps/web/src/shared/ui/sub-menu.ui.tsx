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
import clsx from 'clsx';

import { Icon } from '@ufb/ui';
import type { IconNameType } from '@ufb/ui';

interface Item {
  iconName: IconNameType;
  name: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
}
interface IProps extends React.HTMLAttributes<HTMLUListElement> {
  items: Item[];
}

const SubMenu: React.FC<IProps> = ({ items, ...props }) => {
  return (
    <ul {...props}>
      {items.map(({ active, iconName, name, disabled, onClick }, index) => (
        <li
          key={index}
          className={clsx(
            'mx-1 my-2 flex items-center gap-2 rounded px-2 py-1.5',
            {
              'bg-fill-tertiary': active,
              'text-tertiary cursor-not-allowed': disabled,
              'hover:bg-fill-secondary cursor-pointer': !disabled,
            },
          )}
          onClick={(e) => (!disabled && onClick ? onClick(e) : {})}
        >
          <Icon name={iconName} size={20} />
          <span className="font-12-regular">{name}</span>
        </li>
      ))}
    </ul>
  );
};

export default SubMenu;
