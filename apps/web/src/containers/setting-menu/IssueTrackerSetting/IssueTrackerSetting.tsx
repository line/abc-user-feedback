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
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import {
  SelectBox,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';

import { SettingMenuTemplate } from '@/components';

interface IForm {
  ticketDomain: string;
  ticketKey: string;
}
const scheme: Zod.ZodType<IForm> = z.object({
  ticketDomain: z.string().url(),
  ticketKey: z.string(),
});

interface IProps extends React.PropsWithChildren {
  projectId: number;
}
const IssueTrackerSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { register, watch, handleSubmit, formState, reset } = useForm<IForm>({
    resolver: zodResolver(scheme),
  });

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  useEffect(() => {
    if (!data) return;
    reset({ ...data.data });
  }, [data]);

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

  const onSubmit = (input: IForm) =>
    data ? modify({ data: input as any }) : create({ data: input as any });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.issue-tracker-mgmt')}
      actionBtn={{
        children: t('button.save'),
        disabled:
          !perms.includes('project_tracker_update') ||
          !formState.isDirty ||
          modifyPending ||
          createPending,
        onClick: handleSubmit(onSubmit),
        form: 'form',
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
      <form id="form" className="flex flex-col gap-6">
        <SelectBox
          options={[{ value: 'jira', label: 'JIRA' }]}
          value={{ value: 'jira', label: 'JIRA' }}
          label="Issue Tracking System"
        />
        <TextInput
          {...register('ticketDomain')}
          label="Base URL"
          placeholder="example.com"
          isValid={!formState.errors.ticketDomain}
          hint={formState.errors.ticketDomain?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          disabled={!perms.includes('project_tracker_update')}
        />
        <TextInput
          {...register('ticketKey')}
          label="Project Key"
          placeholder="PROJECT"
          isValid={!formState.errors.ticketKey}
          hint={formState.errors.ticketKey?.message}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          disabled={!perms.includes('project_tracker_update')}
        />
        <TextInput
          label="Ticket URL"
          value={`${watch('ticketDomain')}/browse/${watch(
            'ticketKey',
          )}-{Number}`}
          disabled
        />
      </form>
    </SettingMenuTemplate>
  );
};

export default IssueTrackerSetting;
