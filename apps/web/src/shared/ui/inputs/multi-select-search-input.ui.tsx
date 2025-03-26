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

import InfiniteScrollArea from '../infinite-scroll-area.ui';

interface Props {
  label?: string;
  value: string[] | null;
  onChange: (value: string[]) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
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
    fetchNextPage,
    hasNextPage,
    inputValue,
    setInputValue,
  } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <InputField>
      {label && (
        <InputLabel>
          {label} {required && <span className="text-tint-red">*</span>}
        </InputLabel>
      )}
      <Combobox open={open} onOpenChange={setOpen}>
        <ComboboxTrigger disabled={disabled} className="font-normal">
          {!!value && value.length > 0 ?
            value.map((v) => (
              <Tag key={v} variant="outline" size="small">
                {v}
              </Tag>
            ))
          : t('v2.placeholder.select')}
          <Icon name="RiArrowDownSLine" />
        </ComboboxTrigger>
        <ComboboxContent align="start">
          <ComboboxInput
            placeholder={t('v2.placeholder.select')}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <ComboboxList maxHeight="200px">
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            <ComboboxGroup>
              {options.map((option) => {
                const isChecked = value?.some((v) => v === option.value);
                return (
                  <ComboboxSelectItem
                    key={option.value}
                    value={option.value}
                    checked={isChecked}
                    onSelect={() => {
                      onChange(
                        isChecked ?
                          (value?.filter((v) => v !== option.value) ?? [])
                        : [...(value ?? []), option.value],
                      );
                      setOpen(false);
                    }}
                  >
                    {option.label}
                  </ComboboxSelectItem>
                );
              })}
            </ComboboxGroup>
            <InfiniteScrollArea
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <InputCaption variant="error">{error}</InputCaption>}
    </InputField>
  );
};

export default MultiSelectSearchInput;
