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
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/react';

import { client } from '../lib';
import CategoryTableRow from './category-table-row.ui';
import InfiniteScrollArea from './infinite-scroll-area.ui';
import type { TableFilterOperator } from './table-filter-popover';

interface Props {
  projectId: number;
  queries: Record<string, unknown>[];
  operator: TableFilterOperator;
}

const CategoryTable = (props: Props) => {
  const { projectId, queries, operator } = props;
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['/api/admin/projects/{projectId}/categories', projectId],
      queryFn: async ({ pageParam }) => {
        const { data } = await client.get({
          path: '/api/admin/projects/{projectId}/categories',
          pathParams: { projectId, page: pageParam },
        });
        return data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
          return lastPage.meta.currentPage + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      initialData: { pageParams: [], pages: [] },
    });

  return (
    <div className="flex flex-col gap-3">
      {[
        { id: 0, name: t('v2.text.no-category') },
        ...data.pages.flatMap((v) => v.items),
      ].map((item) => (
        <CategoryTableRow
          key={item.id}
          category={item}
          projectId={projectId}
          queries={queries}
          operator={operator}
        />
      ))}
      <InfiniteScrollArea
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Icon name="RiLoader4Line" className="spinner" />
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
