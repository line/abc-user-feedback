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
import { persist } from 'zustand/middleware';

import { create, createZustandFactory } from '@/libs/zustand';

type State = { theme: 'light' | 'dark' };

type Action = { toggle: () => void };

const initialState: State = { theme: 'light' };

const themeStore = create<State, Action>()(
  persist(
    (set) => ({
      state: initialState,
      toggle: () =>
        set(({ state }) => ({
          state: { theme: state.theme === 'light' ? 'dark' : 'light' },
        })),
    }),
    { name: 'theme' },
  ),
);

export const [useThemeState, useThemeActions] =
  createZustandFactory(themeStore);