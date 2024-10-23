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
import { useTranslation } from 'react-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  InputField,
  InputLabel,
} from '@ufb/react';

interface Props {
  label?: string;
  value?: string | null;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  displayValue?: string;
}

const SelectSearchInput: React.FC<Props> = (props) => {
  const {
    onChange,
    value,
    options,
    label,
    required,
    disabled = false,
    displayValue,
  } = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <InputField>
      <InputLabel>
        {label} {required && <span className="text-tint-red">*</span>}
      </InputLabel>
      <Combobox open={open} onOpenChange={setOpen}>
        <ComboboxTrigger disabled={disabled}>
          {displayValue ?? value ?? t('v2.placeholder.select')}
        </ComboboxTrigger>
        <ComboboxContent align="start">
          <ComboboxInput placeholder={t('v2.placeholder.select')} />
          <ComboboxList className="h-[200px]">
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            <ComboboxGroup>
              {options.map((option) => (
                <ComboboxSelectItem
                  key={option.value}
                  value={option.value}
                  checked={option.value === value}
                  onSelect={(value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </ComboboxSelectItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </InputField>
  );
};

export default SelectSearchInput;
