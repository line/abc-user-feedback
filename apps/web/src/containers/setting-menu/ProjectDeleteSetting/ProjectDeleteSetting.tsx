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
import { Input, Popover, PopoverTrigger, TextInput, toast } from '@ufb/ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ChannelCard, SettingMenuTemplate } from '@/components';
import { PopoverModalContent } from '@/components';
import { useOAIMutation, useOAIQuery, usePermissions } from '@/hooks';

import ChannelCardList from './ChannelCardList';

interface IProps extends React.PropsWithChildren {
  projectId: number;
}
const ProjectDeleteSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const perms = usePermissions(projectId);

  const [open, setOpen] = useState(false);
  const [inputChannelName, setInputChannelName] = useState('');

  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}',
    variables: { projectId },
  });

  const { data: channelData } = useOAIQuery({
    path: '/api/projects/{projectId}/channels',
    variables: { projectId },
  });
  const { data: issueData } = useOAIQuery({
    path: '/api/projects/{projectId}/issue-count',
    variables: { projectId },
  });
  const { mutate, isLoading } = useOAIMutation({
    method: 'delete',
    path: '/api/projects/{projectId}',
    pathParams: { projectId },
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

  return (
    <SettingMenuTemplate
      title={t('main.setting.subtitle.delete-project')}
      action={
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className="btn btn-md btn-primary min-w-[120px]"
            onClick={() => setOpen(true)}
            disabled={!perms.includes('project_delete')}
          >
            {t('button.delete')}
          </PopoverTrigger>
          <PopoverModalContent
            title={t('main.setting.dialog.delete-project.title')}
            description={t('main.setting.dialog.delete-project.description')}
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
            <p className="font-16-bold text-center mb-3">{data?.name}</p>
            <Input
              placeholder={t('input.placeholder.input')}
              onChange={(e) => setInputChannelName(e.target.value)}
            />
          </PopoverModalContent>
        </Popover>
      }
    >
      <div>
        <div className="mb-6">
          <TextInput value={data?.name} label="Project Name" disabled />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-12-regular mb-2">Issue</p>
            <ChannelCard
              name="issue"
              value={(issueData?.total ?? 0).toLocaleString()}
              color="blue"
              iconName="DocumentFill"
            />
          </div>
          <div>
            <p className="font-12-regular mb-2">Feedback</p>
            <div className="flex flex-wrap gap-2">
              {channelData?.items.map((v) => (
                <ChannelCardList
                  name={v.name}
                  createdAt={v.createdAt}
                  key={v.id}
                  channelId={v.id}
                  projectId={projectId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SettingMenuTemplate>
  );
};

export default ProjectDeleteSetting;
