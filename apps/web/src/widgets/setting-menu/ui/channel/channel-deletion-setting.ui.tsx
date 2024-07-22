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
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { TextInput, toast } from '@ufb/ui';

import { SmallCard, useOAIMutation, useOAIQuery } from '@/shared';
import { useFeedbackSearch } from '@/entities/feedback';
import { DeleteChannelPopover } from '@/features/delete-channel';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
  channelId: number;
}

const ChannelDeletionSetting: React.FC<IProps> = (props) => {
  const { channelId, projectId } = props;

  const { t } = useTranslation();
  const router = useRouter();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { mutate: deleteChannel } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    pathParams: { channelId, projectId },
    queryOptions: {
      onSuccess() {
        toast.negative({ title: t('toast.delete') });
        router.reload();
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const { data: feedbackData } = useFeedbackSearch(projectId, channelId, {
    query: {},
  });

  return (
    <SettingMenuTemplate
      title={t('channel-setting-menu.delete-channel')}
      action={
        data && (
          <DeleteChannelPopover
            channel={data}
            onClickDelete={() => deleteChannel(undefined)}
            projectId={projectId}
          />
        )
      }
    >
      <div className="flex flex-col gap-6">
        <TextInput value={data?.name} label="Channel Name" disabled />
        <div>
          <p className="font-12-regular mb-2">Channel Data</p>
          <div className="flex flex-wrap gap-2">
            {data && (
              <SmallCard
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

export default ChannelDeletionSetting;
