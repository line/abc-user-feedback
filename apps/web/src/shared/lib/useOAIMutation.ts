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
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { toast } from '@ufb/react';

import type {
  IFetchError,
  OAIMethodPathKeys,
  OAIMutationResponse,
  OAIPathParameters,
  OAIRequestBody,
} from '@/shared';
import { client, getRequestUrl } from '@/shared';

export default function useOAIMutation<
  TMethods extends 'post' | 'put' | 'patch' | 'delete',
  TPath extends OAIMethodPathKeys<TMethods>,
  TPathParams extends OAIPathParameters<TPath, TMethods>,
  TBody extends OAIRequestBody<TPath, TMethods>,
  TResponse extends OAIMutationResponse<TPath, TMethods>,
>({
  method,
  path,
  pathParams,
  queryOptions,
}: {
  method: TMethods;
  path: TPath;
  queryOptions?: Omit<
    UseMutationOptions<
      TResponse,
      IFetchError,
      TBody,
      (Record<string, unknown> | TPath | undefined)[]
    >,
    'mutationKey' | 'mutationFn'
  >;
} & (TPathParams extends undefined ? { pathParams?: undefined }
: { pathParams: TPathParams })) {
  return useMutation<
    TResponse,
    IFetchError,
    TBody,
    (Record<string, unknown> | TPath | undefined)[]
  >({
    mutationFn: async (body: TBody) => {
      const { data } = await client.request({
        method,
        url: getRequestUrl(path, pathParams),
        data: body,
      });

      return data as TResponse;
    },
    onError(error) {
      toast.error(error.message);
    },
    ...queryOptions,
  });
}
