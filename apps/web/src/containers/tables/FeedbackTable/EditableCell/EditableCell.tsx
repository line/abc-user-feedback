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
import { memo, useEffect, useMemo, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import { SelectBoxCreatable } from '@/components/etc/SelectBox';
import { FieldType } from '@/types/field.type';
import useTableStore from '@/zustand/table.store';

interface IProps extends React.PropsWithChildren {
  field: FieldType;
  value: any;
  isExpanded: boolean;
  feedbackId: number;
}

const EditableCell: React.FC<IProps> = (props) => {
  const { field, value, isExpanded, feedbackId } = props;

  const { editableState, onChangeEditInput } = useTableStore(
    ({ editableState, onChangeEditInput }) => ({
      editableState,
      onChangeEditInput,
    }),
  );

  const isEditable = useMemo(
    () => editableState === props.feedbackId,
    [editableState],
  );

  const [currentValue, setCurrentValue] = useState<any>();

  useEffect(() => {
    if (editableState === feedbackId) return;
    setCurrentValue(
      field.format === 'select'
        ? field.options?.find((v) => v.key === value) ?? null
        : field.format === 'multiSelect'
        ? (value ?? []).map((optionKey: string) =>
            field.options?.find((v) => v.key === optionKey),
          )
        : field.format === 'number'
        ? value
          ? Number(value)
          : null
        : field.format === 'boolean'
        ? Boolean(value)
        : value,
    );
  }, [value]);

  useEffect(() => {
    if (editableState !== feedbackId || typeof currentValue === 'undefined')
      return;
    onChangeEditInput(
      field.key,
      field.format === 'text' || field.format === 'keyword'
        ? currentValue ?? ''
        : field.format === 'number'
        ? Number(currentValue)
        : field.format === 'boolean'
        ? Boolean(currentValue)
        : field.format === 'date'
        ? new Date(currentValue)
        : field.format === 'select'
        ? currentValue?.key ?? null
        : field.format === 'multiSelect'
        ? (currentValue ?? []).map(
            (v: { id: number; key: string; name: string }) => v.key,
          ) ?? null
        : currentValue,
    );
  }, [currentValue, editableState]);

  return (
    <div className="overflow-hidden">
      {field.format === 'boolean' && (
        <input
          type="checkbox"
          className="toggle"
          disabled={!isEditable}
          checked={Boolean(currentValue)}
          onChange={(e) => setCurrentValue(e.target.checked)}
        />
      )}
      {(field.format === 'keyword' || field.format === 'text') && (
        <input
          type="text"
          className="input input-sm"
          placeholder="input"
          value={currentValue ?? ''}
          onChange={(e) => setCurrentValue(e.target.value)}
          disabled={!isEditable}
        />
      )}
      {field.format === 'number' && (
        <input
          type="number"
          className="input input-sm"
          placeholder="input"
          disabled={!isEditable}
          value={currentValue ?? ''}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      )}
      {field.format === 'date' && (
        <ReactDatePicker
          onChange={(v) => setCurrentValue(v)}
          dateFormat="yyyy/MM/dd"
          className="input input-sm"
          placeholderText="input"
          disabled={!isEditable}
          value={currentValue ? dayjs(currentValue).format('YYYY/MM/DD') : ''}
        />
      )}
      {field.format === 'select' && (
        <SelectBoxCreatable
          options={field.options ?? []}
          value={currentValue ?? null}
          onChange={(v) => setCurrentValue(v)}
          isExpand={isExpanded}
          isDisabled={!isEditable}
          isClearable
        />
      )}
      {field.format === 'multiSelect' && (
        <SelectBoxCreatable
          options={field.options ?? []}
          value={currentValue ?? []}
          onChange={(v) => setCurrentValue(v)}
          isExpand={isExpanded}
          isDisabled={!isEditable}
          isClearable
          isMulti
        />
      )}
    </div>
  );
};

export default memo(EditableCell);
