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
import type { SortingState } from '@tanstack/react-table';

const useSort = (sorting: SortingState) => {
  return useMemo(() => {
    const result: Record<string, 'ASC' | 'DESC'> = {};
    for (const item of sorting) {
      result[item.id] = item.desc ? 'DESC' : 'ASC';
    }
    return result;
  }, [sorting]);
};

export default useSort;
