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

import dayjs from 'dayjs';

import {
  Calendar,
  Divider,
  InputField,
  Textarea,
  TextInput,
  TimePicker,
} from '@ufb/react';

import { ImagePreviewButton, SelectInput } from '@/shared';
import type { FieldInfo } from '@/entities/field';

interface Props {
  field: FieldInfo;
  value: unknown;
  onChangeFeedback: (fieldKey: string, value: unknown) => void;
}

const FeedbackDetailEditingCell = (props: Props) => {
  const { field, value, onChangeFeedback } = props;
  const setCurrentValue = (newValue: unknown) => {
    onChangeFeedback(field.key, newValue);
  };

  return (
    <>
      {field.format === 'date' ?
        <Calendar
          mode="single"
          selected={dayjs(value as string).toDate()}
          onDayClick={(date) => setCurrentValue(date)}
          defaultMonth={dayjs(value as string).toDate()}
          footer={
            <div className="border-neutral-transparent border-t-8">
              <Divider variant="subtle" />
              <div className="px-2 pt-2">
                <TimePicker
                  date={dayjs(value as string).toDate()}
                  onChange={(date) => setCurrentValue(date)}
                />
              </div>
            </div>
          }
        />
      : field.format === 'multiSelect' ?
        <SelectInput
          type="multiple"
          options={(field.options ?? []).map((option) => ({
            value: option.key,
            label: option.name,
          }))}
          values={value as string[]}
          onValuesChange={setCurrentValue}
        />
      : field.format === 'select' ?
        <SelectInput
          options={(field.options ?? []).map((option) => ({
            value: option.key,
            label: option.name,
          }))}
          value={value as string | undefined}
          onChange={(v) => setCurrentValue(v)}
        />
      : field.format === 'images' ?
        <ImagePreviewButton urls={value as string[]} />
      : field.format === 'number' ?
        <InputField>
          <TextInput
            value={value as number}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        </InputField>
      : <Textarea
          value={value as string}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      }
      1
    </>
  );
};

export default FeedbackDetailEditingCell;
