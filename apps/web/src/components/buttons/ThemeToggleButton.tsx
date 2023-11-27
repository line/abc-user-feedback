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
import { useEffect } from 'react';

import { Icon } from '@ufb/ui';

import useThemeStore from '@/zustand/theme.store';

interface IProps {}

const ThemeToggleButton: React.FC<IProps> = () => {
  const { theme, toggle } = useThemeStore();

  useEffect(() => {
    if (!theme) return;
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <button
      className="icon-btn icon-btn-sm icon-btn-secondary"
      onClick={() => toggle()}
    >
      <Icon
        name={theme === 'light' ? 'MoonStroke' : 'SunStroke'}
        className="text-primary"
      />
    </button>
  );
};

export default ThemeToggleButton;
