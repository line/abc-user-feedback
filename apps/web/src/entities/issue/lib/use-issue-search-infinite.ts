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
import { useInfiniteQuery } from '@tanstack/react-query';

import type { OAIMutationResponse, OAIRequestBody } from '@/shared';
import { client } from '@/shared';

type TData = OAIMutationResponse<
  '/api/admin/projects/{projectId}/issues/search',
  'post'
>;

interface IBody
  extends Omit<
    OAIRequestBody<'/api/admin/projects/{projectId}/issues/search', 'post'>,
    'queries'
  > {
  queries: Record<string, unknown>[];
}

const useIssueSearchInfinite = (
  projectId: number,
  body: IBody = { limit: 10, page: 1, queries: [], sort: {} },
) => {
  return useInfiniteQuery<TData>({
    queryKey: [
      '/api/admin/projects/{projectId}/issues/search',
      projectId,
      body,
    ],
    queryFn: async ({ pageParam }) => {
      const { data: result } = await client.post({
        path: '/api/admin/projects/{projectId}/issues/search',
        pathParams: { projectId },
        body: { ...body, page: pageParam as number },
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    initialData: {
      pageParams: [],
      pages: [
        {
          items: [],
          meta: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: 0,
          },
        },
      ],
    },
  });
};

export default useIssueSearchInfinite;
