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
import { useTranslation } from 'react-i18next';

import { Button, toast } from '@ufb/react';

import {
  SettingAlert,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { IssueTracker } from '@/entities/issue-tracker';
import { IssueTrackerForm, issueTrackerSchema } from '@/entities/issue-tracker';

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
        toast.success(t('v2.toast.success'));
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
        toast.success(t('v2.toast.success'));
      },
    },
  });

  useEffect(() => {
    methods.reset(data?.data ?? {});
  }, [data]);

  const onSubmit = (input: IssueTracker) =>
    data ? modify({ data: input }) : create({ data: input });

  return (
    <SettingTemplate
      title={t('project-setting-menu.issue-tracker-mgmt')}
      action={
        <Button
          disabled={
            !perms.includes('project_tracker_update') ||
            !methods.formState.isDirty ||
            modifyPending ||
            createPending
          }
          onClick={methods.handleSubmit(onSubmit)}
        >
          {t('button.save')}
        </Button>
      }
    >
      <SettingAlert description={t('help-card.issue-tracker')} />
      <FormProvider {...methods}>
        <IssueTrackerForm />
      </FormProvider>
    </SettingTemplate>
  );
};

export default IssueTrackerSetting;
