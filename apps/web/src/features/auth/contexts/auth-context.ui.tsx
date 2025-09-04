/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';

import type { Jwt } from '@/shared';
import { Path } from '@/shared';
import client from '@/shared/lib/client';
import type { User } from '@/entities/user';

import { jwtStorage } from '../services';

type AuthContextType = {
  user: User | null; // 필요 시 타입 정의
  signInWithEmail: (input: {
    email: string;
    password: string;
  }) => Promise<void>;
  signInWithOAuth: (input: { code: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const randomId = useRef(Math.random());
  const router = useRouter();

  const signInWithEmail = async (input: {
    email: string;
    password: string;
  }) => {
    const { data: jwt } = await client.post({
      path: '/api/admin/auth/signIn/email',
      body: input,
    });
    if (!jwt) return;
    await signIn(jwt);
  };

  const signInWithOAuth = async ({ code }: { code: string }) => {
    const { data: jwt } = await client.get({
      path: '/api/admin/auth/signIn/oauth',
      query: { code },
    });
    await signIn(jwt);
  };

  const loadUser = async () => {
    const jwt = await jwtStorage.get();
    if (!jwt) return;

    const { sub, exp } = jwtDecode<JwtPayload>(jwt.accessToken);
    if (!sub || dayjs().isBefore(dayjs(exp))) return await signOut();
    const { data } = await client.get({
      path: '/api/admin/users/{id}',
      pathParams: { id: parseInt(sub) },
      options: { headers: { Authorization: `Bearer ${jwt.accessToken}` } },
    });
    setUser(data);
  };

  const signOut = async () => {
    await jwtStorage.remove();
    await router.push(Path.SIGN_IN);
  };

  const signIn = async (jwt: Jwt) => {
    try {
      await jwtStorage.set(jwt);
      const broadcastChannel = new BroadcastChannel('ufb');
      broadcastChannel.postMessage({
        type: 'reload',
        payload: randomId.current,
      });
      await loadUser();
      if (router.query.callback_url) {
        await router.push(router.query.callback_url as string);
        return;
      }
      await router.push({ pathname: Path.MAIN });
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    if (user) return;
    void loadUser();
  }, [user]);

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel('ufb');
    broadcastChannel.addEventListener(
      'message',
      (event: MessageEvent<{ type: string; payload: number }>) => {
        if (
          event.data.type === 'reload' &&
          event.data.payload !== randomId.current
        ) {
          router.reload();
        }
      },
    );
    return () => {
      broadcastChannel.close();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        signInWithEmail,
        signInWithOAuth,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
