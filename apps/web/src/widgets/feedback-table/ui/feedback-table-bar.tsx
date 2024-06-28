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
import { useEffect, useMemo } from 'react';
import type { Table, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { TablePagination } from '@/shared';

import { useFeedbackTable } from '../model';
import ChannelSelectBox from './channel-select-box';
import ColumnSettingPopover from './column-setting-popover';
import FeedbackTableDownloadButton from './feedback-table-download-button.ui';
import FeedbackTableExpandButtonGroup from './feedback-table-expand-button-group.ui';

import { DateRangePicker, TableSearchInput } from '@/components';
import type { SearchItemType } from '@/components/etc/TableSearchInput/TableSearchInput';
import { env } from '@/env.mjs';
import { useIssueSearch } from '@/hooks';
import type { FieldType } from '@/types/field.type';

const getSearchItemPriority = (a: SearchItemType) =>
  a.name === 'Created' ? 1
  : a.name === 'Updated' ? 2
  : a.name === 'Issue' ? 3
  : 4;
interface IProps {
  fieldData?: FieldType[];
  table: Table<any>;
  meta:
    | {
        itemCount: number;
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
      }
    | undefined;
  sub?: boolean;
  formattedQuery: Record<string, any>;
  onChangeChannel: (channelId: number) => void;
}

const FeedbackTableBar: React.FC<IProps> = (props) => {
  const {
    onChangeChannel,
    fieldData = [],
    table,
    sub,
    meta,
    formattedQuery,
  } = props;

  const { t } = useTranslation();
  const { columnVisibility } = table.getState();

  const { query, setQuery, projectId, createdAtRange, setCreatedAtRange } =
    useFeedbackTable();

  const { pagination } = table.getState();

  useEffect(() => {
    if (Object.keys(columnVisibility).length === 0) return;
    const initialVisibility = fieldData.reduce((acc, v) => {
      return {
        ...acc,
        [v.key]: v.status !== 'INACTIVE' || columnVisibility[v.key] === true,
      };
    }, {} as VisibilityState);

    table.setColumnVisibility(initialVisibility);
  }, [fieldData]);

  const { data: issues } = useIssueSearch(projectId, { limit: 1000 });

  const searchItems = useMemo(() => {
    const items: SearchItemType[] = [
      {
        key: 'issueIds',
        format: 'issue',
        name: 'Issue',
        options: (issues?.items ?? []).map((v) => ({
          id: v.id,
          name: v.name,
          key: String(v.id),
        })),
      },
      { key: 'ids', format: 'number', name: 'ID' },
    ];
    return items
      .concat(
        fieldData.filter(
          (v) => v.key !== 'id' && v.key !== 'createdAt' && v.key !== 'issues',
        ) as SearchItemType[],
      )
      .sort((a, b) => getSearchItemPriority(a) - getSearchItemPriority(b));
  }, [fieldData, issues, t]);

  const count = meta?.totalItems ?? 0;

  if (sub) {
    return (
      <div className="flex justify-between">
        <ChannelSelectBox
          onChangeChannel={(cid) => {
            onChangeChannel(cid);
            table.reset();
          }}
        />
        <div className="flex h-10 items-center justify-end gap-3">
          <TablePagination
            limit={pagination.pageSize}
            nextPage={() => table.setPageIndex((page) => page + 1)}
            prevPage={() => table.setPageIndex((page) => page - 1)}
            disabledNextPage={pagination.pageIndex >= (meta?.totalPages ?? 1)}
            disabledPrevPage={pagination.pageIndex <= 1}
            short
          />
          <div className="bg-fill-tertiary h-4 w-[1px]" />
          <FeedbackTableExpandButtonGroup table={table} />

          <div className="bg-fill-tertiary h-4 w-[1px]" />
          <FeedbackTableDownloadButton
            count={count}
            query={formattedQuery}
            table={table}
            fieldData={fieldData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <ChannelSelectBox
          onChangeChannel={(cid) => {
            onChangeChannel(cid);
            table.reset();
          }}
        />
        <div className="flex h-10 items-center justify-end gap-2">
          <ColumnSettingPopover table={table} fieldData={fieldData ?? []} />
          <FeedbackTableExpandButtonGroup table={table} />
          <FeedbackTableDownloadButton
            count={count}
            query={formattedQuery}
            table={table}
            fieldData={fieldData}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <h2 className="font-18-regular flex h-10 items-center gap-2">
          {t('text.search-result')}
          <span className="font-18-bold">
            {t('text.number-count', { count: count ?? 0 })}
          </span>
        </h2>
        <div className="flex h-10 items-center justify-end gap-4">
          <TablePagination
            limit={pagination.pageSize}
            nextPage={() => table.setPageIndex((page) => page + 1)}
            prevPage={() => table.setPageIndex((page) => page - 1)}
            setLimit={table.setPageSize}
            disabledNextPage={pagination.pageIndex >= (meta?.totalPages ?? 1)}
            disabledPrevPage={pagination.pageIndex <= 1}
          />
          <div className="w-[272px]">
            <DateRangePicker
              onChange={setCreatedAtRange}
              value={createdAtRange}
              maxDate={new Date()}
              maxDays={env.NEXT_PUBLIC_MAX_DAYS}
            />
          </div>
          {fieldData && (
            <TableSearchInput
              searchItems={searchItems}
              onChangeQuery={(input) => {
                const { createdAt } = query;
                setQuery({ createdAt, ...input });
              }}
              query={query}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTableBar;
