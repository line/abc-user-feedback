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

import { TextInput } from '@ufb/ui';

import type { ChannelInfo } from '../channel.type';

interface IProps {
  type?: 'create' | 'update';
  readOnly?: boolean;
}

const ChannelInfoForm: React.FC<IProps> = (props) => {
  const { type = 'create', readOnly = false } = props;

  const { t } = useTranslation();

  const { register, formState } = useFormContext<ChannelInfo>();

  return (
    <div className="flex flex-col gap-6">
      {type === 'update' && (
        <TextInput {...register('id')} label="Channel ID" disabled />
      )}
      <TextInput
        {...register('name')}
        label="Channel Name"
        placeholder={t('placeholder', { name: 'Channel Name' })}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.name?.message}
        isValid={!formState.errors.name}
        required
        disabled={readOnly}
      />
      <TextInput
        {...register('description')}
        label="Channel Description"
        placeholder={t('placeholder', { name: 'Channel Description' })}
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.description?.message}
        isValid={!formState.errors.description}
        disabled={readOnly}
      />
    </div>
  );
};

export default ChannelInfoForm;
