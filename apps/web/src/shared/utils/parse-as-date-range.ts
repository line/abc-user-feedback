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
import dayjs from 'dayjs';
import { createParser } from 'nuqs';

export const parseAsDateRange = createParser({
  parse(queryValue) {
    if (queryValue.includes('~') === false) {
      return null;
    }
    const [startDate, endDate] = queryValue.split('~');
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isAfter(dayjs(), 'day')) return null;
    if (end.isBefore(start, 'day')) return null;
    if (!start.isValid() || !end.isValid()) return null;

    return { startDate: start.toDate(), endDate: end.toDate() };
  },
  serialize(value) {
    return `${dayjs(value.startDate).format('YYYY-MM-DD')}~${dayjs(value.endDate).format('YYYY-MM-DD')}`;
  },
});
