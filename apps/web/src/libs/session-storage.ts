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
import { O } from 'ts-toolbelt';

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

  private static instance: sessionStorage;
  public static get Instance(): sessionStorage {
    return this.instance || (this.instance = new this());
  }

  constructor() {
    if (typeof window === 'undefined') this.storage = severSessionStorage;
    else this.storage = window.sessionStorage;
  }

  getItem<T extends SessionStorageKeyType>(key: T): SessionStorageValueType<T> {
    const value = this.storage.getItem(key);
    return this.parseJSON(value) as SessionStorageValueType<T>;
  }

  setItem<T extends SessionStorageKeyType>(
    key: T,
    value: SessionStorageValueType<T>,
  ) {
    this.storage.setItem(key, JSON.stringify(value) as any);
  }

  removeItem<T extends SessionStorageKeyType>(key: T) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  parseJSON<T>(value: string | null): T | string | undefined | null {
    try {
      return value === 'undefined' ? undefined : JSON.parse(value ?? '');
    } catch {
      return value;
    }
  }
}

const severSessionStorage: Storage = {
  getItem: (_: string) => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: (_: number) => null,
  length: 0,
};

export default sessionStorage.Instance;
