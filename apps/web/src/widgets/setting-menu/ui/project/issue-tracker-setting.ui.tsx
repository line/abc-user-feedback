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
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { useOAIMutation, useOAIQuery, usePermissions } from '@/shared';
import type { IssueTracker } from '@/entities/issue-tracker';
import { IssueTrackerForm, issueTrackerSchema } from '@/entities/issue-tracker';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
}

const IssueTrackerSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const methods = useForm<IssueTracker>({
    resolver: zodResolver(issueTrackerSchema),
  });

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const { mutate: create, isPending: createPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/issue-tracker',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const { mutate: modify, isPending: modifyPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/issue-tracker',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  useEffect(() => {
    methods.reset(data?.data ?? {});
  }, [data]);

  const onSubmit = (input: IssueTracker) =>
    data ? modify({ data: input as any }) : create({ data: input as any });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.issue-tracker-mgmt')}
      actionBtn={{
        children: t('button.save'),
        disabled:
          !perms.includes('project_tracker_update') ||
          !methods.formState.isDirty ||
          modifyPending ||
          createPending,
        onClick: methods.handleSubmit(onSubmit),
      }}
    >
      <div className="flex items-center rounded border px-6 py-2">
        <p className="flex-1 whitespace-pre-line py-5">
          {t('help-card.issue-tracker')}
        </p>
        <div className="relative h-full w-[160px]">
          <Image
            src="/assets/images/temp.png"
            style={{ objectFit: 'contain' }}
            alt="temp"
            fill
          />
        </div>
      </div>
      <FormProvider {...methods}>
        <IssueTrackerForm />
      </FormProvider>
    </SettingMenuTemplate>
  );
};

export default IssueTrackerSetting;
