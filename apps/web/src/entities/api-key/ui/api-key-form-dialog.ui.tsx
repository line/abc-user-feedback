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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormOverlayProps } from '@/shared';
import { FormDialog, SelectInput, TextInput } from '@/shared';

import { apiKeyFormSchema } from '../api-key.schema';
import type { ApiKeyFormSchema } from '../api-key.type';

interface Props extends FormOverlayProps<ApiKeyFormSchema> {}

const ApiKeyFormDialog: React.FC<Props> = (props) => {
  const {
    data,
    close,
    isOpen,
    onSubmit,
    onClickDelete,
    disabledDelete,
    disabledUpdate,
  } = props;
  const { t } = useTranslation();

  const { register, watch, setValue, handleSubmit, formState } =
    useForm<ApiKeyFormSchema>({
      resolver: zodResolver(apiKeyFormSchema),
      defaultValues: data,
    });

  const { status } = watch();

  return (
    <FormDialog
      isOpen={isOpen}
      close={close}
      title={t('v2.text.name.detail', { name: 'API Key' })}
      submitBtn={{ form: 'apiKeyForm', disabled: disabledUpdate }}
      deleteBtn={{
        disabled: !!disabledDelete,
        onClick: onClickDelete,
      }}
      formState={formState}
    >
      <form
        id="apiKeyForm"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput {...register('value')} label="API Key" disabled />
        <SelectInput
          label="Status"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          value={status}
          onChange={(value) =>
            setValue('status', value as 'active' | 'inactive', {
              shouldDirty: true,
            })
          }
        />
      </form>
    </FormDialog>
  );
};

export default ApiKeyFormDialog;
