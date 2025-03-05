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
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import type { O } from 'ts-toolbelt';

import { EMPTY_FUNCTION } from '../utils/empty-function';

interface IData {
  jwt: {
    accessToken: string;
    refreshToken: string;
  };
}

export type SessionStorageKeyType = keyof IData;
export type SessionStorageValueType<TPath extends SessionStorageKeyType> =
  O.Path<IData, [TPath]> | null;

class sessionStorage {
  private storage: Storage;

  private static instance: sessionStorage | null;
  public static get Instance(): sessionStorage {
    return this.instance ?? (this.instance = new this());
  }

  constructor() {
    if (typeof window === 'undefined') this.storage = severSessionStorage;
    else this.storage = window.sessionStorage;
  }

  async getItem<T extends SessionStorageKeyType>(
    key: T,
  ): Promise<SessionStorageValueType<T>> {
    const value = this.storage.getItem(key);
    const cookieValue = await getCookie(key);
    if (cookieValue) {
      this.storage.setItem(key, JSON.stringify(cookieValue));
      return this.parseJSON(cookieValue) as SessionStorageValueType<T>;
    }
    return this.parseJSON(value) as SessionStorageValueType<T>;
  }

  async setItem<T extends SessionStorageKeyType>(
    key: T,
    value: SessionStorageValueType<T>,
  ) {
    await setCookie(key, JSON.stringify(value));
    this.storage.setItem(key, JSON.stringify(value));
  }

  async removeItem<T extends SessionStorageKeyType>(key: T) {
    await deleteCookie(key);
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  parseJSON<T>(value: string | null): T | string | undefined | null {
    try {
      return value === 'undefined' ? undefined : (
          (JSON.parse(value ?? '') as T | string | undefined | null)
        );
    } catch {
      return value;
    }
  }
}

const severSessionStorage: Storage = {
  getItem: (_: string) => null,
  setItem: EMPTY_FUNCTION,
  removeItem: EMPTY_FUNCTION,
  clear: EMPTY_FUNCTION,
  key: (_: number) => null,
  length: 0,
};

export default sessionStorage.Instance;
