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
import dayjs from 'dayjs';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import { client, cookieStorage, Path } from '@/shared';
import type { Jwt } from '@/shared/types';

import type { User } from './user.type';

interface State {
  user: User | null;
  randomId: number;
}

interface Action {
  signInWithEmail: (input: {
    email: string;
    password: string;
  }) => Promise<void>;
  signInWithOAuth: (input: { code: string }) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: () => void;
  _signIn: (jwt: Jwt) => void;
}

export const useUserStore = create<State & Action>((set, get) => ({
  user: null,
  randomId: Math.random(),
  signInWithEmail: async ({ email, password }) => {
    const { data: jwt } = await client.post({
      path: '/api/admin/auth/signIn/email',
      body: { email, password },
    });
    if (!jwt) return;

    get()._signIn(jwt);
  },
  signInWithOAuth: async ({ code }) => {
    const { data: jwt } = await client.get({
      path: '/api/admin/auth/signIn/oauth',
      query: { code },
    });
    get()._signIn(jwt);
  },
  signOut: async () => {
    await cookieStorage.removeItem('jwt');
    await router.push(Path.SIGN_IN);
  },
  setUser: async () => {
    const jwt = await cookieStorage.getItem('jwt');
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
    try {
      await cookieStorage.setItem('jwt', jwt);
      const broadcastChannel = new BroadcastChannel('ufb');
      broadcastChannel.postMessage({ type: 'reload', payload: get().randomId });
      get().setUser();
      if (router.query.callback_url) {
        await router.push(router.query.callback_url as string);
      } else {
        await router.push({ pathname: Path.MAIN });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  },
}));
