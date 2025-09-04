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
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import type { O } from 'ts-toolbelt';

interface IData {
  jwt: { accessToken: string; refreshToken: string };
}

export type CookieStorageKeyType = keyof IData;
export type CookieStorageValueType<TPath extends CookieStorageKeyType> = O.Path<
  IData,
  [TPath]
> | null;

class cookieStorage {
  private static instance: cookieStorage | null;
  public static get Instance(): cookieStorage {
    return this.instance ?? (this.instance = new this());
  }
  async getItem<T extends CookieStorageKeyType>(
    key: T,
  ): Promise<CookieStorageValueType<T>> {
    const cookieValue = await getCookie(key);
    return cookieValue ?
        (this.parseJSON(cookieValue) as CookieStorageValueType<T>)
      : null;
  }

  async setItem<T extends CookieStorageKeyType>(
    key: T,
    value: CookieStorageValueType<T>,
  ) {
    await setCookie(key, JSON.stringify(value));
  }

  async removeItem<T extends CookieStorageKeyType>(key: T) {
    await deleteCookie(key);
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

export default cookieStorage.Instance;
