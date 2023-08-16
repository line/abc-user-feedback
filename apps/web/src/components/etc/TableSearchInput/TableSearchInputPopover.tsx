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
import { Icon } from '@ufb/ui';
import produce from 'immer';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';

import { DateRangeType } from '@/types/date-range.type';

import DateRangePicker from '../DateRangePicker';
import SelectBox from '../SelectBox';
import { SearchItemType } from './TableSearchInput';

const BooleanOptions = [
  { name: 'True', key: true },
  { name: 'False', key: false },
];
interface IProps extends React.PropsWithChildren {
  columns: SearchItemType[];
  onSubmit: (query: Record<string, any>) => void;
  close: () => void;
  query: Record<string, any>;
}
const TableSearchInputPopover: React.FC<IProps> = (props) => {
  const { columns, onSubmit, close, query } = props;

  const { t } = useTranslation();

  const [currentQuery, setCurrentQuery] = useState<Record<string, any>>(query);

  const onSave = () => {
    const result = produce(currentQuery, (query) => {
      for (const [key, value] of Object.entries(query)) {
        const column = columns.find((v) => v.key === key);
        if (!column) {
          alert('잠시후 다시 시도해주세요.');
          return;
        }
        switch (column.format) {
          case 'boolean':
            query[key] = value;
            break;
          case 'select':
          case 'issue':
          case 'issue_status':
            query[key] = value;
            break;
          default:
            break;
        }
      }
    });

    onSubmit(result);
    close();
  };

  const onChangeDate = (key: string) => (date: DateRangeType | null) => {
    setCurrentQuery((prev) =>
      produce(prev, (draft) => {
        if (!date) delete draft[key];
        else if (!date?.endDate) delete draft[key];
        else if (!date?.startDate) delete draft[key];
        else draft[key] = { gte: date.startDate, lt: date.endDate };
      }),
    );
  };
  const getDateValue = useCallback(
    (key: string) => {
      return currentQuery[key]
        ? {
            startDate: currentQuery[key].gte ?? null,
            endDate: currentQuery[key].lt ?? null,
          }
        : null;
    },
    [currentQuery],
  );

  return (
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <h1 className="font-16-bold">{t('text.search-filter')}</h1>
        <button
          className="icon-btn icon-btn-xs icon-btn-tertiary"
          onClick={close}
        >
          <Icon name="Close" size={16} />
        </button>
      </div>
      {columns.map((item) => (
        <div className="space-y-[10px] mb-4" key={item.key}>
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
                />
              </div>
            </div>
          )}
          {(item.format === 'issue' ||
            item.format === 'select' ||
            item.format === 'multiSelect' ||
            item.format === 'issue_status') && (
            <SelectBox
              label={item.name}
              value={currentQuery[item.key]}
              onChange={(v) => {
                setCurrentQuery((prev) => ({ ...prev, [item.key]: v }));
              }}
              options={item.options}
              isClearable
            />
          )}
          {item.format === 'boolean' && (
            <SelectBox
              label={item.name}
              value={BooleanOptions.find(
                (v) => v.key === currentQuery[item.key],
              )}
              onChange={(v) => {
                setCurrentQuery((prev) => ({ ...prev, [item.key]: v?.key }));
              }}
              options={BooleanOptions}
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
