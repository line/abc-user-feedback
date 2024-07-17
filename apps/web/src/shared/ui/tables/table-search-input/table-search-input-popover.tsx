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
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { useTranslation } from 'next-i18next';

import { Icon } from '@ufb/ui';

import type { DateRangeType, SearchItemType } from '@/shared';
import { DateRangePicker, isDateQuery, SelectBox } from '@/shared';

interface IProps extends React.PropsWithChildren {
  columns: SearchItemType[];
  onSubmit: (query: Record<string, unknown>) => void;
  close: () => void;
  query: Record<string, unknown>;
}

const TableSearchInputPopover: React.FC<IProps> = (props) => {
  const { columns, onSubmit, close, query } = props;

  const { t } = useTranslation();

  const [currentQuery, setCurrentQuery] =
    useState<Record<string, unknown>>(query);

  const onSave = () => {
    const result = produce(currentQuery, (query) => {
      for (const [key, value] of Object.entries(query)) {
        const column = columns.find((v) => v.key === key);
        if (!column) return;
        query[key] = value;
      }
    });

    onSubmit(result);
    close();
  };

  const onChangeDate = (key: string) => (date: DateRangeType) => {
    setCurrentQuery((prev) =>
      produce(prev, (draft) => {
        if (!date) draft[key] = null;
        else if (!date.endDate) delete draft[key];
        else if (!date.startDate) delete draft[key];
        else draft[key] = { gte: date.startDate, lt: date.endDate };
      }),
    );
  };

  const getDateValue = useCallback(
    (key: string) => {
      return isDateQuery(currentQuery[key]) ?
          {
            startDate: dayjs(currentQuery[key].gte).toDate(),
            endDate: dayjs(currentQuery[key].lt).toDate(),
          }
        : null;
    },
    [currentQuery],
  );

  return (
    <div className="p-5">
      <div className="mb-4 flex justify-between">
        <h1 className="font-16-bold">{t('text.search-filter')}</h1>
        <button
          className="icon-btn icon-btn-xs icon-btn-tertiary"
          onClick={close}
        >
          <Icon name="Close" size={16} />
        </button>
      </div>
      {columns.map((item) => (
        <div className="mb-4 space-y-[10px]" key={item.key}>
          {item.format === 'date' && (
            <div>
              <p className="font-12-regular mb-[6px]">{item.name}</p>
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <DateRangePicker
                  value={getDateValue(item.key)}
                  onChange={onChangeDate(item.key)}
                  maxDate={new Date()}
                  isClearable
                />
              </div>
            </div>
          )}

          {(item.format === 'issue' ||
            item.format === 'select' ||
            item.format === 'multiSelect') && (
            <SelectBox
              label={item.name}
              value={currentQuery[item.key] as { key: string; name: string }}
              onChange={(v) =>
                setCurrentQuery((prev) => ({ ...prev, [item.key]: v }))
              }
              options={item.options}
              getOptionValue={(option) => option.key}
              getOptionLabel={(option) => option.name}
              isClearable
            />
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => {
            setCurrentQuery({});
            close();
          }}
        >
          {t('button.cancel')}
        </button>
        <button className="btn btn-primary" onClick={onSave}>
          {t('button.save')}
        </button>
      </div>
    </div>
  );
};

export default TableSearchInputPopover;
