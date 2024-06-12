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
import { z } from 'zod';

import {
  Icon,
  Input,
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';

import { DescriptionTooltip, SelectBox } from '@/components/etc';
import {
  FieldFormatEnumList,
  FieldPropertyEnumList,
  FieldStatusEnumList,
} from '@/types/field.type';
import type { FieldRowType } from './FieldSetting';
import OptionDeletePopover from './OptionBadge';

const schema = (otherFields: FieldRowType[]): Zod.ZodType<FieldRowType> =>
  z.object({
    name: z
      .string()
      .min(2)
      .refine(
        (val) =>
          otherFields.every(
            (field) => field.name.toLowerCase() !== val.toLowerCase(),
          ),
        { message: 'Field name is duplicated' },
      ),
    key: z
      .string()
      .min(2)
      .refine(
        (val) =>
          otherFields.every(
            (field) => field.key.toLowerCase() !== val.toLowerCase(),
          ),
        { message: 'Dulicate field key' },
      ),
    description: z.string().nullable(),
    format: z.enum(FieldFormatEnumList),
    property: z.enum(FieldPropertyEnumList),
    status: z.enum(FieldStatusEnumList),
    options: z
      .array(
        z.object({
          id: z.number().optional(),
          name: z.string(),
          key: z.string(),
        }),
      )
      .optional(),
  });

const defaultValues: FieldRowType = {
  description: '',
  format: 'text',
  name: '',
  key: '',
  status: 'ACTIVE',
  property: 'READ_ONLY',
};

interface IProps extends React.PropsWithChildren {
  onSave: (input: FieldRowType) => void;
  data?: FieldRowType;
  disabled?: boolean;
  fieldRows: FieldRowType[];
}

const FieldSettingPopover: React.FC<IProps> = (props) => {
  const { onSave, data, disabled, fieldRows } = props;

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isSameKey, setIsSameKey] = useState(true);

  const isOriginalData = useMemo(() => (data ? !!data.id : false), [data]);
  const isEditing = useMemo(() => !!data, [data]);

  const otherFields = useMemo(
    () => (data ? fieldRows.filter((v) => v.id !== data.id) : fieldRows),
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
  } = useForm<FieldRowType>({
    resolver: zodResolver(schema(otherFields)),
    defaultValues,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (data && data.name !== data.key) setIsSameKey(false);
  }, [data]);
  useEffect(() => {
    if (isSameKey) setValue('name', watch('key'));
  }, [data, isSameKey, watch('key')]);

  const [optionInput, setOptionInput] = useState<string>('');
  const [optionSubmitted, setOptionSubmitted] = useState(false);

  useEffect(() => {
    reset(data ?? defaultValues);
    setOptionSubmitted(false);
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
      setOptionSubmitted(true);
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
      setOptionSubmitted(false);
    }
  };

  const removeOption = (targetIndex: number) => {
    setValue(
      'options',
      (watch('options') ?? []).filter((_, i) => i !== targetIndex),
    );
  };

  const onSubmit = (input: FieldRowType) => {
    onSave({ ...data, ...input });
    reset(defaultValues);
    setOpen(false);
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        modal={isEditing}
        placement={!isEditing ? 'bottom-end' : undefined}
        initialOpen={data?.id === 176}
      >
        <PopoverTrigger asChild>
          {isEditing ?
            <button
              className={[
                'icon-btn icon-btn-sm icon-btn-tertiary',
                open ? 'bg-fill-tertiary' : '',
              ].join(' ')}
              disabled={disabled}
              onClick={() => setOpen(true)}
            >
              <Icon name="EditFill" />
            </button>
          : <button
              className={[
                'btn btn-sm btn-secondary',
                open ? 'bg-fill-tertiary' : '',
              ].join(' ')}
              disabled={disabled}
              onClick={() => setOpen(true)}
            >
              {t('main.setting.dialog.add-field.title')}
            </button>
          }
        </PopoverTrigger>
        <PopoverContent isPortal>
          <PopoverHeading>
            {isEditing ?
              t('main.setting.dialog.edit-field.title')
            : t('main.setting.dialog.add-field.title')}
          </PopoverHeading>
          <form
            className="m-5 w-[520px] space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Key"
              {...register('key')}
              disabled={isOriginalData}
              isSubmitted={formState.isSubmitted}
              isSubmitting={formState.isSubmitting}
              isValid={!formState.errors.key}
              hint={formState.errors.key?.message}
              required={!data}
              maxLength={20}
            />
            <div>
              <Input
                label="Display Name"
                {...register('name')}
                isSubmitted={formState.isSubmitted}
                isSubmitting={formState.isSubmitting}
                isValid={!formState.errors.name}
                hint={formState.errors.name?.message}
                disabled={isSameKey}
                required
                maxLength={20}
              />
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  className="checkbox my-2 mr-2"
                  checked={isSameKey}
                  onChange={(e) => setIsSameKey(e.target.checked)}
                />
                {t('main.setting.same-key')}
              </label>
            </div>
            <div>
              <SelectBox
                label="Field Format"
                onChange={(value) =>
                  value?.key && setValue('format', value?.key)
                }
                options={FieldFormatEnumList.map((v) => ({ key: v, name: v }))}
                value={{ key: watch('format'), name: watch('format') }}
                isDisabled={isOriginalData}
                getOptionValue={(option) => option.key}
                getOptionLabel={(option) => option.name}
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
                <Input
                  label="Select Option"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addOption();
                    }
                  }}
                  rightChildren={
                    <button
                      type="button"
                      className="btn btn-primary btn-xs btn-rounded"
                      onClick={addOption}
                    >
                      {t('button.register')}
                    </button>
                  }
                  isValid={!formState.errors.options}
                  isSubmitted={optionSubmitted}
                  hint={formState.errors.options?.message}
                />

                {(watch('options') ?? []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {watch('options')?.map((v, i) => (
                      <OptionDeletePopover
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
            <div>
              <div className="flex items-center">
                <span className="font-10-regular w-[120px]">
                  Field Property
                  <DescriptionTooltip
                    description={t('tooltip.field-property')}
                  />
                </span>
                <label className="radio-label h-[36px] w-[120px]">
                  <input
                    type="radio"
                    name="radio-type"
                    className="radio radio-sm"
                    onChange={() => setValue('property', 'READ_ONLY')}
                    checked={watch('property') === 'READ_ONLY'}
                  />
                  Read Only
                </label>
                <label className="radio-label h-[36px] w-[120px]">
                  <input
                    type="radio"
                    name="radio-type"
                    className="radio radio-sm"
                    onChange={() => setValue('property', 'EDITABLE')}
                    checked={watch('property') === 'EDITABLE'}
                    disabled={watch('format') === 'images'}
                  />
                  Editable
                </label>
              </div>
              <div className="flex items-center">
                <span className="font-10-regular w-[120px]">
                  Field Status
                  <DescriptionTooltip description={t('tooltip.field-status')} />
                </span>
                <label className="radio-label h-[36px] w-[120px]">
                  <input
                    type="radio"
                    name="radio-status"
                    className="radio radio-sm"
                    onChange={(e) =>
                      e.target.checked ? setValue('status', 'ACTIVE') : {}
                    }
                    checked={watch('status') === 'ACTIVE'}
                  />
                  {t('main.setting.field-status.active')}
                </label>
                <label className="radio-label h-[36px] w-[120px]">
                  <input
                    type="radio"
                    name="radio-status"
                    className="radio radio-sm"
                    onChange={(e) =>
                      e.target.checked ? setValue('status', 'INACTIVE') : {}
                    }
                    checked={watch('status') === 'INACTIVE'}
                  />
                  {t('main.setting.field-status.inactive')}
                </label>
              </div>
            </div>
            <Input
              label="Description"
              {...register('description')}
              required={false}
              maxLength={50}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-secondary min-w-[80px]"
                onClick={() => setOpen(false)}
              >
                {t('button.cancel')}
              </button>
              <button className="btn btn-primary min-w-[80px]">
                {t('button.confirm')}
              </button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default FieldSettingPopover;
