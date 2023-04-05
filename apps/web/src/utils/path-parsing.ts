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
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRequestUrl = (
  path: string,
  variables?: Record<string, unknown>,
) => {
  let url = `${BASE_URL}${path}`;

  variables = Object.fromEntries(
    Object.entries(variables ?? {}).filter(([_, v]) => v != null),
  );

  const paramKeys = (path.match(/{[a-zA-z-]+}/g) ?? []).map((param) =>
    param.replace(/[{}]/g, ''),
  );
  paramKeys.forEach((param) => {
    url = url.replace(`{${param}}`, variables?.[param] as string);
  });

  const qs = new URLSearchParams(
    Object.entries(variables ?? {}).reduce(
      (current, [key, value]) =>
        paramKeys.includes(key) ? current : { ...current, [key]: value },
      {},
    ),
  ).toString();
  return qs ? `${url}?${qs}` : url;
};

export const parseSearchParams = (
  asPath: string,
  type: 'page' | 'limit' | 'filterValues',
) => {
  const qs = new URLSearchParams(asPath.split('?')[1]);
  if (type === 'page' || type === 'limit') {
    return qs.get(type);
  } else {
    const result: Record<string, string> = {};
    qs.forEach((v, k) => {
      if (k === 'page' || k === 'limit') return;
      result[k] = v;
    });
    return result;
  }
};
