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

import { Icon } from '@ufb/react';

import {
  Card,
  CardBody,
  HelpCardDocs,
  SettingAlert,
  useOAIQuery,
} from '@/shared';

export const AIFieldTemplateSetting = ({
  onClick,
  projectId,
}: {
  onClick: (templateId?: number) => void;
  projectId: number;
}) => {
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/templates',
    variables: { projectId },
  });

  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <div className="grid grid-cols-4 gap-4">
        <TemplateCard
          type="create"
          title="New Template"
          onClick={() => onClick()}
        />
        {data?.map(({ id, title, prompt }) => (
          <TemplateCard
            key={id}
            type="update"
            title={title}
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
  onClick?: () => void;
}) => {
  const { title, description, type, onClick } = props;
  return (
    <Card
      onClick={onClick}
      className="min-h-60 cursor-pointer hover:opacity-50"
    >
      <CardBody className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-1">
          {type === 'create' && (
            <Icon name="RiAddCircleFill" className="text-neutral-tertiary" />
          )}
          {type === 'update' && <StarIcon />}
          <h4 className="text-title-h4">{title}</h4>
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
                style={{
                  background:
                    'linear-gradient(180deg, rgba(239, 239, 239, 0) 0%, var(--bg-tertiary) 100%)',
                }}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const StarIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3.59961H12.4004V4.40039H6C4.56406 4.40039 3.40039 5.56406 3.40039 7V17C3.40039 18.436 4.56406 19.5996 6 19.5996H18C19.436 19.5996 20.5996 18.436 20.5996 17V12.5996H21.4004V17C21.4004 18.8777 19.8777 20.4004 18 20.4004H6C4.12223 20.4004 2.59961 18.8777 2.59961 17V7C2.59961 5.12223 4.12223 3.59961 6 3.59961ZM19.1973 2.59961C19.4547 4.24564 20.7544 5.54527 22.4004 5.80273V6.19629C20.7543 6.4537 19.4547 7.75432 19.1973 9.40039H18.8027C18.5453 7.75432 17.2457 6.4537 15.5996 6.19629V5.80273C17.2456 5.54527 18.5453 4.24564 18.8027 2.59961H19.1973Z"
        fill="url(#paint0_linear_12996_14077)"
        stroke="url(#paint1_linear_12996_14077)"
        stroke-width="1.2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_12996_14077"
          x1="12.5"
          y1="2"
          x2="12.5"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_12996_14077"
          x1="12.5"
          y1="2"
          x2="12.5"
          y2="21"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
