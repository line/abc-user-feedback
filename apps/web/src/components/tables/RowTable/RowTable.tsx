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
import {
  CircularProgress,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

export namespace IRowTable {
  export type ColumnsType = {
    title: string | React.ReactNode;
    dataIndex: string;
    width?: string;
    render?: (value: any, record: any, index: any) => React.ReactNode;
  };
  export interface IProps {
    columns: ColumnsType[];
    data: Array<any>;
    nothingText?: string;
    status?: 'idle' | 'error' | 'loading' | 'success';
    tableProps?: TableProps;
  }
}

const RowTable: React.FC<IRowTable.IProps> = (props) => {
  const {
    columns,
    data,
    nothingText = 'No data yet.',
    status,
    tableProps,
  } = props;

  return (
    <Table {...tableProps} sx={{ tableLayout: 'fixed' }}>
      <Thead>
        <Tr>
          {columns.map(({ title, width }, idx) => (
            <Th key={idx} style={{ width }}>
              {title}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {status === 'loading' && (
          <Tr>
            <Td colSpan={columns.length}>
              <CircularProgress isIndeterminate />
            </Td>
          </Tr>
        )}
        {status === 'success' && data.length === 0 && (
          <Tr>
            <Td colSpan={columns.length}>{nothingText}</Td>
          </Tr>
        )}
        {data.map((row, index) => (
          <Tr key={index}>
            {columns.map(({ dataIndex, render }, idx) => (
              <Td key={`${index} ${idx}`} overflowX="auto">
                {!render ? row[dataIndex] : render(row[dataIndex], row, index)}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RowTable;
