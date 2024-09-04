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
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { InputCaption, InputField, InputLabel, TextInput } from '@ufb/react';

import { useWarnIfUnsavedChanges } from '@/shared';

import type { ChannelInfo } from '../channel.type';

interface IProps {
  type?: 'create' | 'update';
  readOnly?: boolean;
}

const ChannelInfoForm: React.FC<IProps> = (props) => {
  const { type = 'create', readOnly = false } = props;

  const { t } = useTranslation();

  const { register, formState } = useFormContext<ChannelInfo>();
  useWarnIfUnsavedChanges(formState.isDirty);

  return (
    <div className="flex flex-col gap-4">
      {type === 'update' && (
        <InputField>
          <InputLabel>ID</InputLabel>
          <TextInput {...register('id')} disabled />
        </InputField>
      )}
      <InputField>
        <InputLabel>
          Name <span className="text-tint-red">*</span>
        </InputLabel>
        <TextInput
          {...register('name')}
          placeholder={t('placeholder', { name: 'Name' })}
          required
          disabled={readOnly}
          error={!!formState.errors.name}
        />
        {formState.errors.name && (
          <InputCaption>{formState.errors.name.message}</InputCaption>
        )}
      </InputField>
      <InputField>
        <InputLabel>Description</InputLabel>
        <TextInput
          {...register('description')}
          placeholder={t('placeholder', { name: 'Description' })}
          disabled={readOnly}
          error={!!formState.errors.description}
        />
        {formState.errors.description && (
          <InputCaption>{formState.errors.description.message}</InputCaption>
        )}
      </InputField>
    </div>
  );
};

export default ChannelInfoForm;
