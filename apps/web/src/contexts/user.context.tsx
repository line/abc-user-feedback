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
import axios, { AxiosError } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useSessionStorage } from 'react-use';

import isServer from '@/constants/is-server';
import client from '@/libs/client';
import { IFetchError } from '@/types/fetch-error.type';
import { PermissionType } from '@/types/permission.type';

export type UserType = {
  id: string;
  email: string;
  permissions: PermissionType[];
  roleName: string;
};
type JwtType = {
  accessToken: string;
  refreshToken: string;
};

type UserStatusType = 'loading' | 'loggedIn' | 'notLoggedIn';

interface ISignInInput {
  email: string;
  password: string;
}

interface ISignUpInput {
  email: string;
  password: string;
}

export interface IUserContext {
  user: UserType | null;
  signIn: (input: ISignInInput) => Promise<void>;
  signUp: (input: ISignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  userStatus: UserStatusType;
  jwt: JwtType | null;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  userStatus: 'loading',
  jwt: null,
});

export const UserProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [jwt, setJwt] = useSessionStorage<JwtType | null>('jwt', null);
  const [userStatus, setUserStatus] = useState<UserStatusType>('loading');

  useEffect(() => {
    (async () => {
      if (isServer) return;
      const { data } = await axios.get('/api/jwt');

      if (!data?.jwt) return;
      setJwt(data.jwt);

      await handleLogin(data.jwt.accessToken);
    })();
  }, []);

  const handleLogin = useCallback(async (accessToken: string) => {
    const { sub } = jwtDecode<JwtPayload>(accessToken);
    if (!sub) return;

    const { data } = await client.get({
      path: '/api/users/{id}',
      pathParams: { id: sub },
      options: { headers: { Authorization: `Bearer ${accessToken}` } }, // session storage delay
    });

    setUser(data);
    setUserStatus('loggedIn');
  }, []);

  const signIn = useCallback(async (body: ISignInInput) => {
    try {
      const { data } = await axios.post('/api/login', body);
      setJwt(data);
      await handleLogin(data.accessToken);
    } catch (error) {
      throw (error as AxiosError).response?.data as IFetchError;
    }
  }, []);

  const signUp = useCallback(async ({ email, password }: ISignUpInput) => {
    await client.post({
      path: '/api/auth/signUp/email',
      body: { email, password },
    });
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setJwt(null);
    setUserStatus('notLoggedIn');
    await axios.get('/api/logout');
  }, []);

  return (
    <UserContext.Provider
      value={{ user, signIn, signUp, signOut, userStatus, jwt }}
    >
      {children}
    </UserContext.Provider>
  );
};
