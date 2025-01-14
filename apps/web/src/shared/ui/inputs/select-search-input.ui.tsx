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
import { useEffect, useRef, useState } from 'react';
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
  Icon,
  InputCaption,
  InputField,
  InputLabel,
} from '@ufb/react';

interface Props {
  label?: string;
  value?: string | null;
  onChange?: (value?: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  inputValue?: string;
  setInputValue?: (value: string) => void;
  isFetching?: boolean;
}

const SelectSearchInput: React.FC<Props> = (props) => {
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
    isFetching,
  } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [currentOption, setCurrentOption] = useState<{
    label: string;
    value: string;
  }>();

  useEffect(() => {
    const option = options.find((v) => v.value === value);
    setCurrentOption(option);
  }, []);

  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        void fetchNextPage?.();
      });
    });

    if (moreRef.current) {
      observer.observe(moreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <InputField>
      {label && (
        <InputLabel>
          {label} {required && <span className="text-tint-red">*</span>}
        </InputLabel>
      )}
      <Combobox open={open} onOpenChange={setOpen}>
        <ComboboxTrigger disabled={disabled} className="font-normal">
          {currentOption?.label ?? value ?? t('v2.placeholder.select')}
          <Icon name="RiArrowDownSLine" />
        </ComboboxTrigger>
        <ComboboxContent align="start">
          <ComboboxInput
            placeholder={t('v2.placeholder.select')}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <ComboboxList className="max-h-[200px]">
            {isFetching ?
              <div className="combobox-item">Loading...</div>
            : <ComboboxEmpty>No results found.</ComboboxEmpty>}
            <ComboboxGroup>
              {options.map((option) => (
                <ComboboxSelectItem
                  key={option.value}
                  value={option.value}
                  checked={option.value === value}
                  onSelect={() => {
                    const newValue =
                      option.value === value ? undefined : option.value;
                    setCurrentOption(option);
                    onChange?.(newValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </ComboboxSelectItem>
              ))}
            </ComboboxGroup>
            {hasNextPage && <div ref={moreRef} className="h-2" />}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {error && <InputCaption variant="error">{error}</InputCaption>}
    </InputField>
  );
};

export default SelectSearchInput;
