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
  useChannels,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
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
  channelId: number;
  projectId: number;
}
const ChannelInfoSetting: React.FC<IProps> = ({ projectId, channelId }) => {
  const perms = usePermissions(projectId);
  const { t } = useTranslation();
  const { data, refetch } = useOAIQuery({
    path: '/api/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { reset, register, handleSubmit, formState } = useForm<IForm>({
    resolver: zodResolver(scheme),
  });
  const { refetch: refetchChannelList } = useChannels(projectId);

  const { mutate, isLoading } = useOAIMutation({
    method: 'put',
    path: '/api/projects/{projectId}/channels/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        refetchChannelList();
        toast.positive({ title: t('toast.save') });
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
    mutate({ ...input });
  };

  return (
    <SettingMenuTemplate
      title={t('main.setting.subtitle.channel-info')}
      actionBtn={{
        children: t('button.save'),
        onClick: handleSubmit(onSubmit),
        form: 'form',
        type: 'submit',
        disabled:
          !perms.includes('channel_update') || !formState.isDirty || isLoading,
      }}
    >
      <form id="form" className="flex flex-col gap-6">
        <TextInput value={data?.id} label="Channel ID" disabled />
        <TextInput
          {...register('name')}
          label="Channel Name"
          required
          disabled={!perms.includes('channel_update')}
        />
        <TextInput
          {...register('description')}
          label="Channel Description"
          disabled={!perms.includes('channel_update')}
        />
      </form>
    </SettingMenuTemplate>
  );
};

export default ChannelInfoSetting;
