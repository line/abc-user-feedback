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

import router from 'next/router';
import axios from 'axios';
import dayjs from 'dayjs';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import { client, Path, sessionStorage } from '@/shared';
import type { Jwt } from '@/shared/types';

import type { User } from './user.type';

interface State {
  user: User | null;
}

interface Action {
  signInWithEmail: (input: {
    email: string;
    password: string;
  }) => Promise<void>;
  signInWithOAuth: (input: {
    code: string;
    callback_url?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: () => void;
  _signIn: (jwt: Jwt) => void;
}

export const useUserStore = create<State & Action>((set, get) => ({
  user: null,
  signInWithEmail: async ({ email, password }) => {
    const { data: jwt } = await axios.post<Jwt>('/api/login', {
      email,
      password,
    });
    get()._signIn(jwt);
  },
  signInWithOAuth: async ({ code, callback_url }) => {
    const { data: jwt } = await axios.post<Jwt>('/api/oauth', {
      code,
      callback_url,
    });
    get()._signIn(jwt);
  },
  signOut: async () => {
    await axios.get('/api/logout');
    sessionStorage.removeItem('jwt');
    await router.push(Path.SIGN_IN);
  },
  setUser: async () => {
    const jwt = sessionStorage.getItem('jwt');
    if (!jwt) return;

    const { sub, exp } = jwtDecode<JwtPayload>(jwt.accessToken);
    if (!sub || dayjs().isBefore(dayjs(exp))) {
      await get().signOut();
    } else {
      const { data } = await client.get({
        path: '/api/admin/users/{id}',
        pathParams: { id: parseInt(sub) },
        options: { headers: { Authorization: `Bearer ${jwt.accessToken}` } },
      });
      set({ user: data });
    }
  },

  async _signIn(jwt) {
    sessionStorage.setItem('jwt', jwt);
    get().setUser();
    if (router.query.callback_url) {
      await router.push(router.query.callback_url as string);
    } else {
      await router.push({ pathname: Path.MAIN });
    }
  },
}));
