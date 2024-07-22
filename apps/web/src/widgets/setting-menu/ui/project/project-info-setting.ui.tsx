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
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { useOAIMutation, useOAIQuery, usePermissions } from '@/shared';
import type { ProjectInfo } from '@/entities/project';
import { ProjectInfoForm, projectInfoSchema } from '@/entities/project';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
}

const ProjectInfoSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);
  const client = useQueryClient();

  const methods = useForm<ProjectInfo>({
    resolver: zodResolver(projectInfoSchema),
  });

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  useEffect(() => {
    if (!data) return;
    methods.reset(data);
  }, [data]);

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        await client.invalidateQueries({ queryKey: ['/api/admin/projects'] });
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const onSubmit = (input: ProjectInfo) => {
    if (!data) return;
    mutate({ ...data, ...input });
  };

  return (
    <SettingMenuTemplate
      title={t('tenant-setting-menu.tenant-info')}
      actionBtn={{
        form: 'form',
        type: 'submit',
        children: t('button.save'),
        disabled:
          !perms.includes('project_update') ||
          !methods.formState.isDirty ||
          isPending,
      }}
    >
      <form id="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <ProjectInfoForm type="update" />
        </FormProvider>
      </form>
    </SettingMenuTemplate>
  );
};

export default ProjectInfoSetting;
