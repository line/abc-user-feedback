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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface State {
  theme: Theme;
  systemTheme: Theme;
}

interface Action {
  setTheme: (theme: Theme) => void;
  setSystemTheme: (theme: Theme) => void;
}

export const useThemeStore = create<State & Action>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemTheme: 'light', // 초기값을 시스템 테마로 설정

      setTheme: (theme) => {
        set({ theme });

        if (typeof window === 'undefined') return;

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = get().systemTheme;
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },
      setSystemTheme: (theme) => {
        set({ systemTheme: theme });
        if (get().theme === 'system') {
          get().setTheme('system');
        }
      },
    }),
    { name: 'theme' },
  ),
);
