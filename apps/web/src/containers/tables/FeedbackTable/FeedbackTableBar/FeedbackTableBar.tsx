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
import type { ColumnDef, Table, VisibilityState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import {
  DateRangePicker,
  TablePagination,
  TableSearchInput,
} from '@/components';
import type { SearchItemType } from '@/components/etc/TableSearchInput/TableSearchInput';
import { env } from '@/env.mjs';
import { useIssueSearch } from '@/hooks';
import type { FieldType } from '@/types/field.type';
import AllExpandButton from '../AllExpandButton';
import ChannelSelectBox from '../ChannelSelectBox';
import ColumnSettingPopover from '../ColumnSettingPopover';
import DownloadButton from '../DownloadButton';
import useFeedbackTable from '../feedback-table.context';

const getSearchItemPriority = (a: SearchItemType) =>
  a.name === 'Created' ? 1
  : a.name === 'Updated' ? 2
  : a.name === 'Issue' ? 3
  : 4;
interface IProps {
  onChangeChannel: (channelId: number) => void;
  columns: ColumnDef<any, any>[];
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
}

const FeedbackTableBar: React.FC<IProps> = (props) => {
  const {
    onChangeChannel,
    columns,
    fieldData,
    table,
    sub,
    meta,
    formattedQuery,
  } = props;

  const count = useMemo(() => meta?.totalItems ?? 0, [meta]);
  const {
    columnOrder,
    columnVisibility,
    setColumnVisibility,
    limit,
    resetColumnSetting,
    page,
    setPage,
    query,
    setQuery,
    setLimit,
    projectId,
    createdAtRange,
    setCreatedAtRange,
  } = useFeedbackTable();

  useEffect(() => {
    if (!fieldData) return;

    const inactiveKeys = fieldData
      .filter((v) => v.status === 'INACTIVE')
      .map((v) => v.key);

    const keys = Object.keys(columnVisibility);
    const newInactiveKeys = inactiveKeys.filter((v) => !keys.includes(v));

    if (newInactiveKeys.length === 0) return;

    const initialVisibility = newInactiveKeys.reduce(
      (acc, v) => ({ ...acc, [v]: false }),
      {} as VisibilityState,
    );

    setColumnVisibility(initialVisibility);
  }, [fieldData]);

  const { t } = useTranslation();

  const { data: issues } = useIssueSearch(projectId, { limit: 1000 });

  const searchItems = useMemo(() => {
    if (!fieldData) return [];

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

  const fieldIds = useMemo(() => {
    return (
      fieldData
        ?.filter((v) => columnVisibility[v.key] !== false)
        .sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key))
        .map((v) => v.id) ?? []
    );
  }, [columnOrder, columnVisibility, fieldData]);

  if (sub) {
    return (
      <div className="flex justify-between">
        <ChannelSelectBox onChangeChannel={onChangeChannel} />
        <div className="flex h-10 items-center justify-end gap-3">
          <TablePagination
            limit={limit}
            nextPage={() => setPage((prev) => prev + 1)}
            prevPage={() => setPage((prev) => prev - 1)}
            disabledNextPage={page >= (meta?.totalPages ?? 1)}
            disabledPrevPage={page <= 1}
            short
          />
          <div className="bg-fill-tertiary h-4 w-[1px]" />
          <AllExpandButton
            isAllExpanded={table.getIsAllRowsExpanded()}
            toggleAllRowsExpanded={table.toggleAllRowsExpanded}
          />
          <div className="bg-fill-tertiary h-4 w-[1px]" />
          <DownloadButton
            count={count}
            query={formattedQuery}
            fieldIds={fieldIds}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <ChannelSelectBox onChangeChannel={onChangeChannel} />
        <div className="flex h-10 items-center justify-end gap-2">
          <ColumnSettingPopover
            columns={columns.filter((v) => v.id !== 'select')}
            fieldData={fieldData ?? []}
            columnOrder={columnOrder.filter((v) => v !== 'select')}
            onChangeColumnOrder={table.setColumnOrder}
            columnVisibility={columnVisibility}
            onChangeColumnVisibility={table.setColumnVisibility}
            onClickReset={resetColumnSetting}
          />
          <AllExpandButton
            isAllExpanded={table.getIsAllRowsExpanded()}
            toggleAllRowsExpanded={table.toggleAllRowsExpanded}
          />
          <DownloadButton
            count={count}
            query={formattedQuery}
            fieldIds={fieldIds}
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
            limit={limit}
            nextPage={() => setPage((prev) => prev + 1)}
            prevPage={() => setPage((prev) => prev - 1)}
            setLimit={setLimit}
            disabledNextPage={page >= (meta?.totalPages ?? 1)}
            disabledPrevPage={page <= 1}
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
