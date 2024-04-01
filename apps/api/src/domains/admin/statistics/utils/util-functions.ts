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
import { DateTime } from 'luxon';

export function getIntervalDatesInFormat(
  startDate: string,
  endDate: string,
  inputDate: Date,
  interval: 'day' | 'week' | 'month',
) {
  if (interval === 'day') {
    return {
      startOfInterval: DateTime.fromJSDate(new Date(inputDate)).toFormat(
        'yyyy-MM-dd',
      ),
      endOfInterval: DateTime.fromJSDate(new Date(inputDate)).toFormat(
        'yyyy-MM-dd',
      ),
    };
  } else {
    const intervalCount = Math.floor(
      Math.abs(
        DateTime.fromJSDate(new Date(inputDate))
          .diff(DateTime.fromJSDate(new Date(endDate)), interval)
          .as(`${interval}s`),
      ) + 1,
    );
    const startOfInterval =
      DateTime.fromJSDate(new Date(endDate))
        .minus({
          [interval]: intervalCount === 0 ? 1 : intervalCount,
        })
        .plus({ day: 1 }) < DateTime.fromJSDate(new Date(startDate))
        ? DateTime.fromJSDate(new Date(startDate)).toFormat('yyyy-MM-dd')
        : DateTime.fromJSDate(new Date(endDate))
            .minus({
              [interval]: intervalCount === 0 ? 1 : intervalCount,
            })
            .plus({ day: 1 })
            .toFormat('yyyy-MM-dd');
    const endOfInterval = DateTime.fromJSDate(new Date(endDate))
      .minus({
        [interval]: intervalCount === 0 ? 0 : intervalCount - 1,
      })
      .toFormat('yyyy-MM-dd');

    return {
      startOfInterval,
      endOfInterval,
    };
  }
}
