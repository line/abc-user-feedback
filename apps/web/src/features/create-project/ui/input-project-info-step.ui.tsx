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

import type { ProjectInfoFormSchema } from '@/entities/project';
import { ProjectInfoForm, projectInfoFormSchema } from '@/entities/project';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputProjectInfo: React.FC<IProps> = () => {
  const { onChangeInput, input } = useCreateProjectStore();

  const methods = useForm<ProjectInfoFormSchema>({
    resolver: zodResolver(projectInfoFormSchema),
    defaultValues: input.projectInfo,
  });

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const newValues = projectInfoFormSchema.safeParse(values);
      if (!newValues.data) return;
      onChangeInput('projectInfo', newValues.data);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <CreateProjectInputTemplate
      validate={async () => {
        const isValid = await methods.trigger();
        methods.handleSubmit(() => {})();
        return isValid;
      }}
    >
      <FormProvider {...methods}>
        <ProjectInfoForm type="create" />
      </FormProvider>
    </CreateProjectInputTemplate>
  );
};

export default InputProjectInfo;
