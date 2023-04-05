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
import type { DateRangeType } from '@/types/date-rage.type';
import { ColumnOrderState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type Updater<T> = T | ((old: T) => T);

interface IState {
  dateRange: DateRangeType;
  isCellExpanded: boolean;
  columnVisibility: Record<string, boolean>;
  columnOrder: ColumnOrderState;
  filterValues: Record<string, any>;
}

interface IAction {
  updateDateRange: (input: DateRangeType) => void;
  toggleCellExpanded: () => void;
  setColumnVisibility: (name: string, isChecked: boolean) => void;
  onColumnOrderChange: (input: Updater<ColumnOrderState>) => void;
  onFilterValuesChange: (input: Record<string, any>) => void;
}

const initialState: IState = {
  dateRange: {
    startDate: dayjs().startOf('days').toDate(),
    endDate: dayjs().endOf('days').toDate(),
  },
  isCellExpanded: false,
  columnVisibility: {},
  columnOrder: [],
  filterValues: {},
};

export const useSetFeedbackTableStore = create(
  persist(
    immer<IState & IAction>((set, get) => ({
      ...initialState,
      updateDateRange: (dateRange: DateRangeType) =>
        set((state) => {
          state.dateRange = dateRange;
        }),
      toggleCellExpanded: () =>
        set((state) => {
          state.isCellExpanded = !state.isCellExpanded;
        }),
      setColumnVisibility: (name: string, isChecked: boolean) =>
        set((state) => {
          state.columnVisibility = {
            ...state.columnVisibility,
            [name]: isChecked,
          };
        }),
      onColumnOrderChange: (input: Updater<ColumnOrderState>) => {
        const res = get();
        set((state) => {
          state.columnOrder =
            typeof input === 'function' ? input(res.columnOrder) : input;
        });
      },
      onFilterValuesChange: (input: Record<string, any>) => {
        set((state) => {
          state.filterValues = input;
        });
      },
    })),
    { name: 'key', storage: createJSONStorage(() => sessionStorage) },
  ),
);

export const useFeedbackTableStore = (): IState => {
  const [state, setState] = useState<IState>(initialState);
  const zustandState = useSetFeedbackTableStore();

  useEffect(() => {
    setState(zustandState);
  }, [zustandState]);

  return state;
};
