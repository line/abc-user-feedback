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
import { ColumnDef, Table } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DateRangePicker,
  TablePagination,
  TableSearchInput,
} from '@/components';
import { SearchItemType } from '@/components/etc/TableSearchInput/TableSearchInput';
import { env } from '@/env.mjs';
import { useIssueSearch } from '@/hooks';
import { FieldType } from '@/types/field.type';

import AllExpandButton from '../AllExpandButton';
import ChannelSelectBox from '../ChannelSelectBox';
import ColumnSettingPopover from '../ColumnSettingPopover';
import DownloadButton from '../DownloadButton';
import useFeedbackTable from '../feedback-table.context';

const getSearchItemPriority = (a: SearchItemType) =>
  a.name === 'Created'
    ? 1
    : a.name === 'Updated'
    ? 2
    : a.name === 'Issue'
    ? 3
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
}

const FeedbackTableBar: React.FC<IProps> = (props) => {
  const { onChangeChannel, columns, fieldData, table, sub, meta } = props;

  const count = useMemo(() => meta?.totalItems, [meta]);
  const {
    columnOrder,
    columnVisibility,
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

  if (sub) {
    return (
      <div className="flex justify-between">
        <ChannelSelectBox onChangeChannel={onChangeChannel} />
        <div className="h-10 flex justify-end items-center gap-3">
          <TablePagination
            limit={limit}
            nextPage={() => setPage((prev) => prev + 1)}
            prevPage={() => setPage((prev) => prev - 1)}
            disabledNextPage={page >= (meta?.totalPages ?? 1)}
            disabledPrevPage={page <= 1}
            short
          />
          <div className="w-[1px] bg-fill-tertiary h-4" />
          <AllExpandButton
            isAllExpanded={table.getIsAllRowsExpanded()}
            toggleAllRowsExpanded={table.toggleAllRowsExpanded}
          />
          <div className="w-[1px] bg-fill-tertiary h-4" />
          <DownloadButton count={count} query={query} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <ChannelSelectBox onChangeChannel={onChangeChannel} />
        <div className="flex gap-2 justify-end h-10 items-center">
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
          <DownloadButton count={count} query={query} />
        </div>
      </div>
      <div className="flex justify-between">
        <h2 className="font-18-regular h-10 flex items-center gap-2">
          {t('text.search-result')}
          <span className="font-18-bold">
            {t('text.number-count', { count: count ?? 0 })}
          </span>
        </h2>
        <div className="h-10 flex justify-end items-center gap-4">
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
              onChangeQuery={setQuery}
              initialQuery={query}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTableBar;
