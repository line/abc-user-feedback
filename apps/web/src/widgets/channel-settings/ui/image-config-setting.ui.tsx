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
import { FormProvider, useForm } from 'react-hook-form';

import { Button, toast } from '@ufb/react';

import {
  HelpCardDocs,
  SettingAlert,
  SettingTemplate,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useWarnIfUnsavedChanges,
} from '@/shared';
import type { ChannelImageConfig } from '@/entities/channel';
import { channelImageConfigSchema, ImageConfigForm } from '@/entities/channel';

interface IProps {
  channelId: number;
  projectId: number;
}

const ImageConfigSetting: React.FC<IProps> = (props) => {
  const { channelId, projectId } = props;
  const { t } = useTranslation();

  const perms = usePermissions(projectId);

  const { data, refetch, isRefetching } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const methods = useForm<ChannelImageConfig>({
    resolver: zodResolver(channelImageConfigSchema),
    defaultValues: {
      accessKeyId: '',
      secretAccessKey: '',
      bucket: '',
      domainWhiteList: [],
      endpoint: '',
      region: '',
    },
  });

  useEffect(() => {
    if (data?.imageConfig) {
      methods.reset({
        ...data.imageConfig,
        domainWhiteList: data.imageConfig.domainWhiteList,
      });
    } else {
      methods.reset({
        accessKeyId: '',
        secretAccessKey: '',
        bucket: '',
        domainWhiteList: [],
        endpoint: '',
        region: '',
      });
    }
  }, [data, isRefetching]);
  useWarnIfUnsavedChanges(methods.formState.isDirty);

  const onSubmit = (input: ChannelImageConfig) => {
    if (!data) return;

    mutate({ ...data, imageConfig: input });
  };

  return (
    <SettingTemplate
      title={t('channel-setting-menu.image-mgmt')}
      action={
        <Button
          disabled={
            !perms.includes('channel_image_update') ||
            !methods.formState.isDirty ||
            isPending
          }
          onClick={methods.handleSubmit(onSubmit)}
          form={'form'}
        >
          {t('button.save')}
        </Button>
      }
    >
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.image-config" />}
      />
      <FormProvider {...methods}>
        <ImageConfigForm />
      </FormProvider>
    </SettingTemplate>
  );
};

export default ImageConfigSetting;
