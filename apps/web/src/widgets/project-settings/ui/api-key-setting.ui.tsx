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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { Button, toast } from '@ufb/react';

import {
  client,
  HelpCardDocs,
  SettingAlert,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/shared';
import type { ApiKeyUpdateType } from '@/entities/api-key';
import { ApiKeyTable } from '@/entities/api-key';

interface IProps {
  projectId: number;
}

const ApiKeySetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const perms = usePermissions(projectId);

  const { data, refetch, status } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/api-keys',
    variables: { projectId, limit: 1000 },
  });

  const { mutateAsync: softDelete } = useMutation({
    mutationFn: async (input: { apiKeyId: number }) => {
      await client.delete({
        path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}/soft',
        pathParams: { projectId, apiKeyId: input.apiKeyId },
      });
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: recover } = useMutation({
    mutationFn: async (input: { apiKeyId: number }) => {
      await client.delete({
        path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}/recover',
        pathParams: { projectId, apiKeyId: input.apiKeyId },
      });
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: deleteApiKey } = useMutation({
    mutationFn: async (input: { apiKeyId: number }) => {
      await client.delete({
        path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}',
        pathParams: { projectId, apiKeyId: input.apiKeyId },
      });
    },
    async onSuccess() {
      await refetch();
      await queryClient.invalidateQueries({
        queryKey: ['/api/admin/projects/{projectId}/api-keys'],
      });
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { mutateAsync: createApiKey, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/api-keys',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const UpdateMutation: Record<
    ApiKeyUpdateType,
    (apiKeyId: number) => Promise<void>
  > = {
    recover: (apiKeyId) => recover({ apiKeyId }),
    softDelete: (apiKeyId) => softDelete({ apiKeyId }),
  };

  return (
    <SettingTemplate
      title={t('v2.project-setting-menu.api-key-mgmt')}
      action={
        <Button
          className="min-w-[120px]"
          disabled={!perms.includes('project_apikey_create')}
          loading={isPending}
          onClick={() => createApiKey({ value: undefined })}
        >
          {t('v2.button.name.create', { name: 'API Key' })}
        </Button>
      }
    >
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <ApiKeyTable
        isLoading={status === 'pending'}
        data={data?.items ?? []}
        onClickDelete={(id) => deleteApiKey({ apiKeyId: id })}
        onClickUpdate={(type, id) => UpdateMutation[type](id)}
        createButton={
          <Button
            disabled={!perms.includes('project_apikey_create')}
            loading={isPending}
            onClick={() => createApiKey({ value: undefined })}
          >
            {t('v2.button.create')}
          </Button>
        }
        disabledUpdate={!perms.includes('project_apikey_update')}
        disabledDelete={!perms.includes('project_apikey_delete')}
      />
    </SettingTemplate>
  );
};

export default ApiKeySetting;
