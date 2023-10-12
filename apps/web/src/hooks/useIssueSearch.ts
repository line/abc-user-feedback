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

type TData = OAIMutationResponse<
  '/api/projects/{projectId}/issues/search',
  'post'
>;

interface IBody
  extends Omit<
    OAIRequestBody<'/api/projects/{projectId}/issues/search', 'post'>,
    'query'
  > {
  query?: any;
}

const useIssueSearch = (
  projectId: number,
  body: IBody = { limit: 10, page: 1, query: {}, sort: {} },
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<TData>(
    ['/api/projects/{projectId}/issues/search', projectId, body],
    async () => {
      const { data: result } = await client.post({
        path: '/api/projects/{projectId}/issues/search',
        pathParams: { projectId },
        body,
      });
      return result;
    },
    options,
  );
};

export default useIssueSearch;
