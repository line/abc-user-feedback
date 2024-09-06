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

import { TextInput } from '@ufb/react';

import { SelectBoxCreatable, SelectInput } from '@/shared';
import type { FieldInfo } from '@/entities/field';

interface IProps extends React.PropsWithChildren {
  field: FieldInfo;
  value: unknown;
  isExpanded: boolean;
  feedbackId: number;
}

const EditableCell: React.FC<IProps> = memo((props) => {
  const { field, value, isExpanded, feedbackId } = props;

  const currentValue = useMemo(() => {
    if (field.format === 'date') {
      return value ? dayjs(value as string).format('YYYY/MM/DD') : undefined;
    }
    if (field.format === 'select') {
      return (field.options ?? []).find((v) => v.key === value);
    }
    if (field.format === 'multiSelect') {
      return (field.options ?? []).filter((v) =>
        ((value ?? []) as string[]).includes(v.key),
      );
    }
    return value;
  }, [value]);

  return (
    <div className="overflow-hidden">
      {(field.format === 'keyword' || field.format === 'text') && (
        <TextInput
          type="text"
          placeholder="input"
          value={String(currentValue)}
        />
      )}
      {field.format === 'number' && (
        <TextInput placeholder="input" value={Number(currentValue)} />
      )}
      {field.format === 'date' && (
        <ReactDatePicker
          dateFormat="yyyy/MM/dd"
          className="input input-sm"
          placeholderText="input"
          onChange={() => {}}
        />
      )}
      {field.format === 'select' && (
        <SelectInput
          options={
            field.options?.map((v) => ({
              label: String(v.name),
              value: String(v.key),
            })) ?? []
          }
        />
      )}
      {field.format === 'multiSelect' && (
        <SelectInput
          type="multiple"
          options={
            field.options?.map((v) => ({
              label: String(v.name),
              value: String(v.key),
            })) ?? []
          }
        />
      )}
    </div>
  );
});

export default EditableCell;
