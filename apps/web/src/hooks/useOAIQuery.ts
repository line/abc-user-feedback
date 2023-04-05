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
import type {
  OAIMethodPathKeys,
  OAIParameters,
  OAIResponse,
} from '@/types/openapi.type';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { O } from 'ts-toolbelt';

import client from '@/libs/client';
import { IFetchError } from '@/types/fetch-error.type';
import { getRequestUrl } from '@/utils/path-parsing';

export default function useOAIQuery<
  TPath extends OAIMethodPathKeys<'get'>,
  TVariables extends OAIParameters<TPath, 'get'>,
  TData extends OAIResponse<TPath, 'get'>,
>({
  path,
  queryOptions,
  variables,
}: {
  path: TPath;
  queryOptions?: Omit<
    UseQueryOptions<
      TData,
      IFetchError,
      TData,
      (Record<string, unknown> | TPath | undefined)[]
    >,
    'queryKey' | 'queryFn'
  >;
} & (TVariables extends undefined
  ? { variables?: undefined }
  : O.RequiredKeys<NonNullable<TVariables>> extends never
  ? { variables?: TVariables }
  : { variables: TVariables })) {
  return useQuery<
    TData,
    IFetchError,
    TData,
    (TPath | Record<string, unknown> | undefined)[]
  >(
    [path, variables],
    async ({ signal }) => {
      const { data } = await client.request({
        method: 'get',
        url: getRequestUrl(path, variables),
        signal,
      });
      return data as TData;
    },
    queryOptions,
  );
}
