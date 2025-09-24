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
import Image from 'next/image';
import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';

import { DescriptionTooltip, SelectInput, SortingTableHead } from '@/shared';

interface IProps<T> {
  title: string;
  description?: string;
  selectData?: {
    options: { value: string; label: string }[];
    onChange: (value?: string) => void;
    value: string;
  };
  table: Table<T>;
  filterContent?: React.ReactNode;
}

function DashboardTable<T>(props: IProps<T>) {
  const { title, description, table, selectData, filterContent } = props;
  const { t } = useTranslation();

  return (
    <div className="rounded-20 shadow-default border-neutral-tertiary bg-neutral-primary flex h-[462px] flex-col border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1">
          <h3 className="text-title-h4">{title}</h3>
          {description && (
            <DescriptionTooltip description={description} side="bottom" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectData && <SelectInput {...selectData} />}
          {filterContent}
        </div>
      </div>
      <div className="mb-6 overflow-x-hidden overflow-y-scroll">
        <table className="w-full">
          <thead>
            <tr className="border-neutral-tertiary h-12 border-b border-t">
              {table.getFlatHeaders().map((header, i) => (
                <th
                  key={i}
                  style={{ width: header.getSize() }}
                  className="text-base-normal px-3 text-left"
                >
                  <div className="flex items-center gap-1">
                    {header.column.getCanSort() ?
                      <SortingTableHead column={header.column}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </SortingTableHead>
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    }
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ?
              table.getRowModel().rows.map((row) => (
                <tr
                  className="border-neutral-tertiary h-14 border-b"
                  key={row.index}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`${cell.id} ${cell.row.index}`}
                      className="border-none px-3"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            : <tr>
                <td colSpan={table.getFlatHeaders().length}>
                  <div className="my-10 flex flex-col items-center justify-center gap-4 [&>button]:min-w-[120px]">
                    <Image
                      width={200}
                      height={200}
                      src="/assets/images/empty-image.png"
                      alt="empty image"
                    />
                    <p className="text-small text-neutral-tertiary">
                      {t('v2.text.no-data.default')}
                    </p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardTable;
