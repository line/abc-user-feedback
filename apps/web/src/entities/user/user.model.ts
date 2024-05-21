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

import axios from 'axios';
import dayjs from 'dayjs';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

import type { UserType } from './user.type';

import sessionStorage from '@/libs/session-storage';
import { create, createZustandFactory } from '@/libs/zustand';

type State = {
  user: UserType | null;
};

type Action = {
  signInByEmailAndPassword: (input: {
    email: string;
    password: string;
  }) => Promise<void>;
  signInByOAuth: (input: { code: string; callback_url?: string }) => void;
  signOut: () => void;
};

const initialState: State = { user: null };

const userStore = create<State, Action>(() => ({
  state: initialState,
  signInByEmailAndPassword: async ({ email, password }) => {
    const { data: jwt } = await axios.post('/api/login', { email, password });
    if (!jwt?.accessToken) return; // TODO: handle error
    const { sub, exp } = jwtDecode<JwtPayload>(jwt.accessToken);

    if (!sub || dayjs().isBefore(dayjs(exp))) return; // TODO: handle error

    sessionStorage.setItem('jwt', jwt);
  },
  signInByOAuth: () => {},
  signOut: () => {},
}));

export const [useUserState, useUserActions] = createZustandFactory(userStore);
