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
import { Column } from '@tanstack/react-table';
import { Icon } from '@ufb/ui';

interface IProps extends React.PropsWithChildren {
  column: Column<any, any>;
}

const TableSortIcon: React.FC<IProps> = ({ column }) => {
  if (!column.getCanSort()) return <></>;
  return (
    <span
      onClick={() => {
        if (!column.getIsSorted()) {
          column.toggleSorting(false);
        } else if (column.getIsSorted() === 'asc') {
          column.toggleSorting(true);
        } else {
          column.toggleSorting(false);
        }
      }}
      className="cursor-pointer"
    >
      {column.getIsSorted() === false && (
        <Icon name="TrianglesUpDown" className="inline" size={20} />
      )}
      {column.getIsSorted() === 'asc' && (
        <Icon name="TrianglesUp" className="inline" size={20} />
      )}
      {column.getIsSorted() === 'desc' && (
        <Icon name="TrianglesDown" className="inline" size={20} />
      )}
    </span>
  );
};

export default TableSortIcon;
