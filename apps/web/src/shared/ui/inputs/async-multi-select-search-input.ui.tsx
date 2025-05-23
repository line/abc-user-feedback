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

import InfiniteScrollArea from '../infinite-scroll-area.ui';

type Option = { label: string; value: string };

interface Props {
  label?: string;
  value: Option[];
  onChange: (value: Option[]) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

const AsyncMultiSelectSearchInput: React.FC<Props> = (props) => {
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const currentOptions = options.filter(
    (option) => !value.some((v) => v.value === option.value),
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
          {value.length > 0 ?
            value.map((v) => (
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
            {value.length > 0 && (
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Selected
                  </span>
                }
              >
                {value.map((v) => (
                  <ComboboxSelectItem
                    key={v.value}
                    value={v.value}
                    keywords={[v.label]}
                    onSelect={(input) => {
                      onChange(value.filter((v) => v.value !== input));
                    }}
                    checked
                  >
                    {v.label}
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
                {currentOptions.map((option) => {
                  const isChecked = value.some((v) => v.value === option.value);
                  return (
                    <ComboboxSelectItem
                      key={option.value}
                      value={option.value}
                      checked={isChecked}
                      keywords={[option.label]}
                      onSelect={() => {
                        onChange(
                          isChecked ?
                            value.filter((v) => v.value !== option.value)
                          : [...value, option],
                        );
                      }}
                    >
                      {option.label}
                    </ComboboxSelectItem>
                  );
                })}
              </ComboboxGroup>
            )}
            <InfiniteScrollArea
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <InputCaption variant="error">{error}</InputCaption>}
    </InputField>
  );
};

export default AsyncMultiSelectSearchInput;
