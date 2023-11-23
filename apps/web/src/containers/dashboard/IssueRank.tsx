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
import { faker } from '@faker-js/faker';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Line, LineChart } from 'recharts';

import DashboardTable from '@/components/etc/DashboardTable';

interface IssueTableData {
  id: number;
  name: string;
  count: number;
  yoy: number;
  trend: { date: string; value: number }[];
}

const columnHelper = createColumnHelper<IssueTableData>();
const columns = [
  columnHelper.accessor('id', { header: 'No', enableSorting: false }),
  columnHelper.accessor('name', { header: 'Issue' }),
  columnHelper.accessor('count', { header: 'Count' }),
  columnHelper.accessor('yoy', { header: 'YoY' }),
  columnHelper.accessor('trend', {
    header: 'Trend',
    enableSorting: false,
    cell(props) {
      console.log('props.getValue(): ', props.getValue());
      return (
        <LineChart width={100} height={40} data={props.getValue()}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#000000"
            dot={{ r: 0 }}
          />
        </LineChart>
      );
    },
  }),
];
interface IProps {}

const IssueRank: React.FC<IProps> = () => {
  return (
    <DashboardTable
      columns={columns}
      data={[
        {
          id: 1,
          name: 'name',
          count: faker.number.int(1000),
          yoy: faker.number.int(100),
          trend: Array.from({ length: 10 }).map((_, i) => ({
            date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
            value: faker.number.int(1000),
          })),
        },
        {
          id: 2,
          name: 'name',
          count: faker.number.int(1000),
          yoy: faker.number.int(100),
          trend: Array.from({ length: 10 }).map((_, i) => ({
            date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
            value: faker.number.int(1000),
          })),
        },
        {
          id: 3,
          name: 'name',
          count: faker.number.int(1000),
          yoy: faker.number.int(100),
          trend: Array.from({ length: 10 }).map((_, i) => ({
            date: dayjs().add(i, 'day').format('YYYY-MM-DD'),
            value: faker.number.int(1000),
          })),
        },
      ]}
      title="이슈 순위"
    />
  );
};

export default IssueRank;
