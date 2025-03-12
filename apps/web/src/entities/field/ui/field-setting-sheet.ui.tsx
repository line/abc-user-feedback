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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import {
  Button,
  Checkbox,
  Icon,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Tag,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import { DeleteDialog, SelectInput, TextInput } from '@/shared';

import { FIELD_FORMAT_ICON_MAP, FIELD_FORMAT_LIST } from '../field.constant';
import { fieldInfoSchema } from '../field.schema';
import type { FieldInfo } from '../field.type';

const defaultValues: FieldInfo = {
  description: '',
  format: 'text',
  name: '',
  key: '',
  status: 'ACTIVE',
  property: 'READ_ONLY',
  order: 0,
};

interface IProps extends FormOverlayProps<FieldInfo> {
  fieldRows: FieldInfo[];
}

const FieldSettingSheet: React.FC<IProps> = (props) => {
  const {
    data,
    fieldRows,
    close,
    isOpen,
    onSubmit: onSave,
    onClickDelete,
    disabledUpdate,
    disabledDelete,
  } = props;

  const { t } = useTranslation();

  const [isSameKey, setIsSameKey] = useState(
    data ? data.name === data.key : true,
  );
  const [optionInput, setOptionInput] = useState<string>('');
  const overlay = useOverlay();

  const isOriginalData = useMemo(() => (data ? !!data.id : false), [data]);
  const isEditing = useMemo(() => !!data, [data]);
  const isDefaultField = useMemo(
    () =>
      data?.key === 'id' ||
      data?.key === 'issues' ||
      data?.key === 'createdAt' ||
      data?.key === 'updatedAt',
    [data],
  );

  const otherFields = useMemo(
    () => fieldRows.filter((v) => v.key !== data?.key),
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
    defaultValues: data ?? defaultValues,
  });

  useEffect(() => {
    if (isSameKey) setValue('name', watch('key'), { shouldDirty: true });
  }, [isSameKey, watch('key')]);

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
        { shouldDirty: true },
      );
      setOptionInput('');
      clearErrors('options');
    }
  };

  const removeOption = (targetIndex: number) => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => {
          setValue(
            'options',
            (watch('options') ?? []).filter((_, i) => i !== targetIndex),
            { shouldDirty: true },
          );
        }}
        description={t('main.setting.dialog.delete-option.description')}
      />
    ));
  };

  const onSubmit = async (input: FieldInfo) => {
    const checkDuplicatedKey = otherFields.find((v) => v.key === input.key);
    if (checkDuplicatedKey) {
      setError('key', { message: 'Key is duplicated' });
      return;
    }
    const checkDuplicatedName = otherFields.find((v) => v.name === input.name);
    if (checkDuplicatedName) {
      setError('name', { message: 'Name is duplicated' });
      return;
    }
    if (input.format === 'select' || input.format === 'multiSelect') {
      if (!input.options || input.options.length === 0) {
        setError('options', { message: 'Option is required' });
        return;
      }
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
          <form
            id="field-setting"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TextInput
              label="Key"
              {...register('key')}
              disabled={isOriginalData || isDefaultField}
              error={formState.errors.key?.message}
              required={!data}
              maxLength={20}
            />
            <div className="flex flex-col gap-1.5">
              <TextInput
                label="Display Name"
                {...register('name')}
                error={formState.errors.name?.message}
                disabled={isSameKey || isDefaultField}
                required
                maxLength={20}
              />
              <Checkbox
                checked={isSameKey}
                onCheckedChange={(checked) => setIsSameKey(!!checked)}
                disabled={isDefaultField}
              >
                {t('main.setting.same-key')}
              </Checkbox>
            </div>
            <div>
              <SelectInput
                label="Format"
                onChange={(value) =>
                  setValue('format', value as FieldInfo['format'], {
                    shouldDirty: true,
                  })
                }
                options={FIELD_FORMAT_LIST.map((v) => ({
                  label: v,
                  value: v,
                  icon: FIELD_FORMAT_ICON_MAP[v],
                }))}
                value={watch('format')}
                disabled={isOriginalData || isDefaultField}
                required
              />
              {watch('format') === 'images' && (
                <p className="text-small-normal mt-2">
                  {t('hint.image-format')}
                </p>
              )}
            </div>
            {(watch('format') === 'select' ||
              watch('format') === 'multiSelect') &&
              !isDefaultField && (
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
                    rightButton={
                      <Button onClick={addOption}>
                        {t('button.register')}
                      </Button>
                    }
                    required
                  />
                  {(watch('options') ?? []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {watch('options')?.map((v, i) => (
                        <Tag key={i} radius="large" variant="secondary">
                          {v.name}
                          <Icon
                            name="RiCloseLargeLine"
                            onClick={() => removeOption(i)}
                          />
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              )}
            <SelectInput
              label="Property"
              options={[
                { label: 'Read Only', value: 'READ_ONLY' },
                { label: 'Editable', value: 'EDITABLE' },
              ]}
              value={watch('property')}
              onChange={(value) =>
                setValue('property', value as FieldInfo['property'], {
                  shouldDirty: true,
                })
              }
              disabled={isDefaultField}
              required
            />
            <SelectInput
              label="Status"
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
              value={watch('status')}
              onChange={(value) =>
                setValue('status', value as FieldInfo['status'], {
                  shouldDirty: true,
                })
              }
              disabled={isDefaultField}
              required
            />
            <TextInput
              label="Description"
              {...register('description')}
              required={false}
              maxLength={50}
              disabled={isDefaultField}
            />
          </form>
        </SheetBody>
        <SheetFooter>
          {data && (
            <div className="flex-1">
              <Button
                disabled={isOriginalData || isDefaultField || disabledDelete}
                variant="destructive"
                onClick={() => onClickDelete?.()}
              >
                {t('v2.button.delete')}
              </Button>
            </div>
          )}
          <SheetClose>{t('v2.button.cancel')}</SheetClose>
          <Button
            type="submit"
            form="field-setting"
            disabled={isDefaultField || !formState.isDirty || disabledUpdate}
          >
            {t('v2.button.confirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FieldSettingSheet;
