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

import { useState } from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

interface Props {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const ComboboxSelectInput: React.FC<Props> = (props) => {
  const { options, value, onChange, placeholder } = props;
  const [open, setOpen] = useState(false);
  return (
    <Combobox open={open} onOpenChange={setOpen}>
      <ComboboxTrigger className="!text-base-normal w-full">
        {value ?
          options.find((option) => option.value === value)?.label
        : placeholder}
        <Icon name="RiArrowDownSFill" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxList>
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          <ComboboxGroup>
            {options.map((option) => (
              <ComboboxSelectItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange?.(option.value);
                  setOpen(false);
                }}
                checked={option.value === value}
              >
                {option.label}
              </ComboboxSelectItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default ComboboxSelectInput;
