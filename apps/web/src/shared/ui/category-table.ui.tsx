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

import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import { Icon } from '@ufb/react';

import { useCategorySearchInfinite } from '@/entities/category/lib';

import type { SearchQuery } from '../types';
import CategoryTableRow from './category-table-row.ui';
import InfiniteScrollArea from './infinite-scroll-area.ui';
import type { TableFilterOperator } from './table-filter-popover';

interface Props {
  projectId: number;
  queries: SearchQuery[];
  operator: TableFilterOperator;
}

const CategoryTable = (props: Props) => {
  const { projectId, queries, operator } = props;
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategorySearchInfinite(projectId, {});

  const allcategories = useMemo(() => {
    return data.pages
      .map((v) => v?.items)
      .filter((v) => !!v)
      .flat();
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      {[{ id: 0, name: t('v2.text.no-category') }, ...allcategories].map(
        (item) => (
          <CategoryTableRow
            key={item.id}
            category={item}
            projectId={projectId}
            queries={queries}
            operator={operator}
          />
        ),
      )}
      <InfiniteScrollArea
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
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
