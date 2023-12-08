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
import { useMemo } from 'react';
import dayjs from 'dayjs';

import ChartSearchContainer from './ChartSearchContainer';
import LineChart from './LineChart';

interface IProps {
  title: string;
  description?: string;
  height?: number;
  data: {
    color: string;
    name: string;
    data: { date: string; count: number }[];
  }[];
  from: Date;
  to: Date;
  onChangeSearch: (v: string) => void;
  items: { id: number; name: string }[];
  checkedList: { id: number; name: string }[];
  setCheckedList: (input: { id: number; name: string }[]) => void;
  maxItems: number;
}

const SearchLineChart: React.FC<IProps> = (props) => {
  const {
    title,
    description,
    height,
    data,
    from,
    to,
    onChangeSearch,
    items,
    checkedList,
    setCheckedList,
    maxItems,
  } = props;

  const dataKeys = useMemo(() => data, [data]);

  const newData = useMemo(() => {
    if (!data) return [];

    const result = [];
    let currentDate = dayjs(from).startOf('day');
    const endDate = dayjs(to).endOf('day');
    while (currentDate.isBefore(endDate)) {
      let total = 0;

      const channelData = data.reduce(
        (acc, cur) => {
          if (!checkedList.some((checkedItem) => checkedItem.name === cur.name))
            return acc;
          const count =
            cur.data.find((v) => v.date === currentDate.format('YYYY-MM-DD'))
              ?.count ?? 0;
          total += count;
          return { ...acc, [cur.name]: count };
        },
        { date: currentDate.format('YYYY-MM-DD') },
      );

      result.push({ ...channelData, total });
      currentDate = currentDate.add(1, 'day');
    }
    return result;
  }, [data, checkedList]);

  return (
    <ChartSearchContainer
      dataKeys={dataKeys}
      description={description}
      title={title}
      chedkedList={checkedList}
      items={items}
      onChecked={(item, checked) =>
        checked && checkedList.length < maxItems
          ? setCheckedList([...checkedList, item])
          : setCheckedList(checkedList.filter((v) => v.id !== item.id))
      }
      onChangeSearch={onChangeSearch}
    >
      <LineChart data={newData} dataKeys={dataKeys} height={height} />
    </ChartSearchContainer>
  );
};

export default SearchLineChart;
