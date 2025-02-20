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

import {
  Calendar,
  Icon,
  InputBox,
  InputField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TextInput,
} from '@ufb/react';

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

const DatePicker = (props: Props) => {
  const { value, onChange } = props;

  return (
    <Popover>
      <PopoverTrigger>
        <InputField className="w-full">
          <InputBox>
            <Icon
              name="RiCalendarEventLine"
              className="absolute-y-center absolute left-2"
              size={16}
            />
            <TextInput
              placeholder="0000-00-00"
              className="cursor-pointer pl-7"
              value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
              readOnly
            />
          </InputBox>
        </InputField>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          onSelect={(date) => onChange(dayjs(date).toISOString())}
          selected={dayjs(value).toDate()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
