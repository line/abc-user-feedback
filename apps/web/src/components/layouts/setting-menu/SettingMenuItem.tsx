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
import { Icon, IconNameType } from '@ufb/ui';

interface IItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  iconName: IconNameType;
  name: string;
  active?: boolean;
  disabled?: boolean;
}

const SettingMenuItem: React.FC<IItemProps> = ({
  name,
  iconName,
  active,
  disabled,
  ...props
}) => {
  return (
    <li
      className={[
        'flex gap-2 items-center px-2 py-1.5 mx-1 my-2 rounded',
        active ? 'bg-fill-tertiary' : '',
        disabled
          ? 'text-tertiary cursor-not-allowed'
          : 'cursor-pointer hover:bg-fill-secondary',
      ].join(' ')}
      {...props}
      onClick={(e) => (!disabled && props.onClick ? props.onClick(e) : {})}
    >
      <Icon name={iconName} size={20} />
      {name}
    </li>
  );
};
export default SettingMenuItem;
