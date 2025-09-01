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
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import {
  Button,
  Caption,
  Checkbox,
  FormField,
  Icon,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  Tag,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  DeleteDialog,
  Path,
  SelectInput,
  TextInput,
  useOAIQuery,
} from '@/shared';
import {
  FormInput,
  FormMultiSelect,
  FormSelect,
} from '@/shared/ui/form-inputs';

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
  aiFieldTargetKeys: null,
  aiFieldTemplateId: null,
  aiFieldAutoProcessing: null,
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

  const router = useRouter();
  const projectId = parseInt(router.query.projectId as string, 10);
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

  const methods = useForm<FieldInfo>({
    resolver: zodResolver(fieldInfoSchema),
    defaultValues: data ?? defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState,
    clearErrors,
    control,
  } = methods;

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
      return;
    }
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

  const { data: aiIntegration } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });

  const { data: templates } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/fieldTemplates',
    variables: { projectId },
  });
  useEffect(() => {
    if (!data) return;
    if (data.format === 'aiField' && !data.aiFieldTemplateId) {
      setError('aiFieldTemplateId', { message: 'Template is required' });
    }
  }, [data]);

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
          <FormProvider {...methods}>
            <form
              id="field-setting"
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-[450px] flex-col gap-4"
            >
              <FormField
                control={control}
                name="key"
                render={({ field }) => (
                  <FormInput
                    label="Key"
                    {...field}
                    disabled={isOriginalData || isDefaultField}
                    required={!data}
                  />
                )}
              />

              <div className="flex flex-col gap-1.5">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormInput
                      label="Display Name"
                      {...field}
                      disabled={isSameKey || isDefaultField}
                      required
                    />
                  )}
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
                  onChange={(value) => {
                    setValue('format', value as FieldInfo['format'], {
                      shouldDirty: true,
                    });
                    setValue('options', undefined);
                    setValue('aiFieldTemplateId', undefined);
                    setValue('aiFieldTargetKeys', undefined);
                    setValue('aiFieldAutoProcessing', undefined);
                  }}
                  options={FIELD_FORMAT_LIST.map((v) => ({
                    label: v,
                    value: v,
                    icon: FIELD_FORMAT_ICON_MAP[v],
                    disabled: v === 'aiField' && !aiIntegration?.apiKey,
                  }))}
                  value={watch('format')}
                  disabled={isOriginalData || isDefaultField}
                  required
                />
                {watch('format') === 'images' && (
                  <Caption>{t('hint.image-format')}</Caption>
                )}
              </div>
              {(watch('format') === 'select' ||
                watch('format') === 'multiSelect') &&
                !isDefaultField && (
                  <div>
                    <TextInput
                      label="Select Option"
                      value={optionInput}
                      maxLength={20}
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
              {watch('format') === 'aiField' && (
                <>
                  <div>
                    <FormField
                      control={control}
                      name="aiFieldTemplateId"
                      render={({ field }) => (
                        <>
                          <FormSelect
                            label="Template"
                            options={
                              templates?.map(({ title, id }) => ({
                                label: title,
                                value: id.toString(),
                              })) ?? []
                            }
                            disabled={isDefaultField}
                            value={field.value?.toString()}
                            onChange={(value) => {
                              field.onChange(value ? parseInt(value) : null);
                              clearErrors('aiFieldTemplateId');
                            }}
                            required
                          />
                          <Link
                            target="_blank"
                            href={{
                              pathname: Path.SETTINGS,
                              query: {
                                menu: 'generative-ai',
                                subMenu: 'field-template',
                                projectId,
                              },
                            }}
                          >
                            <Caption className="mt-1 flex items-center gap-0.5">
                              <Icon name="RiExternalLinkFill" size={16} />
                              Go to Template Settings
                            </Caption>
                          </Link>
                        </>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name="aiFieldTargetKeys"
                    render={({ field }) => (
                      <FormMultiSelect
                        label="Target Field"
                        options={fieldRows
                          .filter(({ key }) => key !== watch('key'))
                          .map(({ key, name }) => ({
                            label: name,
                            value: key,
                          }))}
                        {...field}
                        disabled={isDefaultField}
                        required
                      />
                    )}
                  />
                  <Card size="sm">
                    <CardHeader
                      action={
                        <Switch
                          checked={watch('aiFieldAutoProcessing') ?? false}
                          onCheckedChange={(checked) =>
                            setValue('aiFieldAutoProcessing', checked, {
                              shouldDirty: true,
                            })
                          }
                        />
                      }
                    >
                      <CardTitle>AI Field Automation</CardTitle>
                      <CardDescription>
                        {t('v2.description.ai-field-template-auto-processing')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </>
              )}
              <FormField
                control={control}
                name="property"
                render={({ field }) => (
                  <FormSelect
                    label="Property"
                    options={[
                      { label: 'Read Only', value: 'READ_ONLY' },
                      { label: 'Editable', value: 'EDITABLE' },
                    ]}
                    {...field}
                    disabled={isDefaultField}
                    required
                  />
                )}
              />
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormSelect
                    label="Status"
                    options={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Inactive', value: 'INACTIVE' },
                    ]}
                    {...field}
                    disabled={isDefaultField}
                    required
                  />
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormInput
                    label="Description"
                    {...field}
                    disabled={isDefaultField}
                  />
                )}
              />
            </form>
          </FormProvider>
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
