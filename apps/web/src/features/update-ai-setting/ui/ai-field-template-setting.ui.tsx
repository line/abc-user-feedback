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

import { parseAsInteger, useQueryState } from 'nuqs';

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
  onClick: () => void;
  projectId: number;
}) => {
  const [_, setTemplateId] = useQueryState('templateId', parseAsInteger);

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
        <TemplateCard type="create" title="New Template" onClick={onClick} />
        {data?.map(({ id, title, prompt }) => (
          <TemplateCard
            key={id}
            type="update"
            title={title}
            description={prompt}
            onClick={async () => {
              await setTemplateId(id);
              onClick();
            }}
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
          {type === 'create' && <Icon name="RiAddCircleFill" />}
          {type === 'update' && <StarIcon />}
          <h4 className="text-title-h4">{title}</h4>
        </div>
        {description && (
          <div>
            <p className="text-small-normal">Prompt Preview</p>
            <div className="bg-neutral-tertiary rounded-12 p-3">
              <p className="text-small-normal line-clamp-2">{description}</p>
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
        d="M18.1973 14.5996C18.4547 16.2456 19.7544 17.5453 21.4004 17.8027V18.1963C19.7543 18.4537 18.4547 19.7543 18.1973 21.4004H17.8027C17.5453 19.7543 16.2457 18.4537 14.5996 18.1963V17.8027C16.2456 17.5453 17.5453 16.2456 17.8027 14.5996H18.1973ZM8.42773 5.59961C8.71293 8.76612 11.2339 11.286 14.4004 11.5713V12.4277C11.2339 12.7129 8.71294 15.2339 8.42773 18.4004H7.57227C7.28706 15.2339 4.76614 12.7129 1.59961 12.4277V11.5713C4.7661 11.2861 7.28707 8.76612 7.57227 5.59961H8.42773ZM17.0225 2.59961C17.2621 3.79603 18.204 4.73793 19.4004 4.97754V5.02148C18.2039 5.26103 17.2621 6.2039 17.0225 7.40039H16.9775C16.7379 6.2039 15.7961 5.26103 14.5996 5.02148V4.97754C15.796 4.73793 16.7379 3.79603 16.9775 2.59961H17.0225Z"
        fill="url(#paint0_linear_12816_270031)"
        stroke="url(#paint1_linear_12816_270031)"
        stroke-width="1.2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_12816_270031"
          x1="11.5"
          y1="2"
          x2="11.5"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_12816_270031"
          x1="11.5"
          y1="2"
          x2="11.5"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#2DD4BF" />
          <stop offset="1" stop-color="#0EA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};
