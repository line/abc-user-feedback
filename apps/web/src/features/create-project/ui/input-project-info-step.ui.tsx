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
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { client } from '@/shared';
import { EMPTY_FUNCTION } from '@/shared/utils/empty-function';
import type { ProjectInfo } from '@/entities/project';
import { ProjectInfoForm, projectInfoSchema } from '@/entities/project';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputProjectInfo: React.FC<IProps> = () => {
  const { onChangeInput, input, setEditingStepIndex } = useCreateProjectStore();

  const methods = useForm<ProjectInfo>({
    resolver: zodResolver(projectInfoSchema),
    defaultValues: input.projectInfo,
  });

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const newValues = projectInfoSchema.safeParse(values);
      if (!newValues.data) return;
      onChangeInput('projectInfo', newValues.data);
      setEditingStepIndex(0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const validate = async () => {
    const isValid = await methods.trigger();
    await methods.handleSubmit(EMPTY_FUNCTION)();
    const response = await client.get({
      path: '/api/admin/projects/name-check',
      query: { name: methods.getValues('name') },
    });

    const isDuplicated = response.data as unknown as boolean;

    if (isDuplicated) {
      methods.setError('name', { message: 'Duplicated name' });
      return false;
    }
    return isValid;
  };

  return (
    <CreateProjectInputTemplate validate={validate}>
      <FormProvider {...methods}>
        <ProjectInfoForm type="create" />
      </FormProvider>
    </CreateProjectInputTemplate>
  );
};

export default InputProjectInfo;
