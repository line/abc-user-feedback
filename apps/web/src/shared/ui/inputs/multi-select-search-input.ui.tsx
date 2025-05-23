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
import { useState } from 'react';
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
  InputCaption,
  InputField,
  InputLabel,
  Tag,
} from '@ufb/react';

import { commandFilter } from '@/shared/utils';

interface Props {
  label?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  inputValue?: string;
  setInputValue?: (value: string) => void;
}

const MultiSelectSearchInput: React.FC<Props> = (props) => {
  const {
    onChange,
    value,
    options,
    label,
    required,
    disabled = false,
    error,
    inputValue,
    setInputValue,
  } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const currentOptions = options.filter(
    (option) => !value?.some((v) => v === option.value),
  );
  const currentValues = options.filter((option) =>
    value?.some((v) => v === option.value),
  );

  return (
    <InputField>
      {label && (
        <InputLabel>
          {label} {required && <span className="text-tint-red">*</span>}
        </InputLabel>
      )}
      <Combobox open={open} onOpenChange={setOpen}>
        <ComboboxTrigger
          disabled={disabled}
          className="scrollbar-hide overflow-auto font-normal"
        >
          {currentValues.length > 0 ?
            currentValues.map((v) => (
              <Tag key={v.value} variant="outline" size="small">
                {v.label}
              </Tag>
            ))
          : t('v2.placeholder.select')}
          <Icon name="RiArrowDownSLine" />
        </ComboboxTrigger>
        <ComboboxContent align="start" commandProps={{ filter: commandFilter }}>
          <ComboboxInput
            placeholder={t('v2.placeholder.select')}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <ComboboxList maxHeight="200px">
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            {currentValues.length > 0 && (
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Selected
                  </span>
                }
              >
                {currentValues.map((currentValue) => (
                  <ComboboxSelectItem
                    key={currentValue.value}
                    value={currentValue.value}
                    keywords={[currentValue.label]}
                    onSelect={(input) => {
                      onChange?.(
                        currentValues
                          .filter((v) => v.value !== input)
                          .map((v) => v.value),
                      );
                    }}
                    checked
                  >
                    {currentValue.label}
                  </ComboboxSelectItem>
                ))}
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
                {options
                  .filter((option) => !value?.some((v) => v === option.value))
                  .map((option) => {
                    const isChecked = value?.some((v) => v === option.value);
                    return (
                      <ComboboxSelectItem
                        key={option.value}
                        value={option.value}
                        checked={isChecked}
                        keywords={[option.label]}
                        onSelect={() => {
                          onChange?.(
                            isChecked ?
                              (value?.filter((v) => v !== option.value) ?? [])
                            : [...(value ?? []), option.value],
                          );
                        }}
                      >
                        {option.label}
                      </ComboboxSelectItem>
                    );
                  })}
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <InputCaption variant="error">{error}</InputCaption>}
    </InputField>
  );
};

export default MultiSelectSearchInput;
