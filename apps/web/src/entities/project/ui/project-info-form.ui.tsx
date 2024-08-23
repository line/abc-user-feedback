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

import { InputField, InputLabel } from '@ufb/react';

import { TextInput } from '@/shared';

import type { ProjectInfo } from '../project.type';
import TimezoneSelectBox from './timezone-select-box';

interface IProps {
  type?: 'create' | 'update';
  readOnly?: boolean;
}

const ProjectInfoForm: React.FC<IProps> = (props) => {
  const { type = 'create', readOnly = false } = props;
  const { t } = useTranslation();

  const { register, setValue, watch, formState } =
    useFormContext<ProjectInfo>();

  return (
    <div className="flex flex-col gap-4">
      {type === 'update' && (
        <TextInput label="ID" {...register('id')} disabled />
      )}
      <TextInput
        label="Name"
        {...register('name')}
        placeholder={t('placeholder', { name: 'Name' })}
        required
        disabled={readOnly}
        error={formState.errors.name?.message}
      />
      <TextInput
        label="Description"
        {...register('description')}
        placeholder={t('placeholder', { name: 'Description' })}
        required
        disabled={readOnly}
        error={formState.errors.description?.message}
      />
      <InputField>
        <InputLabel>Time Zone</InputLabel>
        <TimezoneSelectBox
          value={watch('timezone')}
          onChange={(value) =>
            value && setValue('timezone', value, { shouldDirty: true })
          }
          disabled={readOnly || type === 'update'}
        />
      </InputField>
    </div>
  );
};

export default ProjectInfoForm;
