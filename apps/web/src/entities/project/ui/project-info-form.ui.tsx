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

import { TextInput } from '@ufb/ui';

import type { ProjectInfoFormSchema } from '../project-info-form.schema';

import { TimezoneSelectBox } from '@/components';

interface IProps {
  type?: 'create' | 'update';
  readOnly?: boolean;
}

const ProjectInfoForm: React.FC<IProps> = ({
  type = 'create',
  readOnly = false,
}) => {
  const { register, setValue, watch, formState } =
    useFormContext<ProjectInfoFormSchema>();

  return (
    <div className="flex flex-col gap-6">
      {type === 'update' && (
        <TextInput {...register('id')} label="Project ID" disabled />
      )}
      <TextInput
        {...register('name')}
        label="Project Name"
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.name?.message}
        isValid={!formState.errors.name}
        required
        disabled={readOnly}
      />
      <TextInput
        {...register('description')}
        label="Project Description"
        isSubmitting={formState.isSubmitting}
        isSubmitted={formState.isSubmitted}
        hint={formState.errors.description?.message}
        isValid={!formState.errors.description}
        disabled={readOnly}
      />
      <TimezoneSelectBox
        value={watch('timezone')}
        onChange={(value) => setValue('timezone', value)}
        disabled={readOnly}
      />
    </div>
  );
};

export default ProjectInfoForm;
