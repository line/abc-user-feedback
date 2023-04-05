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
import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useToastDefaultOption } from '@/constants/toast-default-option';
import client from '@/libs/client';
import { IFetchError } from '@/types/fetch-error.type';
import {
  OAIMethodPathKeys,
  OAIMutationResponse,
  OAIPathParameters,
  OAIRequestBody,
} from '@/types/openapi.type';
import { getRequestUrl } from '@/utils/path-parsing';

type MethodType = 'post' | 'put' | 'patch' | 'delete';

export default function useOAIMuataion<
  TMethods extends MethodType,
  TPath extends OAIMethodPathKeys<TMethods>,
  TPathParams extends OAIPathParameters<TPath, TMethods>,
  TBody extends OAIRequestBody<TPath, TMethods>,
  TResponse extends OAIMutationResponse<TPath, TMethods>,
>({
  method,
  path,
  pathParams,
}: {
  method: TMethods;
  path: TPath;
} & (TPathParams extends undefined
  ? { pathParams?: undefined }
  : { pathParams: TPathParams })) {
  const toast = useToast(useToastDefaultOption);

  return useMutation<TResponse, IFetchError, TBody, unknown>(
    [method, path, pathParams],
    async (body: TBody) => {
      const { data } = await client.request({
        method,
        url: getRequestUrl(path, pathParams),
        data: body,
      });

      return data as TResponse;
    },
    {
      onError: (error) => {
        toast({ title: error.message, status: 'error' });
      },
    },
  );
}
