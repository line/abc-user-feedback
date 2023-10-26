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
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import { SettingMenuTemplate } from '@/components';
import {
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useProjects,
} from '@/hooks';

interface IForm {
  name: string;
  description: string | null;
}
const scheme: Zod.ZodType<IForm> = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

interface IProps extends React.PropsWithChildren {
  projectId: number;
}
const ProjectInfoSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { refetch: refetchProjects } = useProjects();
  const { data, refetch } = useOAIQuery({
    path: '/api/projects/{projectId}',
    variables: { projectId },
  });
  const { reset, register, handleSubmit, formState } = useForm<IForm>({
    resolver: zodResolver(scheme),
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/projects/{projectId}',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        toast.positive({ title: t('toast.save') });
        refetch();
        refetchProjects();
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    reset(data);
  }, [data]);

  const onSubmit = (input: IForm) => {
    if (!data) return;
    mutate({ ...data, ...input });
  };

  return (
    <SettingMenuTemplate
      title={t('main.setting.subtitle.project-info')}
      actionBtn={{
        children: t('button.save'),
        onClick: handleSubmit(onSubmit),
        form: 'form',
        type: 'submit',
        disabled:
          !perms.includes('project_update') || !formState.isDirty || isPending,
      }}
    >
      <form id="form" className="flex flex-col gap-6">
        <TextInput value={data?.id} label="Project ID" disabled />
        <TextInput
          {...register('name')}
          label="Project Name"
          required
          disabled={!perms.includes('project_update')}
        />
        <TextInput
          {...register('description')}
          label="Project Description"
          disabled={!perms.includes('project_update')}
        />
      </form>
    </SettingMenuTemplate>
  );
};

export default ProjectInfoSetting;
