/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { useTranslation } from 'next-i18next';

import { Icon, Tag } from '@ufb/react';

import {
  Card,
  CardBody,
  GRADIENT_CSS,
  SettingAlert,
  useAllChannels,
  useOAIQuery,
} from '@/shared';

export const AiIssueSetting = ({
  onClick,
  projectId,
}: {
  onClick: (templateId?: number) => void;
  projectId: number;
}) => {
  const { t } = useTranslation();

  const { data: issueTemplates } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/issueTemplates',
    variables: { projectId },
  });
  const { data: channelData } = useAllChannels(projectId);

  return (
    <>
      <SettingAlert description={t('help-card.ai-issue-recommendation')} />
      <div className="grid grid-cols-4 gap-4">
        {issueTemplates?.length !== channelData?.items.length && (
          <TemplateCard
            type="create"
            title="Create New"
            onClick={() => onClick()}
          />
        )}
        {issueTemplates?.map(({ id, prompt, channelId, isEnabled }) => (
          <TemplateCard
            key={id}
            type="update"
            title={
              channelData?.items.find((channel) => channel.id === channelId)
                ?.name ?? 'Unknown Channel'
            }
            isEnabled={isEnabled}
            description={prompt}
            onClick={() => onClick(id)}
          />
        ))}
      </div>
    </>
  );
};

const TemplateCard = (props: {
  title: string;
  description?: string;
  type: 'create' | 'update';
  isEnabled?: boolean;
  onClick?: () => void;
}) => {
  const { title, description, type, onClick, isEnabled } = props;
  return (
    <Card
      onClick={onClick}
      className="min-h-60 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
    >
      <CardBody className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {type === 'create' && (
              <Icon name="RiAddCircleFill" className="text-neutral-tertiary" />
            )}
            <h4 className="text-title-h4">{title}</h4>
          </div>
          {type === 'update' && (
            <Tag
              className="text-small-normal"
              variant={isEnabled ? 'primary' : 'secondary'}
              radius="large"
            >
              {isEnabled ? 'Enabled' : 'Disabled'}
            </Tag>
          )}
        </div>
        {description && (
          <div>
            <p className="text-small-normal">Prompt Preview</p>
            <div className="bg-neutral-tertiary rounded-12 relative p-3">
              <p className="text-small-normal line-clamp-2 break-all">
                {description}
              </p>
              <div
                className="rounded-12 absolute inset-0"
                style={GRADIENT_CSS.fadeOut}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
