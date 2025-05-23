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
export const commandFilter = (
  value: string,
  search: string,
  keywords?: string[],
) => {
  value = value.toLocaleLowerCase();
  search = search.toLocaleLowerCase();
  console.log(
    value,
    search,
    keywords,
    value.startsWith(search) ||
      keywords?.some((keyword) => keyword.startsWith(search)),
  );

  return (
    (
      value.startsWith(search) ||
        keywords?.some((keyword) => keyword.startsWith(search))
    ) ?
      1
    : (
      value.includes(search) ||
      keywords?.some((keyword) => keyword.includes(search))
    ) ?
      0.5
    : 0
  );
};
