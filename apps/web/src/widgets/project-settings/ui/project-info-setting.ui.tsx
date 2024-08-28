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
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, toast } from '@ufb/react';

import {
  Path,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { ProjectInfo } from '@/entities/project';
import { ProjectInfoForm, projectInfoSchema } from '@/entities/project';
import { DeleteProjectButton } from '@/features/delete-project';

interface IProps {
  projectId: number;
}

const ProjectInfoSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();

  const methods = useForm<ProjectInfo>({
    resolver: zodResolver(projectInfoSchema),
  });

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects'],
        });
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const { mutate: deleteProject } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await router.push(Path.MAIN);
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects'],
        });
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const onSubmit = (input: ProjectInfo) => {
    if (!data) return;
    mutate({ ...data, ...input });
  };

  return (
    <SettingTemplate
      title={t('v2.project-setting-menu.project-info')}
      action={
        <>
          {data && (
            <DeleteProjectButton
              project={data}
              onClickDelete={() => deleteProject(undefined)}
            />
          )}
          <Button
            form="form"
            type="submit"
            disabled={
              !perms.includes('project_update') ||
              !methods.formState.isDirty ||
              isPending
            }
          >
            {t('v2.button.save')}
          </Button>
        </>
      }
    >
      <form id="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <ProjectInfoForm type="update" />
        </FormProvider>
      </form>
    </SettingTemplate>
  );
};

export default ProjectInfoSetting;
