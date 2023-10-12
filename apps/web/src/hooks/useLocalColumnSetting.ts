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
import type { OnChangeFn } from '@tanstack/react-table';
import { useLocalStorage } from 'react-use';

export default function useLocalColumnSetting<T extends object>({
  channelId,
  projectId,
  key,
  initialValue,
}: {
  projectId: number;
  channelId: number;
  key: string;
  initialValue: T;
}): [T, OnChangeFn<T>, () => void] {
  const [localColumnSetting, setLocalColumnSetting] = useLocalStorage<
    Record<number, Record<number, T>>
  >(key, {});

  const columnSetting: T = useMemo(() => {
    return (localColumnSetting?.[projectId]?.[channelId] ?? initialValue) as T;
  }, [localColumnSetting, projectId, channelId]);

  const onColumnSettingChange: OnChangeFn<T> = (
    updaterOrValue: ((old: T) => T) | T,
  ) => {
    if (typeof updaterOrValue === 'function') {
      const newColumn = updaterOrValue(columnSetting);

      const newState = {
        ...localColumnSetting,
        [projectId]: {
          ...(localColumnSetting?.[projectId] ?? {}),
          [channelId]: newColumn,
        },
      };
      setLocalColumnSetting(newState);
      return newState;
    } else {
      const newState = {
        ...localColumnSetting,
        [projectId]: {
          ...(localColumnSetting?.[projectId] ?? {}),
          [channelId]: updaterOrValue,
        },
      };
      setLocalColumnSetting(newState);
      return newState;
    }
  };
  const reset = () => {
    onColumnSettingChange(initialValue);
  };
  return [columnSetting, onColumnSettingChange, reset];
}
