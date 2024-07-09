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
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TextInput, toast } from '@ufb/ui';

import { Path, SmallCard, useOAIMutation, useOAIQuery } from '@/shared';
import { useFeedbackSearch } from '@/entities/feedback';
import { DeleteProjectPopover } from '@/features/create-project';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {
  projectId: number;
}

const ProjectDeletionSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });
  const { mutate: deleteProject } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects'],
        });
        toast.negative({ title: t('toast.delete') });
        router.push(Path.MAIN);
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });
  const { data: issueData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-count',
    variables: { projectId },
  });

  return (
    <SettingMenuTemplate
      title={t('project-setting-menu.delete-project')}
      action={
        data && (
          <DeleteProjectPopover
            project={data}
            onClickDelete={() => deleteProject(undefined)}
          />
        )
      }
    >
      <div className="mb-6">
        <TextInput value={data?.name} label="Project Name" disabled />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-12-regular mb-2">Issue</p>
          <SmallCard
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
              <ChannelCard
                key={v.id}
                name={v.name}
                channelId={v.id}
                projectId={projectId}
              />
            ))}
          </div>
        </div>
      </div>
    </SettingMenuTemplate>
  );
};

interface IChannelProps {
  projectId: number;
  channelId: number;
  name: string;
}

const ChannelCard: React.FC<IChannelProps> = (props) => {
  const { projectId, channelId, name } = props;

  const { data: feedbackData } = useFeedbackSearch(projectId, channelId, {
    query: {},
    limit: 0,
  });

  return (
    <SmallCard
      name={name}
      value={(feedbackData?.meta.totalItems ?? 0).toLocaleString()}
      iconName="BubbleDotsFill"
      color="green"
    />
  );
};

export default ProjectDeletionSetting;
