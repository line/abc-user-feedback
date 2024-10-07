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
import { useOverlay } from '@toss/use-overlay';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, toast } from '@ufb/react';
import { ErrorCode } from '@ufb/shared';

import {
  DeleteDialog,
  Path,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { ProjectInfo } from '@/entities/project';
import { ProjectInfoForm, projectInfoSchema } from '@/entities/project';

interface IProps {
  projectId: number;
}

const ProjectInfoSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();
  const overlay = useOverlay();

  const methods = useForm<ProjectInfo>({
    resolver: zodResolver(projectInfoSchema),
  });

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

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
        if (error.code === ErrorCode.Project.ProjectInvalidName) {
          methods.setError('name', { message: t('v2.error.duplicated') });
          return;
        }
        toast.error(error.message);
      },
    },
  });

  const { mutateAsync: deleteProject } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects'],
        });
        toast.success(t('v2.toast.success'));
        await router.push(Path.MAIN);
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  const onSubmit = (input: ProjectInfo) => {
    mutate({ ...data, ...input });
  };

  const openDeleteDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={async () => {
          await deleteProject(undefined);
          close();
        }}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('v2.project-setting-menu.project-info')}
      action={
        <>
          <Button
            variant="outline"
            iconL="RiDeleteBinFill"
            onClick={openDeleteDialog}
            disabled={!perms.includes('project_delete')}
          >
            {t('v2.button.name.delete', { name: 'Project' })}
          </Button>
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
