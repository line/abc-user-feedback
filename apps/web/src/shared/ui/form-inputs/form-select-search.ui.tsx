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
import { useEffect, useState } from 'react';
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
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Icon,
} from '@ufb/react';

import type { CommonFormItemType } from '@/shared/types';
import { commandFilter } from '@/shared/utils';

import InfiniteScrollArea from '../infinite-scroll-area.ui';

interface Props extends CommonFormItemType<string> {
  options: { label: string; value: string }[];
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  isFetchingNextPage?: boolean;
  onChange: (value?: string) => void;
}

const FormSelectSearch = ({
  label,
  options,
  value,
  fetchNextPage,
  hasNextPage,
  inputValue,
  setInputValue,
  disabled,
  onChange,
  isFetchingNextPage,
  placeholder,
  required,
}: Props) => {
  const { t } = useTranslation();

  const [currentOption, setCurrentOption] = useState<{
    label: string;
    value: string;
  }>();

  useEffect(() => {
    const option = options.find((v) => v.value === value);
    setCurrentOption(option);
  }, [value]);

  const currentOptions = options.filter(
    (option) => option.value !== currentOption?.value,
  );

  return (
    <FormItem>
      <FormLabel>
        {label} {required && <span className="text-red-500">*</span>}
      </FormLabel>
      <Combobox>
        <FormControl>
          <ComboboxTrigger disabled={disabled} className="w-full font-normal">
            {currentOption?.label ??
              value ??
              placeholder ??
              t('v2.placeholder.select')}
            <Icon name="RiArrowDownSLine" />
          </ComboboxTrigger>
        </FormControl>
        <ComboboxContent align="start" options={{ filter: commandFilter }}>
          <ComboboxInput
            placeholder={t('v2.placeholder.select')}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <ComboboxList maxHeight="200px">
            <ComboboxEmpty>No results found.</ComboboxEmpty>
            {(currentOption?.label ?? value) && (
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Selected
                  </span>
                }
              >
                <ComboboxSelectItem
                  value={currentOption?.label ?? value ?? undefined}
                  onSelect={() => {
                    onChange(undefined);
                    setCurrentOption(undefined);
                  }}
                  checked
                >
                  {currentOption?.label ?? value}
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
                    checked={option.value === value}
                    onSelect={() => {
                      const newValue =
                        option.value === value ? undefined : option.value;
                      setCurrentOption(option);
                      onChange(newValue);
                    }}
                  >
                    {option.label}
                  </ComboboxSelectItem>
                ))}
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
      <FormMessage />
    </FormItem>
  );
};

export default FormSelectSearch;
