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

import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';

import {
  Button,
  Icon,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@ufb/react';

import { useOAIQuery } from '@/shared';

import { env } from '@/env';

interface IProps {
  channelId: number;
  projectId: number;
}

const FeedbackRequestCodePopover: React.FC<IProps> = (props) => {
  const { channelId, projectId } = props;

  const { t } = useTranslation();

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
    const body: Record<string, unknown> = {};
    for (const field of channelData.fields) {
      if (field.status === 'INACTIVE') continue;
      if (field.key === 'id') continue;
      if (field.key === 'updatedAt') continue;
      const key = field.key === 'issues' ? `'issueNames'` : `'${field.key}'`;
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
        case 'images':
          body[key] = `URL[]`;
          break;
        default:
          break;
      }
    }
    return body;
  }, [channelData]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon name="RiCodeBlock" />
          {t('main.setting.feedback-request-code')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <h5 className="text-title-h5">
            {t('main.setting.feedback-request-code')}
          </h5>
          <PopoverClose asChild>
            <Button variant="ghost">
              <Icon name="RiCloseLine" />
            </Button>
          </PopoverClose>
        </div>
        {!apiKey && (
          <p className="text-tint-red">
            No API KEY with Active status. Please create API KEY.
          </p>
        )}
        <pre className="bg-neutral-tertiary text-small-normal whitespace-pre-wrap rounded p-4">
          {`curl --request POST ${
            env.NEXT_PUBLIC_API_BASE_URL
          }/api/projects/${projectId}/channels/${channelId}/feedbacks \\\n--header 'Content-Type: application/json' \\\n--header 'x-api-key: ${
            apiKey?.value ?? 'API_KEY'
          }' \\\n--data-raw '${
            snippetBody ?
              JSON.stringify(snippetBody, null, 4)
                .replace(/\"/g, '')
                .replace(/\'/g, '"')
            : ''
          }'`}
        </pre>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackRequestCodePopover;
