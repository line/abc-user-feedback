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
/* eslint-disable no-useless-escape */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Popover,
  PopoverContent,
  PopoverHeading,
  PopoverTrigger,
} from '@ufb/ui';

import { env } from '@/env.mjs';
import { useOAIQuery } from '@/hooks';

interface IProps {
  channelId: number;
  projectId: number;
}

const FeedbackRequestPopover: React.FC<IProps> = ({ channelId, projectId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });
  const { data: apiKeysData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/api-keys',
    variables: { projectId },
  });
  const apiKey = useMemo(
    () => apiKeysData?.items.find((v) => !v.deletedAt) ?? null,
    [apiKeysData],
  );

  const snippetBody = useMemo(() => {
    if (!channelData?.fields) return null;
    const body: Record<string, any> = {};
    for (const field of channelData.fields) {
      if (field.type !== 'API' || field.status === 'INACTIVE') continue;
      const key = `'${field.key}'`;
      switch (field.format) {
        case 'number':
        case 'date':
          body[key] = field.format;
          break;
        case 'keyword':
        case 'text':
          body[key] = 'string';
          break;
        case 'select':
          body[key] = field.options.map((v) => `'${v.name}'`).join(' or ');
          break;
        case 'multiSelect':
          body[key] = `[${field.options.map((v) => `'${v.name}'`).join(', ')}]`;
          break;
        default:
          break;
      }
    }
    return body;
  }, [channelData]);
  return (
    <Popover onOpenChange={setOpen} open={open} placement="bottom-end">
      <PopoverTrigger asChild>
        <button
          className={[
            'btn btn-secondary btn-md min-w-[120px]',
            open ? 'bg-fill-tertiary' : '',
          ].join(' ')}
          onClick={() => setOpen(true)}
        >
          {t('main.setting.feedback-request-code')}
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeading>
          {t('main.setting.feedback-request-code')}
        </PopoverHeading>
        {!apiKey && (
          <p className="text-red-primary m-5">
            No API KEY with Active status. Please create API KEY.
          </p>
        )}
        <pre className="bg-fill-quaternary font-10-regular m-5 whitespace-pre-wrap rounded p-4">
          {`curl --request POST ${
            env.NEXT_PUBLIC_API_BASE_URL
          }/api/projects/${projectId}/channels/${channelId}/feedbacks \\\n--header 'Content-Type: application/json' \\\n--header 'x-api-key: ${
            apiKey?.value ?? 'API_KEY'
          }' \\\n--data-raw '${
            snippetBody
              ? JSON.stringify(snippetBody, null, 4)
                  .replace(/\"/g, '')
                  .replace(/\'/g, '"')
              : ''
          }'`}
        </pre>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackRequestPopover;
