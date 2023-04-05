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
import { Checkbox, Text } from '@chakra-ui/react';
import { memo, useMemo, useState } from 'react';

import { Pagination } from '@/components/others';

import RowTable, { IRowTable } from '../RowTable';
import DataTableBar, { IDataTableBarProps } from './DataTableBar';

interface IProps extends React.PropsWithChildren, IRowTable.IProps {
  tableBar?: {
    onDeleteBtnClick?: (ids: string[]) => void;
    leftButtons?: {
      children?: React.ReactNode;
      onClickCheckList?: (ids: string[]) => void;
      onClick?: () => void;
    }[];
    rightButtons?: {
      children?: React.ReactNode;
      onClickCheckList?: (ids: string[]) => void;
      onClick?: () => void;
    }[];
  } & Omit<
    IDataTableBarProps,
    'checkListLength' | 'leftButtons' | 'rightButtons'
  >;
  pagination?: {
    meta: {
      totalPages: number;
      itemsPerPage: number;
      currentPage: number;
    };
    onChangePage: (page: number) => void;
  };
}

const DataTable: React.FC<IProps> = (props) => {
  const { columns, data, tableBar, status, pagination } = props;
  const [checkList, setCheckList] = useState<string[]>([]);

  const newColumns = useMemo(
    () =>
      [
        {
          title: (
            <Checkbox
              isChecked={
                data?.length > 0 &&
                data?.filter((v) => !checkList.includes(v.id)).length === 0
              }
              onChange={(e) => {
                const { checked } = e.currentTarget;
                if (checked) {
                  setCheckList((prev) =>
                    Array.from(
                      new Set([...data.map(({ id }) => id), ...prev]).values(),
                    ),
                  );
                } else {
                  const ids = data.map(({ id }) => id);
                  setCheckList((prev) => prev.filter((v) => !ids.includes(v)));
                }
              }}
            />
          ),
          dataIndex: 'checkbox',
          width: '70px',
          render: (_, row) => (
            <Checkbox
              isChecked={checkList.includes(row.id)}
              onChange={(e) => {
                const { checked } = e.currentTarget;
                if (checked) {
                  setCheckList((prev) => prev.concat([row.id]));
                } else {
                  setCheckList((prev) => prev.filter((v) => v !== row.id));
                }
              }}
            />
          ),
        } as IRowTable.ColumnsType,
      ].concat(columns),
    [checkList, data],
  );

  return (
    <>
      <DataTableBar
        leftButtons={tableBar?.leftButtons?.map(
          ({ children, onClickCheckList, onClick }) => ({
            children,
            onClick: () => {
              if (onClickCheckList) {
                onClickCheckList(checkList);
                setCheckList([]);
              }
              if (onClick) onClick();
            },
            disabled: onClickCheckList ? checkList.length === 0 : false,
            variant: 'outline',
            px: '10px',
          }),
        )}
        rightButtons={tableBar?.rightButtons?.map(
          ({ children, onClickCheckList, onClick }) => ({
            children,
            onClick: () => {
              if (onClickCheckList) {
                onClickCheckList(checkList);
                setCheckList([]);
              }
              if (onClick) onClick();
            },
            disabled: onClickCheckList ? checkList.length === 0 : false,
          }),
        )}
        searchInput={tableBar?.searchInput}
        count={tableBar?.count}
        checkListLength={checkList.length}
      />
      <RowTable columns={newColumns} data={data} status={status} />
      {pagination && <Pagination {...pagination} />}
    </>
  );
};

export default DataTable;
