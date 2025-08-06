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
  Caption,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
  InputField,
  Label,
} from '@ufb/react';

import { commandFilter } from '@/shared/utils';

import InfiniteScrollArea from '../infinite-scroll-area.ui';

type Option = { label: string; value: string };

interface Props {
  label?: string;
  value?: Option | null;
  onChange?: (value: Option | null) => void;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage?: boolean;
}

const AsyncSelectSearchInput: React.FC<Props> = (props) => {
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
    isFetchingNextPage,
  } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const currentOptions = options.filter(
    (option) => option.value !== value?.value,
  );

  return (
    <InputField>
      {label && (
        <Label>
          {label} {required && <span className="text-tint-red">*</span>}
        </Label>
      )}
      <Combobox open={open} onOpenChange={setOpen}>
        <ComboboxTrigger disabled={disabled} className="font-normal">
          {value?.label ?? t('v2.placeholder.select')}
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
            {value && (
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Selected
                  </span>
                }
              >
                <ComboboxSelectItem
                  value={value.value}
                  keywords={[value.label]}
                  onSelect={() => onChange?.(null)}
                  checked
                >
                  {value.label}
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
                    checked={option.value === value?.value}
                    onSelect={(input) =>
                      onChange?.(input === value?.value ? null : option)
                    }
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
      {error && <Caption variant="error">{error}</Caption>}
    </InputField>
  );
};

export default AsyncSelectSearchInput;
