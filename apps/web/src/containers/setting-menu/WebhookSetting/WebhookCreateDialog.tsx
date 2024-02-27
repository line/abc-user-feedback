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
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input, Popover, PopoverModalContent, PopoverTrigger } from '@ufb/ui';

import { DescriptionTooltip, SelectBox } from '@/components';
import { useOAIQuery } from '@/hooks';
import type { WebhookEventEnum } from '@/types/webhook.type';

interface IForm {
  name: string;
  url: string;
  event: {
    status: 'on' | 'off';
    type:
      | 'create-feedback'
      | 'create-issue'
      | 'change-issue-status'
      | 'create-issue';
    channels: number[];
  }[];
}

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const WebhookCreateDialog: React.FC<IProps> = ({ children, projectId }) => {
  const { t } = useTranslation();
  const [eventTypes, setEventTypes] = useState<WebhookEventEnum[]>([]);

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const { register } = useForm<IForm>();

  const toggleEventType =
    (type: WebhookEventEnum) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.checked && eventTypes.includes(type)) {
        setEventTypes(eventTypes.filter((eventType) => eventType !== type));
      } else {
        setEventTypes([...eventTypes, type]);
      }
    };

  return (
    <Popover modal>
      <PopoverTrigger
        className="icon-btn icon-btn-sm icon-btn-tertiary"
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverModalContent
        title={t('main.setting.dialog.delete-member.title')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{ children: t('button.confirm') }}
        width={560}
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Name"
            placeholder={t('placeholder', { name: 'Name' })}
            required
            {...register('name')}
          />
          <Input
            label="URL"
            placeholder={t('placeholder', { name: 'URL' })}
            required
            {...register('url')}
          />
          <div className="flex flex-col gap-2">
            <p className="input-label">Event</p>
            <div className="flex h-12 items-center">
              <div className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={eventTypes.includes('FEEDBACK_CREATION')}
                  onChange={toggleEventType('FEEDBACK_CREATION')}
                />
                <p className="ml-2">피드백 생성</p>
                <DescriptionTooltip description="description" />
              </div>
              {eventTypes.includes('FEEDBACK_CREATION') && (
                <SelectBox
                  isMulti
                  options={data?.items ?? []}
                  getOptionValue={(option) => String(option.id)}
                  getOptionLabel={(option) => option.name}
                  width={340}
                  height={48}
                />
              )}
            </div>
            <div className="flex h-12 items-center">
              <div className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={eventTypes.includes('ISSUE_ADDITION')}
                  onChange={toggleEventType('ISSUE_ADDITION')}
                />
                <p className="ml-2">이슈 등록</p>
                <DescriptionTooltip description="description" />
              </div>
              {eventTypes.includes('ISSUE_ADDITION') && (
                <SelectBox
                  isMulti
                  options={data?.items ?? []}
                  getOptionValue={(option) => String(option.id)}
                  getOptionLabel={(option) => option.name}
                  classNames={{ container: () => 'w-[340px]' }}
                />
              )}
            </div>
            <div className="flex h-12 items-center">
              <div className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={eventTypes.includes('ISSUE_STATUS_CHANGE')}
                  onChange={toggleEventType('ISSUE_STATUS_CHANGE')}
                />
                <p className="ml-2">이슈 상태 변경</p>
                <DescriptionTooltip description="description" />
              </div>
            </div>
            <div className="flex h-12 items-center">
              <div className="flex flex-1 items-center">
                <input
                  type="checkbox"
                  className="toggle toggle-sm"
                  checked={eventTypes.includes('ISSUE_CREATION')}
                  onChange={toggleEventType('ISSUE_CREATION')}
                />
                <p className="ml-2">이슈 생성</p>
                <DescriptionTooltip description="description" />
              </div>
            </div>
          </div>
        </div>
      </PopoverModalContent>
    </Popover>
  );
};

export default WebhookCreateDialog;
