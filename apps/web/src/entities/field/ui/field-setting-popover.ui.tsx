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
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { IconNameType } from '@ufb/react';
import {
  Button,
  Checkbox,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import { SelectInput, TextInput } from '@/shared';

import { FIELD_FORMAT_LIST } from '../field.constant';
import { fieldInfoSchema } from '../field.schema';
import type { FieldInfo } from '../field.type';
import DeleteFieldOptionPopover from './delete-field-option-popover.ui';

const defaultValues: FieldInfo = {
  description: '',
  format: 'text',
  name: '',
  key: '',
  status: 'ACTIVE',
  property: 'READ_ONLY',
};

interface IProps extends FormOverlayProps<FieldInfo> {
  disabled?: boolean;
  fieldRows: FieldInfo[];
}

const options: {
  label: FieldInfo['format'];
  value: FieldInfo['format'];
  icon: IconNameType;
}[] = [
  { label: 'text', value: 'text', icon: 'RiText' },
  { label: 'keyword', value: 'keyword', icon: 'RiFontSize' },
  { label: 'number', value: 'number', icon: 'RiHashtag' },
  { label: 'date', value: 'date', icon: 'RiCalendarEventLine' },
  { label: 'select', value: 'select', icon: 'RiCheckboxCircleLine' },
  { label: 'multiSelect', value: 'multiSelect', icon: 'RiListCheck' },
  { label: 'images', value: 'images', icon: 'RiImageLine' },
];
const FieldSettingPopover: React.FC<IProps> = (props) => {
  const { data, disabled, fieldRows, close, isOpen, onSubmit: onSave } = props;

  const { t } = useTranslation();

  const [isSameKey, setIsSameKey] = useState(true);
  const [optionInput, setOptionInput] = useState<string>('');

  const isOriginalData = useMemo(() => (data ? !!data.id : false), [data]);
  const isEditing = useMemo(() => !!data, [data]);

  const otherFields = useMemo(
    () => (data ? fieldRows.filter((v) => v.key !== data.key) : fieldRows),
    [data, fieldRows],
  );

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState,
    clearErrors,
  } = useForm<FieldInfo>({
    resolver: zodResolver(fieldInfoSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (data && data.name !== data.key) setIsSameKey(false);
  }, [data]);

  useEffect(() => {
    if (isSameKey) setValue('name', watch('key'));
  }, [data, isSameKey, watch('key')]);

  useEffect(() => {
    reset(data ?? defaultValues);
  }, [data, open]);

  useEffect(() => {
    setOptionInput('');
    setValue('property', 'READ_ONLY');
    setValue('options', undefined);
  }, [watch('format')]);

  const addOption = () => {
    if (optionInput === '') return;
    if (
      watch('options')?.find(
        (v) => v.name.toLowerCase() === optionInput.toLowerCase(),
      )
    ) {
      setError('options', { message: 'Option Name is duplicated' });
    } else {
      setValue(
        'options',
        (watch('options') ?? []).concat({
          name: optionInput,
          key: optionInput,
        }),
      );
      setOptionInput('');
      clearErrors('options');
    }
  };

  const removeOption = (targetIndex: number) => {
    setValue(
      'options',
      (watch('options') ?? []).filter((_, i) => i !== targetIndex),
    );
  };

  const onSubmit = async (input: FieldInfo) => {
    const checkDuplicatedKey = otherFields.find((v) => v.key === input.key);
    if (checkDuplicatedKey) {
      setError('key', { message: 'Key is duplicated' });
      return;
    }
    const checkDuplicatedName = otherFields.find(
      (v) => v.name.toLowerCase() === input.name.toLowerCase(),
    );
    if (checkDuplicatedName) {
      setError('name', { message: 'Name is duplicated' });
      return;
    }
    await onSave({ ...data, ...input });
    reset(defaultValues);
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ?
              t('main.setting.dialog.edit-field.title')
            : t('main.setting.dialog.add-field.title')}
          </SheetTitle>
        </SheetHeader>
        <SheetBody asChild>
          <form onSubmit={handleSubmit(onSubmit)} id="field-setting">
            <TextInput
              label="Key"
              {...register('key')}
              disabled={isOriginalData}
              error={formState.errors.key?.message}
              required={!data}
              maxLength={20}
            />
            <div className="flex flex-col gap-1.5">
              <TextInput
                label="Display Name"
                {...register('name')}
                error={formState.errors.name?.message}
                disabled={isSameKey}
                required
                maxLength={20}
              />
              <Checkbox
                checked={isSameKey}
                onCheckedChange={(checked) => setIsSameKey(!!checked)}
              >
                {t('main.setting.same-key')}
              </Checkbox>
            </div>
            <div>
              <SelectInput
                label="Field Format"
                onChange={(value) =>
                  setValue('format', value as FieldInfo['format'])
                }
                options={options}
                value={watch('format')}
                disabled={isOriginalData}
                required
              />
              {watch('format') === 'images' && (
                <p className="text-primary font-12-regular mt-2">
                  {t('hint.image-format')}
                </p>
              )}
            </div>
            {(watch('format') === 'select' ||
              watch('format') === 'multiSelect') && (
              <div>
                <TextInput
                  label="Select Option"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                  error={formState.errors.options?.message}
                  right={
                    <Button onClick={addOption}>{t('button.register')}</Button>
                  }
                  required
                />

                {(watch('options') ?? []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {watch('options')?.map((v, i) => (
                      <DeleteFieldOptionPopover
                        key={i}
                        option={v}
                        index={i}
                        removeOption={removeOption}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <SelectInput
              label="Field Property"
              options={[
                { label: 'Read Only', value: 'READ_ONLY' },
                { label: 'Editable', value: 'EDITABLE' },
              ]}
              value={watch('property')}
              onChange={(value) =>
                setValue('property', value as FieldInfo['property'])
              }
              required
            />
            <SelectInput
              label="Field Status"
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
              value={watch('status')}
              onChange={(value) =>
                setValue('status', value as FieldInfo['status'])
              }
              required
            />
            <TextInput
              label="Description"
              {...register('description')}
              required={false}
              maxLength={50}
            />
          </form>
        </SheetBody>
        <SheetFooter>
          <SheetClose>{t('button.cancel')}</SheetClose>
          <Button type="submit" form="field-setting">
            {t('button.confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FieldSettingPopover;
