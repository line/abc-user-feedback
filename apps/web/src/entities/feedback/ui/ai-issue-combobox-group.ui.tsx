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

import type { TableFilterCondition } from '@/shared';
import { client, useOAIMutation, useOAIQuery } from '@/shared';
import type { Issue } from '@/entities/issue';

interface Props {
  projectId: number;
  channelId: number;
  feedbackId: number;
  onSelect?: (issueItem: AIIssueRecommendationItem) => void;
  currentIssues: Issue[];
}

type AIIssueRecommendationItem = {
  id?: number;
  name: string;
  option: 'ADDED' | 'CREATE' | 'EXISTING';
};

const AiIssueComboboxGroup = ({
  projectId,
  channelId,
  feedbackId,
  onSelect,
  currentIssues,
}: Props) => {
  const [issues, setIssues] = useState<AIIssueRecommendationItem[]>([]);

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
      async onSettled(data) {
        const issues = data?.result.map((v) => v.issueName) ?? [];
        const { data: searchedIssues } = await client.post({
          path: '/api/admin/projects/{projectId}/issues/search',
          pathParams: { projectId },
          body: {
            operator: 'OR',
            queries: issues.map((issue) => ({
              key: 'name',
              condition: 'IS' as TableFilterCondition,
              value: issue,
            })),
          },
        });
        const getOption = (v: { issueName: string }) =>
          currentIssues.some((issue) => issue.name === v.issueName) ? 'ADDED'
          : searchedIssues?.items.some((issue) => issue.name === v.issueName) ?
            'EXISTING'
          : 'CREATE';
        setIssues(
          data?.result.map((v) => {
            const option = getOption(v);

            if (option === 'ADDED') {
              const id = currentIssues.find(
                ({ name }) => name === v.issueName,
              )?.id;
              return { id, name: v.issueName, option: 'ADDED' };
            }

            if (option === 'EXISTING') {
              const id = searchedIssues?.items.find(
                (issue) => issue.name === v.issueName,
              )?.id;

              return { id, name: v.issueName, option: 'EXISTING' };
            }
            return { name: v.issueName, option: 'CREATE' };
          }) ?? [],
        );
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
        <div className="flex items-center gap-2 p-3">
          <Icon name="RiInformation2Fill" size={12} />
          <p className="text-neutral-tertiary text-base-normal">
            AI 이슈 템플릿을 등록해야 AI 기능을 실행할 수 있습니다.
          </p>
        </div>
      )}
      {issues.map((issue) => (
        <ComboboxItem
          key={issue.name}
          value={issue.name}
          onSelect={() => onSelect?.(issue)}
          className="justify-between"
        >
          <span>{issue.name}</span>
          <span>{issue.option}</span>
        </ComboboxItem>
      ))}
    </ComboboxGroup>
  );
};

export default AiIssueComboboxGroup;
