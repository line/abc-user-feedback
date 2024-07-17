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
import type { Table } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface IProps<T> {
  table: Table<T>;
  onClickDelete?: () => void;
  disabled?: boolean;
  button?: React.ReactNode;
}

const CheckedTableHead = <T,>(props: IProps<T>) => {
  const { table, onClickDelete, disabled, button } = props;

  const { t } = useTranslation();

  const header = table.getFlatHeaders().find((v) => v.id === 'select');

  const { rowSelection } = table.getState();

  return (
    <>
      <th style={{ width: header?.getSize() }}>
        {header &&
          flexRender(header.column.columnDef.header, header.getContext())}
      </th>
      <th colSpan={table.getVisibleFlatColumns().length - 1}>
        <div className="flex items-center gap-5">
          <button
            className="btn btn-tertiary btn-sm text-red-primary min-w-0"
            onClick={onClickDelete}
            disabled={disabled}
          >
            {t('button.delete')}
          </button>
          <button
            className="btn btn-tertiary btn-sm min-w-0"
            onClick={() => table.resetRowSelection()}
          >
            {t('button.select-cancel')}
          </button>
          <div className="border-r-fill-secondary h-4 border-r-[1px]" />
          {button && (
            <>
              {button}
              <div className="border-r-fill-secondary h-4 border-r-[1px]" />
            </>
          )}
          <span className="font-12-bold text-blue-primary">
            {t('text.select-count', {
              count: Object.keys(rowSelection).length,
            })}
          </span>
        </div>
      </th>
    </>
  );
};

export default CheckedTableHead;
