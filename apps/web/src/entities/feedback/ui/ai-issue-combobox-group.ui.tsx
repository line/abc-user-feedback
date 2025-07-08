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

import { useState } from 'react';

import { ComboboxGroup, ComboboxItem, Icon, Tag } from '@ufb/react';

import { useOAIMutation, useOAIQuery } from '@/shared';

interface Props {
  projectId: number;
  channelId: number;
  feedbackId: number;
  onSelect?: (issue: string) => void;
}

const AiIssueComboboxGroup = ({
  projectId,
  channelId,
  feedbackId,
  onSelect,
}: Props) => {
  const [issues, setIssues] = useState<string[]>([]);
  const { data: aiIntegrations } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });
  const { data: aiIssueTemplates } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/issueTemplates',
    variables: { projectId },
  });
  const { mutate: recommendIssues } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/issueRecommend/{feedbackId}',
    pathParams: { projectId, feedbackId },
    queryOptions: {
      onSettled(data) {
        setIssues(data?.result.map((v) => v.issueName) ?? []);
      },
    },
  });
  const aiIssue = aiIssueTemplates?.find((v) => v.channelId === channelId);

  if (!aiIntegrations?.apiKey) {
    return <></>;
  }

  return (
    <ComboboxGroup
      heading={
        <div className="flex items-center justify-between">
          <span className="text-neutral-tertiary text-base-normal">
            AI Recommend
          </span>
          <Tag asChild>
            <button
              className="disabled:opacity-50"
              onClick={() => recommendIssues(undefined)}
            >
              AI 실행
            </button>
          </Tag>
        </div>
      }
      className="border-neutral-secondary border-b"
    >
      {!aiIssue && (
        <div className="flex max-w-[320px] items-center gap-2 p-3">
          <Icon name="RiInformation2Fill" size={12} />
          <p className="text-neutral-tertiary text-base-normal">
            AI 이슈 템플릿을 등록해야 AI 기능을 실행할 수 있습니다.
          </p>
        </div>
      )}
      {issues.map((issue) => (
        <ComboboxItem
          key={issue}
          value={issue}
          onSelect={() => onSelect?.(issue)}
        >
          {issue}
        </ComboboxItem>
      ))}
    </ComboboxGroup>
  );
};

export default AiIssueComboboxGroup;
