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

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Icon } from '@ufb/react';

import { client } from '../lib';
import type { DateRangeType } from '../types';
import CategoryTableRow from './category-table-row.ui';
import type { TableFilterOperator } from './table-filter-popover';

interface Props {
  projectId: number;
  createdAtDateRange: DateRangeType;
  queries: Record<string, unknown>[];
  operator: TableFilterOperator;
}

const CategoryTable = (props: Props) => {
  const { projectId, createdAtDateRange, queries, operator } = props;
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        void fetchNextPage();
      });
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {[{ id: 0, name: 'None' }, ...data.pages.flatMap((v) => v.items)].map(
        (item) => (
          <CategoryTableRow
            key={item.id}
            category={item}
            projectId={projectId}
            createdAtDateRange={createdAtDateRange}
            queries={queries}
            operator={operator}
          />
        ),
      )}
      {hasNextPage && <div ref={ref} className="h-px" />}
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Icon name="RiLoader4Line" className="spinner" />
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
