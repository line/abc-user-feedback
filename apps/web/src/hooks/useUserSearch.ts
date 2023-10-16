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
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import client from '@/libs/client';
import type { OAIMutationResponse, OAIRequestBody } from '@/types/openapi.type';

type TData = OAIMutationResponse<'/api/users/search', 'post'>;

interface IBody extends OAIRequestBody<'/api/users/search', 'post'> {}

const useUserSearch = (
  body: IBody = { limit: 10, page: 1 },
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TData>(
    ['/api/users/search', body],
    async () => {
      const { data: result } = await client.post({
        path: '/api/users/search',
        body,
      });
      return result;
    },
    options,
  );
};

export default useUserSearch;
