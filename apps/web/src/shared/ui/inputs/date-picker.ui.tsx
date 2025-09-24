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
  Button,
  Calendar,
  Divider,
  Icon,
  InputBox,
  InputField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TextInput,
  TimePickerInput,
} from '@ufb/react';

import { cn } from '@/shared/utils';

interface Props {
  value?: string | null;
  onChange: (value?: string | null) => void;
  disabled?: boolean;
  mode?: 'date' | 'datetime';
}

const DatePicker = (props: Props) => {
  const { value, onChange, disabled, mode = 'date' } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputField>
          <InputBox>
            <Icon
              name="RiCalendarEventLine"
              className="absolute-y-center absolute left-2"
              size={16}
            />
            <TextInput
              placeholder="0000-00-00"
              className={cn('cursor-pointer pl-7', { 'pr-9': !!value })}
              value={
                value ?
                  mode === 'date' ?
                    dayjs(value).format('YYYY-MM-DD')
                  : dayjs(value).format('YYYY-MM-DD HH:mm')
                : ''
              }
              readOnly
              disabled={disabled}
            />
            {!!value && (
              <Button
                className="absolute-y-center absolute right-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) return;
                  onChange(undefined);
                }}
                variant="ghost"
              >
                <Icon name="RiCloseCircleLine" size={16} />
              </Button>
            )}
          </InputBox>
        </InputField>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          onSelect={(date) => onChange(dayjs(date).toISOString())}
          selected={dayjs(value).toDate()}
          footer={
            mode === 'datetime' && (
              <div className="border-neutral-transparent border-t-8">
                <Divider variant="subtle" />
                <div className="px-2 pt-2">
                  <TimePickerInput
                    date={dayjs(value).toDate()}
                    onDateChange={(date) => onChange(dayjs(date).toISOString())}
                    picker="minutes"
                  />
                </div>
              </div>
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
