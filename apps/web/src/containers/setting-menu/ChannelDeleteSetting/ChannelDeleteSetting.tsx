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
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Input, Popover, PopoverTrigger, TextInput, toast } from '@ufb/ui';

import {
  ChannelCard,
  PopoverModalContent,
  SettingMenuTemplate,
} from '@/components';
import {
  useFeedbackSearch,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
} from '@/hooks';

interface IProps extends React.PropsWithChildren {
  projectId: number;
  channelId: number;
}
const ChannelDeleteSetting: React.FC<IProps> = (props) => {
  const { channelId, projectId } = props;

  const perms = usePermissions(projectId);
  const [open, setOpen] = useState(false);
  const [inputChannelName, setInputChannelName] = useState('');
  const { t } = useTranslation();
  const router = useRouter();

  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate, isLoading } = useOAIMutation({
    method: 'delete',
    path: '/api/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      async onSuccess() {
        toast.negative({ title: t('toast.delete') });
        router.reload();
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const { data: feedbackData } = useFeedbackSearch(projectId, channelId, {
    query: {},
  });

  return (
    <SettingMenuTemplate
      title={t('main.setting.subtitle.delete-channel')}
      action={
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className="btn btn-md btn-primary min-w-[120px]"
            onClick={() => setOpen(true)}
            disabled={!perms.includes('channel_delete')}
          >
            {t('button.delete')}
          </PopoverTrigger>
          <PopoverModalContent
            title={t('main.setting.dialog.delete-channel.title')}
            description={t('main.setting.dialog.delete-channel.description')}
            icon={{
              name: 'WarningTriangleFill',
              className: 'text-red-primary',
              size: 56,
            }}
            submitButton={{
              children: t('button.delete'),
              disabled: inputChannelName !== data?.name || isLoading,
              className: 'btn-red',
              onClick: () => mutate(undefined),
            }}
          >
            <p className="font-16-bold mb-3 text-center">{data?.name}</p>
            <Input
              placeholder={t('input.placeholder.input')}
              onChange={(e) => setInputChannelName(e.target.value)}
            />
          </PopoverModalContent>
        </Popover>
      }
    >
      <div className="flex flex-col gap-6">
        <TextInput value={data?.name} label="Channel Name" disabled />
        <div>
          <p className="font-12-regular mb-2">Channel Data</p>
          <div className="flex flex-wrap gap-2">
            {data && (
              <ChannelCard
                name={data.name}
                value={(feedbackData?.meta.totalItems ?? 0).toLocaleString()}
                iconName="BubbleDotsFill"
                color="green"
              />
            )}
          </div>
        </div>
      </div>
    </SettingMenuTemplate>
  );
};

export default ChannelDeleteSetting;
