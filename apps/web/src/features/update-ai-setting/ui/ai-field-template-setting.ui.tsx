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

import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { Icon } from '@ufb/react';

import {
  Card,
  CardBody,
  GRADIENT_CSS,
  SettingAlert,
  useOAIQuery,
} from '@/shared';

import { AIGenerateIcon } from '@/assets';

export const AIFieldTemplateSetting = ({
  onClick,
  projectId,
}: {
  onClick: (templateId?: number) => void;
  projectId: number;
}) => {
  const { t } = useTranslation();
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/fieldTemplates',
    variables: { projectId },
  });
  const { data: modelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations/models',
    variables: { projectId },
  });
  const [templates, setTemplates] = useState<
    { id: number; title: string; prompt: string; isError?: boolean }[]
  >([]);

  useEffect(() => {
    if (!data) return;
    setTemplates(
      data.map((template) => ({
        id: template.id,
        title: template.title,
        prompt: template.prompt,
        isError:
          modelData ?
            !modelData.models.some((model) => model.id === template.model)
          : false,
      })),
    );
  }, [data, modelData]);

  return (
    <>
      <SettingAlert description={t('help-card.ai-field-template')} />
      <div className="grid grid-cols-4 gap-4">
        <TemplateCard
          type="create"
          title="Create New"
          onClick={() => onClick()}
        />
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            type="update"
            onClick={() => onClick(template.id)}
            {...template}
          />
        ))}
      </div>
    </>
  );
};

const TemplateCard = (props: {
  title: string;
  prompt?: string;
  type: 'create' | 'update';
  onClick?: () => void;
  isError?: boolean;
}) => {
  const { title, prompt, type, onClick, isError } = props;
  return (
    <Card
      onClick={onClick}
      className="!rounded-24 min-h-60 cursor-pointer transition-shadow duration-300 hover:shadow-lg"
    >
      <CardBody className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          {type === 'create' && (
            <Icon name="RiAddCircleFill" className="text-neutral-tertiary" />
          )}
          {type === 'update' && <AIGenerateIcon />}
          <h4 className="text-title-h4">
            {title}
            {isError && (
              <Icon
                name="RiErrorWarningFill"
                className="ml-1 text-red-500"
                size={16}
              />
            )}
          </h4>
        </div>
        {prompt && (
          <div>
            <p className="text-small-normal">Prompt Preview</p>
            <div className="bg-neutral-tertiary rounded-12 relative p-3">
              <p className="text-small-normal line-clamp-2 break-all">
                {prompt}
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
