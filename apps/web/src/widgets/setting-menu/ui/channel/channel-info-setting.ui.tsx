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
import type { ChannelInfo } from '@/entities/channel';
import { ChannelInfoForm, channelInfoSchema } from '@/entities/channel';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
  channelId: number;
}

const ChannelInfoSetting: React.FC<IProps> = ({ channelId, projectId }) => {
  const { t } = useTranslation();

  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();

  const { data, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate: updateChannel, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects/{projectId}/channels'],
        });
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const methods = useForm<ChannelInfo>({
    resolver: zodResolver(channelInfoSchema),
  });

  useEffect(() => {
    void refetch();
  }, []);

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  const onSubmit = (values: ChannelInfo) => updateChannel(values);

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.channel-info')}
      actionBtn={{
        children: t('button.save'),
        onClick: methods.handleSubmit(onSubmit),
        disabled:
          !perms.includes('channel_update') ||
          !methods.formState.isDirty ||
          isPending,
      }}
    >
      <FormProvider {...methods}>
        <ChannelInfoForm type="update" />
      </FormProvider>
    </SettingMenuTemplate>
  );
};

export default ChannelInfoSetting;
