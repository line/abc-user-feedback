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

import { useTheme } from 'next-themes';

import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownTrigger,
  Icon,
} from '@ufb/react';

import { firstLeterPascal } from '../utils';

const ThemeSelectBox: React.FC = () => {
  const { themes, setTheme, theme: currentTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger variant="ghost">
        <Icon name="RiSunLine" />
      </DropdownTrigger>
      <DropdownContent align="end" className="w-[120px]">
        {themes.map((theme) => (
          <DropdownCheckboxItem
            key={theme}
            onClick={() => setTheme(theme)}
            checked={theme === currentTheme}
          >
            {firstLeterPascal(theme)}
          </DropdownCheckboxItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
};

export default ThemeSelectBox;
