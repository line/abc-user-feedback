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
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { FormField } from '@ufb/react';

import { FormInput } from '@/shared/ui/form-inputs';

import type { ProjectInfo } from '../project.type';
import TimezoneSelectBox from './timezone-select-box';

interface IProps {
  type?: 'create' | 'update';
  readOnly?: boolean;
}

const ProjectInfoForm: React.FC<IProps> = (props) => {
  const { type = 'create', readOnly = false } = props;
  const { t } = useTranslation();

  const { control } = useFormContext<ProjectInfo>();

  return (
    <div className="flex flex-col gap-4">
      {type === 'update' && (
        <FormField
          name="id"
          control={control}
          render={({ field }) => (
            <FormInput
              label="ID"
              type="number"
              placeholder={t('v2.placeholder.text')}
              disabled
              {...field}
            />
          )}
        />
      )}
      <FormField
        name="name"
        control={control}
        render={({ field }) => (
          <FormInput
            label="Name"
            placeholder={t('v2.placeholder.text')}
            required
            {...field}
          />
        )}
      />
      <FormField
        name="description"
        control={control}
        render={({ field }) => (
          <FormInput
            label="Description"
            placeholder={t('v2.placeholder.text')}
            disabled={readOnly}
            {...field}
          />
        )}
      />
      <FormField
        name="timezone"
        control={control}
        render={({ field }) => (
          <TimezoneSelectBox disabled={readOnly} {...field} />
        )}
      />
    </div>
  );
};

export default ProjectInfoForm;
