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

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, toast } from '@ufb/react';

import {
  SettingAlert,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useWarnIfUnsavedChanges,
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
    queryOptions: { refetchOnWindowFocus: false },
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

  useWarnIfUnsavedChanges(methods.formState.isDirty);

  useEffect(() => {
    methods.reset(data?.data);
  }, [data]);

  const onSubmit = (input: IssueTracker) => {
    if (input.ticketDomain?.endsWith('/')) {
      input.ticketDomain = input.ticketDomain.slice(0, -1);
    }
    if (data) {
      modify({ data: input });
      return;
    }
    create({ data: input });
  };

  return (
    <SettingTemplate
      title={t('v2.project-setting-menu.issue-tracker-mgmt')}
      action={
        <Button
          type="submit"
          disabled={
            !perms.includes('project_tracker_update') ||
            !methods.formState.isDirty
          }
          loading={createPending || modifyPending}
          form="issue-tracker"
        >
          {t('button.save')}
        </Button>
      }
    >
      <SettingAlert description={t('help-card.issue-tracker')} />
      <FormProvider {...methods}>
        <form id="issue-tracker" onSubmit={methods.handleSubmit(onSubmit)}>
          <IssueTrackerForm />
        </form>
      </FormProvider>
    </SettingTemplate>
  );
};

export default IssueTrackerSetting;
