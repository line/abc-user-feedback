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

import { Button, Icon, toast } from '@ufb/react';

import {
  DeleteDialog,
  Path,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useWarnIfUnsavedChanges,
} from '@/shared';
import type { ChannelInfo } from '@/entities/channel';
import { ChannelInfoForm, channelInfoSchema } from '@/entities/channel';

interface IProps {
  projectId: number;
  channelId: number;
}

const ChannelInfoSetting: React.FC<IProps> = ({ channelId, projectId }) => {
  const { t } = useTranslation();

  const perms = usePermissions(projectId);
  const queryClient = useQueryClient();
  const overlay = useOverlay();
  const router = useRouter();

  const methods = useForm<ChannelInfo>({
    resolver: zodResolver(channelInfoSchema),
  });
  useWarnIfUnsavedChanges(methods.formState.isDirty);

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
        toast.success(t('v2.toast.success'));
      },
    },
  });
  const { mutateAsync: deleteChannel } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess: async () => {
        await refetch();
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects/{projectId}/channels'],
        });
        toast.success(t('v2.toast.success'));
        await router.push({ pathname: Path.SETTINGS, query: { projectId } });
      },
    },
  });

  useEffect(() => {
    methods.reset(data);
  }, [data]);

  const openDeleteDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={async () => {
          await deleteChannel(undefined);
          close();
        }}
      />
    ));
  };

  const onSubmit = (values: ChannelInfo) => updateChannel(values);

  return (
    <SettingTemplate
      title={t('channel-setting-menu.channel-info')}
      action={
        <>
          <Button
            variant="outline"
            onClick={openDeleteDialog}
            disabled={!perms.includes('channel_delete')}
          >
            <Icon name="RiDeleteBinFill" />
            {t('v2.button.name.delete', { name: 'Channel' })}
          </Button>
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            disabled={
              !perms.includes('channel_update') ||
              !methods.formState.isDirty ||
              isPending
            }
          >
            {t('button.save')}
          </Button>
        </>
      }
    >
      <FormProvider {...methods}>
        <ChannelInfoForm type="update" />
      </FormProvider>
    </SettingTemplate>
  );
};

export default ChannelInfoSetting;
