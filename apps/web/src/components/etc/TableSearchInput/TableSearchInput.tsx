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
import { Combobox } from '@headlessui/react';
import { Badge, Icon } from '@ufb/ui';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';

import { PrimitiveFieldFormatEnumType } from '@/types/field.type';
import { removeEmptyValueInObject } from '@/utils/remove-empty-value-in-object';

import TableSearchInputPopover from './TableSearchInputPopover';
import {
  objToQuery,
  objToStr,
  strToObj,
  strValueToObj,
} from './table-search-input.service';

export type SearchItemType = {
  key: string;
  name: string;
} & (
  | {
      format: PrimitiveFieldFormatEnumType;
    }
  | {
      format: 'issue' | 'issue_status' | 'multiSelect' | 'select';
      options: { id?: number; name: string; key: string }[];
    }
);

interface IProps {
  onChangeQuery: (query: Record<string, any>) => void;
  searchItems: SearchItemType[];
  initialQuery?: Record<string, any>;
  defaultQuery?: Record<string, any>;
}

const TableSearchInput: React.FC<IProps> = ({
  onChangeQuery,
  searchItems,
  initialQuery,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const editingName = useMemo(() => {
    if (!inputRef.current || !inputRef.current.selectionEnd) return;
    const { selectionEnd } = inputRef.current;

    const targetInput = inputValue.slice(0, selectionEnd);
    const startIndex = targetInput.lastIndexOf(',');
    const endIndex = inputValue.lastIndexOf(',');

    const value = inputValue.slice(
      startIndex + 1,
      startIndex === endIndex ? inputValue.length : endIndex,
    );
    return value.indexOf(':') === -1
      ? null
      : value.slice(0, value.indexOf(':')).trim();
  }, [inputValue, inputRef]);

  const editingValue = useMemo(() => {
    if (!inputRef.current || !inputRef.current.selectionEnd) return '';
    const { selectionEnd } = inputRef.current;

    const targetInput = inputValue.slice(0, selectionEnd);
    const startIndex = targetInput.lastIndexOf(',');
    const endIndex = inputValue.lastIndexOf(',');

    const value = inputValue.slice(
      startIndex + 1,
      startIndex === endIndex ? inputValue.length : endIndex,
    );
    return value.slice(value.indexOf(':') + 1).trim();
  }, [inputValue, inputRef]);

  const currentObj = useMemo(
    () => strToObj(inputValue, searchItems),
    [inputValue, searchItems],
  );

  useEffect(() => {
    if (!initialQuery) return;
    setInputValue(objToStr(initialQuery, searchItems));
  }, [searchItems]);

  const filterIconCN = useMemo(
    () => (isOpenPopover ? 'text-primary' : 'text-tertiary'),
    [isOpenPopover],
  );

  const openPopover = () => setIsOpenPopover(true);
  const close = () => setIsOpenPopover(false);

  const onInputChangeQuery = (inputObject?: Record<string, any>) => {
    const currentQuery = inputObject
      ? removeEmptyValueInObject({
          ...currentObj,
          ...inputObject,
        })
      : {};

    setInputValue(objToStr(currentQuery, searchItems));
    onChangeQuery(
      removeEmptyValueInObject(objToQuery(currentQuery, searchItems)),
    );
  };

  const reset = () => {
    onInputChangeQuery();
    close();
  };

  return (
    <Combobox
      as="div"
      className="relative w-[400px] h-10"
      onChange={onInputChangeQuery}
    >
      <Icon
        name="Search"
        size={20}
        className={[
          'absolute left-3 top-0 translate-y-1/2',
          inputValue.length > 0 ? 'text-primary' : 'text-tertiary',
        ].join(' ')}
        onClick={() => inputRef.current?.focus()}
      />
      <Combobox.Input
        ref={inputRef}
        className="input pl-9 pr-16 bg-fill-inverse border border-fill-tertiary"
        onChange={(e) => setInputValue(e.currentTarget.value)}
        value={inputValue}
        displayValue={() => inputValue}
        onFocus={() => close()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.target as any).value.length === 0)
            onInputChangeQuery({});
        }}
        placeholder=" "
      />
      {inputValue.length > 0 && (
        <button
          className="absolute p-0 icon-btn right-9 top-0 translate-y-1/2"
          onClick={reset}
        >
          <Icon
            name="CloseCircleFill"
            size={20}
            className={[filterIconCN, 'flex-shrink-0'].join(' ')}
          />
        </button>
      )}
      <button
        className="absolute p-0 icon-btn right-3 top-0 translate-y-1/2"
        onClick={openPopover}
      >
        <Icon
          name="FilterCircleFill"
          size={20}
          className={filterIconCN + ' flex-shrink-0'}
        />
      </button>
      <Combobox.Options className="absolute z-10 bg-primary rounded w-full mt-2 border top-full left-0">
        {!editingName
          ? searchItems
              .filter(
                (v) =>
                  v.format === 'text' ||
                  v.format === 'keyword' ||
                  v.format === 'number',
              )
              .filter((v) => !Object.keys(currentObj).includes(v.key))
              .map((searchItem) => (
                <ComboboxOption
                  key={searchItem.key}
                  editingValue={editingValue}
                  searchItem={searchItem}
                />
              ))
          : searchItems
              .filter((v) => v.name === editingName)
              .map((searchItem) => (
                <ComboboxOption
                  key={searchItem.key}
                  editingValue={editingValue}
                  searchItem={searchItem}
                />
              ))}
      </Combobox.Options>
      {isOpenPopover && (
        <div
          className="absolute z-10 bg-primary rounded w-full mt-2 border top-full left-0"
          ref={popoverRef}
        >
          <TableSearchInputPopover
            columns={searchItems.filter(
              (v) =>
                v.format === 'select' ||
                v.format === 'multiSelect' ||
                v.format === 'date' ||
                v.format === 'issue' ||
                v.format === 'issue_status' ||
                v.format === 'boolean',
            )}
            close={close}
            query={currentObj}
            onSubmit={onInputChangeQuery}
          />
        </div>
      )}
    </Combobox>
  );
};

interface IComboboxOption {
  searchItem: SearchItemType;
  editingValue: string;
}
const ComboboxOption: React.FC<IComboboxOption> = ({
  searchItem,
  editingValue,
}) => {
  const { t } = useTranslation();
  const { format, key, name } = searchItem;
  return (
    <Combobox.Option
      key={key}
      className={({ active }) =>
        ['p-3 cursor-pointer', active ? 'bg-secondary' : 'bg-primary'].join(' ')
      }
      value={{
        [key]: strValueToObj(editingValue, searchItem),
      }}
    >
      <div className="flex justify-between">
        <p className="text-secondary">
          {t('text.select-option', { name: name })}
          <span className="font-12-bold text-primary ml-2">{editingValue}</span>
        </p>
        <Badge type="secondary" color={format === 'text' ? 'blue' : 'green'}>
          {format === 'text' ? t('text.like-search') : t('text.equal-search')}
        </Badge>
      </div>
    </Combobox.Option>
  );
};

export default TableSearchInput;
