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
import { getAllTimezones } from 'countries-and-timezones';

import type { Timezone } from './project.type';

export const getTimezoneOptions = () => {
  const result: Timezone[] = [];
  Object.values(getAllTimezones()).forEach((timezone) => {
    const { utcOffsetStr, countries, name } = timezone;
    countries.forEach((countryCode) => {
      result.push({
        countryCode,
        name,
        offset: utcOffsetStr,
      });
    });
  });
  return result;
};
export const getDefaultTimezone = () => {
  const options = getTimezoneOptions();
  const tz = options.find(
    (option) =>
      option.name === Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  if (!options[0]) {
    throw new Error("Can't find default timezone");
  }
  return tz ?? options[0];
};
