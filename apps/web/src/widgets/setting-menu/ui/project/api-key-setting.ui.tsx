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

import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import {
  client,
  HelpCardDocs,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { ApiKeyUpdateType } from '@/entities/api-key';
import { ApiKeyTable } from '@/entities/api-key';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
}

const ApiKeySetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/api-keys',
    variables: { projectId },
  });

  const { mutate: createApiKey } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/api-keys',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.positive({ title: t('toast.add') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const { mutate: softDelete } = useMutation({
    mutationFn: (input: { apiKeyId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}/soft',
        pathParams: { projectId, apiKeyId: input.apiKeyId },
      }),
    async onSuccess() {
      await refetch();
      toast.positive({ title: t('toast.inactive') });
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
    },
  });

  const { mutate: recover } = useMutation({
    mutationFn: (input: { apiKeyId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}/recover',
        pathParams: { projectId, apiKeyId: input.apiKeyId },
      }),
    async onSuccess() {
      await refetch();
      toast.positive({ title: t('toast.active') });
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
    },
  });

  const { mutate: deleteApiKey } = useMutation({
    mutationFn: (input: { apiKeyId: number }) =>
      client.delete({
        path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}',
        pathParams: { projectId, apiKeyId: input.apiKeyId },
      }),
    async onSuccess() {
      await refetch();
      toast.negative({ title: t('toast.delete') });
    },
    onError(error) {
      toast.negative({ title: error?.message ?? 'Error' });
    },
  });

  const UpdateMutation: Record<ApiKeyUpdateType, (apiKeyId: number) => void> = {
    recover: (apiKeyId) => recover({ apiKeyId }),
    softDelete: (apiKeyId) => softDelete({ apiKeyId }),
  };

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.api-key-mgmt')}
      actionBtn={{
        children: t('main.setting.button.create-api-key'),
        onClick: () => createApiKey({ value: undefined }),
        disabled: !perms.includes('project_apikey_create'),
      }}
    >
      <div className="flex items-center rounded border px-6 py-2">
        <p className="flex-1 whitespace-pre-line py-5">
          <HelpCardDocs i18nKey="help-card.api-key" />
        </p>
        <div className="relative h-full w-[90px]">
          <Image
            src="/assets/images/api-key-help.svg"
            style={{ objectFit: 'contain' }}
            alt="temp"
            fill
          />
        </div>
      </div>
      <ApiKeyTable
        apiKeys={data?.items ?? []}
        onClickDelete={(id) => deleteApiKey({ apiKeyId: id })}
        onClickUpdate={(type, id) => UpdateMutation[type](id)}
      />
    </SettingMenuTemplate>
  );
};

export default ApiKeySetting;
