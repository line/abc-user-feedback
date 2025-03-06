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
import { useTranslation } from 'next-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

interface Props {
  children?: React.ReactNode;
  error?: string;
  onSelectValue: (value: string) => void;
  clearError?: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ComboboxInputBox: React.FC<Props> = (props) => {
  const {
    error,
    children,
    clearError,
    onSelectValue,
    inputValue,
    setInputValue,
    disabled,
    placeholder,
  } = props;
  const { t } = useTranslation();
  return (
    <Combobox>
      <ComboboxTrigger disabled={disabled}>{children}</ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={(value) => {
            if (error) clearError?.();
            setInputValue(value);
          }}
        />
        <ComboboxEmpty>{t('v2.placeholder.text')}</ComboboxEmpty>
        <ComboboxList>
          <ComboboxGroup>
            {error ?
              <ComboboxItem value={inputValue}>
                <div className="text-tint-red flex items-center gap-1">
                  <Icon name="RiErrorWarningLine" size={16} />
                  {error}
                </div>
              </ComboboxItem>
            : inputValue ?
              <ComboboxItem
                onSelect={(value) => onSelectValue(value)}
                className="justify-between"
                value={inputValue}
              >
                {inputValue}
                <span className="text-neutral-tertiary text-small-normal">
                  Add
                </span>
              </ComboboxItem>
            : <></>}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default ComboboxInputBox;
