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

import { Badge, Button, ComboboxGroup, ComboboxItem, Icon } from '@ufb/react';

import type { TableFilterCondition } from '@/shared';
import {
  client,
  cn,
  GRADIENT_CSS,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import type { Issue, IssueStatus } from '@/entities/issue';

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
  status?: IssueStatus;
};

const AiIssueComboboxGroup = ({
  projectId,
  channelId,
  feedbackId,
  onSelect,
  currentIssues,
}: Props) => {
  const { t } = useTranslation();
  const [issues, setIssues] = useState<AIIssueRecommendationItem[]>([]);
  const [searchedIssues, setSearchedIssues] = useState<Issue[]>([]);
  const [status, setStatus] = useState<
    'success' | 'error' | 'pending' | 'idle'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: aiIntegrations } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });
  const { data: aiIssueTemplates } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/issueTemplates',
    variables: { projectId },
  });
  const { mutateAsync: recommendIssues, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/issueRecommend/{feedbackId}',
    pathParams: { projectId, feedbackId },
    queryOptions: {
      async onSuccess(data) {
        if (!data) return;
        if (data.success) {
          setStatus('success');
          await getIssueRecommendationItems(data.result);
        }
        if (!data.success) {
          setStatus('error');
          setErrorMessage(data.message);
        }
      },
    },
  });

  const getIssueRecommendationItems = async (
    input: { issueName: string }[],
  ) => {
    const issueNames = input.map((v) => v.issueName);
    const { data: searchedIssuesResponse } = await client.post({
      path: '/api/admin/projects/{projectId}/issues/search',
      pathParams: { projectId },
      body: {
        operator: 'OR',
        queries: issueNames.map((name) => ({
          key: 'name',
          condition: 'IS' as TableFilterCondition,
          value: name,
        })),
      },
    });

    const searchedIssuesList = searchedIssuesResponse?.items ?? [];
    setSearchedIssues(searchedIssuesList);

    const result: AIIssueRecommendationItem[] = input.map(({ issueName }) => {
      const existingIssue = currentIssues.find(
        ({ name }) => name === issueName,
      );
      if (existingIssue) {
        return {
          id: existingIssue.id,
          name: issueName,
          option: 'ADDED',
          status: existingIssue.status,
        };
      }

      const matchedIssue = searchedIssuesList.find(
        ({ name }) => name === issueName,
      );
      if (matchedIssue) {
        return {
          id: matchedIssue.id,
          name: issueName,
          option: 'EXISTING',
          status: matchedIssue.status,
        };
      }

      return { name: issueName, option: 'CREATE' };
    });

    setIssues(result);
  };

  useEffect(() => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (currentIssues.some(({ name }) => name === issue.name)) {
          return { ...issue, option: 'ADDED' };
        }

        if (searchedIssues.some(({ name }) => name === issue.name)) {
          return { ...issue, option: 'EXISTING' };
        }

        return { ...issue, option: 'CREATE' };
      }),
    );
  }, [currentIssues, searchedIssues]);

  const aiIssue = aiIssueTemplates?.find((v) => v.channelId === channelId);

  if (!aiIntegrations?.apiKey) {
    return <></>;
  }

  return (
    <ComboboxGroup
      className="border-neutral-tertiary border-b"
      heading={
        status === 'success' && (
          <div className="flex items-center justify-between">
            <span className="text-neutral-tertiary text-base-normal">
              AI Recommend
            </span>
            <p
              className="text-small-normal cursor-pointer"
              onClick={() => recommendIssues(undefined)}
            >
              Retry
            </p>
          </div>
        )
      }
    >
      {status !== 'success' && (
        <div className="px-2 py-1">
          <Button
            size="small"
            className="w-full"
            onClick={() => recommendIssues(undefined)}
            style={GRADIENT_CSS.primary}
            disabled={!aiIssue?.isEnabled}
            loading={isPending}
          >
            <Icon name="RiSparklingFill" />
            Run AI
          </Button>
        </div>
      )}
      <p className="text-neutral-tertiary text-small-normal px-2 py-1 text-center">
        {!aiIssue?.isEnabled ?
          t('v2.description.ai-issue-recommendation-setting-required')
        : status === 'idle' ?
          t('v2.text.ai-issue-ready')
        : status === 'pending' ?
          t('v2.text.ai-issue-pending')
        : ''}
      </p>
      {status === 'success' &&
        issues.map((issue) => (
          <ComboboxItem
            key={issue.name}
            value={issue.name}
            onSelect={() => onSelect?.(issue)}
            className={cn('group justify-between gap-4', {
              'cursor-not-allowed opacity-50': issue.option === 'ADDED',
            })}
            disabled={issue.option === 'ADDED'}
          >
            <Badge style={GRADIENT_CSS.primary}>{issue.name}</Badge>
            {issue.option === 'ADDED' ?
              <Icon name="RiCheckLine" size={16} />
            : <span className="text-small-normal text-neutral-tertiary opacity-0 transition-opacity group-hover:opacity-100">
                {issue.option === 'CREATE' && 'Create'}
                {issue.option === 'EXISTING' && 'Add'}
              </span>
            }
          </ComboboxItem>
        ))}
      {status === 'error' && (
        <div className="px-2 py-1 text-red-500">{errorMessage}</div>
      )}
    </ComboboxGroup>
  );
};

export default AiIssueComboboxGroup;
