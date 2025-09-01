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
import { useTranslation } from 'next-i18next';

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

import { commandFilter } from '@/shared/utils';

interface Props {
  value?: string | null;
  onChange?: (value: string | null) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  inputValue?: string;
  setInputValue?: (value: string) => void;
}

const SelectSearchInput: React.FC<Props> = (props) => {
  const {
    onChange,
    value,
    options,
    disabled = false,
    inputValue,
    setInputValue,
  } = props;

  const { t } = useTranslation();

  const currentOptions = options.filter((option) => option.value !== value);
  const selectedValue = options.find((option) => option.value === value);

  return (
    <Combobox>
      <ComboboxTrigger disabled={disabled} className="w-full font-normal">
        {selectedValue?.label ?? t('v2.placeholder.select')}
        <Icon name="RiArrowDownSLine" />
      </ComboboxTrigger>
      <ComboboxContent align="start" options={{ filter: commandFilter }}>
        <ComboboxInput
          placeholder={t('v2.placeholder.select')}
          value={inputValue}
          onValueChange={setInputValue}
        />
        <ComboboxList maxHeight="200px">
          <ComboboxEmpty>No results found.</ComboboxEmpty>
          {selectedValue && (
            <ComboboxGroup
              heading={
                <span className="text-neutral-tertiary text-base-normal">
                  Selected
                </span>
              }
            >
              <ComboboxSelectItem
                value={selectedValue.value}
                keywords={[selectedValue.label]}
                onSelect={() => onChange?.(null)}
                checked
              >
                {selectedValue.label}
              </ComboboxSelectItem>
            </ComboboxGroup>
          )}
          {currentOptions.length > 0 && (
            <ComboboxGroup
              heading={
                <span className="text-neutral-tertiary text-base-normal">
                  List
                </span>
              }
            >
              {currentOptions.map((option) => (
                <ComboboxSelectItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  checked={option.value === value}
                  onSelect={(input) =>
                    onChange?.(input === value ? null : input)
                  }
                >
                  {option.label}
                </ComboboxSelectItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default SelectSearchInput;
