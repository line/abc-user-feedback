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
import { memo, useMemo } from 'react';
import dayjs from 'dayjs';
import ReactDatePicker from 'react-datepicker';

import { SelectBoxCreatable } from '@/components/etc/SelectBox';
import type { FieldType } from '@/types/field.type';
import useTableStore from '@/zustand/table.store';

interface IProps extends React.PropsWithChildren {
  field: FieldType;
  value: any;
  isExpanded: boolean;
  feedbackId: number;
}

const EditableCell: React.FC<IProps> = memo((props) => {
  const { field, value, isExpanded, feedbackId } = props;

  const { editableState, onChangeEditInput, editInput } = useTableStore();

  const isEditable = editableState === feedbackId;

  const currentRowValue = useMemo(() => {
    return !isEditable ? value : editInput[field.key] ?? value;
  }, [isEditable, field, value, editInput]);

  const currentValue = useMemo(() => {
    if (field.format === 'date') {
      return currentRowValue ?
          dayjs(currentRowValue).format('YYYY/MM/DD')
        : undefined;
    }
    if (field.format === 'select') {
      return (field.options ?? []).find((v) => v.key === currentRowValue);
    }
    if (field.format === 'multiSelect') {
      return (field.options ?? []).filter((v) =>
        ((currentRowValue ?? []) as string[]).includes(v.key),
      );
    }
    return currentRowValue;
  }, [currentRowValue]);

  return (
    <div className="overflow-hidden">
      {(field.format === 'keyword' || field.format === 'text') && (
        <input
          type="text"
          className="input input-sm"
          placeholder="input"
          value={currentValue ?? ''}
          onChange={(e) => onChangeEditInput(field.key, e.target.value)}
          disabled={!isEditable}
        />
      )}
      {field.format === 'number' && (
        <input
          type="number"
          className="input input-sm"
          placeholder="input"
          disabled={!isEditable}
          value={currentValue ?? 0}
          onChange={(e) => onChangeEditInput(field.key, Number(e.target.value))}
        />
      )}
      {field.format === 'date' && (
        <ReactDatePicker
          onChange={(v) => onChangeEditInput(field.key, dayjs(v).toISOString())}
          dateFormat="yyyy/MM/dd"
          className="input input-sm"
          placeholderText="input"
          disabled={!isEditable}
          value={currentValue}
        />
      )}
      {field.format === 'select' && (
        <SelectBoxCreatable
          options={field.options ?? []}
          value={currentValue}
          onChange={(v) => {
            onChangeEditInput(field.key, v?.key);
          }}
          isExpand={isExpanded}
          isDisabled={!isEditable}
          isClearable
        />
      )}
      {field.format === 'multiSelect' && (
        <SelectBoxCreatable
          options={field.options ?? []}
          value={currentValue}
          onChange={(v) =>
            onChangeEditInput(
              field.key,
              v?.map((option) => option.key),
            )
          }
          isExpand={isExpanded}
          isDisabled={!isEditable}
          isClearable
          isMulti
        />
      )}
    </div>
  );
});

export default EditableCell;
