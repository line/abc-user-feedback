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
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useThrottle } from 'react-use';

import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  Tag,
  toast,
} from '@ufb/react';

import {
  client,
  cn,
  InfiniteScrollArea,
  useOAIMutation,
  usePermissions,
} from '@/shared';
import { IssueBadge, useIssueSearchInfinite } from '@/entities/issue';
import type { Issue } from '@/entities/issue';

import { useFeedbackSearch } from '../lib';
import IssueCellEditCombobox from './issue-cell-edit-combobox.ui';

interface IProps {
  issues?: Issue[];
  feedbackId?: number;
  isPreview?: boolean;
}

const IssueCell: React.FC<IProps> = (props) => {
  const { feedbackId, issues, isPreview = false } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const channelId = Number(router.query.channelId);

  const perms = usePermissions(projectId);
  const [inputValue, setInputValue] = useState('');
  const throttledvalue = useThrottle(inputValue, 500);

  const queryClient = useQueryClient();

  const { data } = useFeedbackSearch(
    projectId,
    channelId,
    { queries: [{ id: feedbackId, condition: 'IS' }], operator: 'AND' },
    { enabled: !issues },
  );

  const currentIssues = (issues ?? data?.items[0]?.issues ?? []) as Issue[];

  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [
        '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search',
      ],
    });
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/issues/search'],
    });
  };

  const {
    data: allIssueData,
    refetch: allIssuesRefetch,
    fetchNextPage,
    hasNextPage,
  } = useIssueSearchInfinite(Number(projectId), {
    limit: 10,
    queries: [{ name: throttledvalue, condition: 'CONTAINS' }],
  });

  const allIssues = useMemo(() => {
    return allIssueData.pages
      .map((v) => v?.items)
      .filter((v) => !!v)
      .flat();
  }, [allIssueData]);

  const { mutate: attatchIssue } = useMutation({
    mutationFn: async ({ issueId }: { issueId: number }) => {
      if (!feedbackId) return;

      const { data } = await client.post({
        path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
        pathParams: { projectId, channelId, feedbackId, issueId },
      });
      return data;
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const { mutateAsync: detecthIssue } = useMutation({
    mutationFn: async ({ issueId }: { issueId: number }) => {
      if (!feedbackId) return;

      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
        pathParams: { projectId, channelId, feedbackId, issueId },
      });
      return data;
    },
    async onSuccess() {
      await refetch();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutateAsync: createIssue } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/issues',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        await allIssuesRefetch();
        setInputValue('');
        toast.success(t('v2.toast.success'));
      },
    },
  });

  return (
    <div
      className="flex flex-wrap items-center gap-1 rounded"
      onClick={(e) => e.stopPropagation()}
    >
      <Combobox>
        <ComboboxTrigger asChild>
          <button
            disabled={!perms.includes('feedback_issue_update')}
            className={cn({
              'opacity-50': !perms.includes('feedback_issue_update'),
            })}
          >
            {!isPreview && (
              <Tag
                variant="outline"
                className={cn('w-8 cursor-pointer justify-center', {
                  'hover:bg-inherit': !perms.includes('feedback_issue_update'),
                })}
              >
                +
              </Tag>
            )}
          </button>
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput
            onClick={(e) => e.stopPropagation()}
            onValueChange={(value) => setInputValue(value)}
            value={inputValue}
          />
          <ComboboxList maxHeight="333px">
            <ComboboxGroup
              heading={
                <span className="text-neutral-tertiary text-base-normal">
                  Selected Issue List
                </span>
              }
            >
              {currentIssues.map((issue) => (
                <ComboboxItem
                  key={issue.id}
                  onSelect={() => detecthIssue({ issueId: issue.id })}
                  className="flex justify-between"
                  value={issue.name}
                  disabled={!perms.includes('feedback_issue_update')}
                >
                  <IssueBadge
                    key={issue.id}
                    name={issue.name}
                    status={issue.status}
                  />
                  <span className="text-neutral-tertiary text-small-normal">
                    Remove
                  </span>
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            {!!allIssues.length && (
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Issue List
                  </span>
                }
              >
                {allIssues
                  .filter(
                    (v) => !currentIssues.some((issue) => issue.id === v.id),
                  )
                  .map((issue) => (
                    <ComboboxItem
                      key={issue.id}
                      onSelect={() => attatchIssue({ issueId: issue.id })}
                      className="flex justify-between"
                      value={issue.name}
                      disabled={!perms.includes('feedback_issue_update')}
                    >
                      <IssueBadge
                        key={issue.id}
                        name={issue.name}
                        status={issue.status}
                      />
                      <IssueCellEditCombobox issue={issue} />
                    </ComboboxItem>
                  ))}
                <InfiniteScrollArea
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                />
              </ComboboxGroup>
            )}
            {!!inputValue &&
              perms.includes('issue_create') &&
              !currentIssues.some((issue) => issue.name === inputValue) &&
              !allIssues.some((issue) => issue.name === inputValue) && (
                <div
                  className="combobox-item"
                  onClick={async () => {
                    const name = inputValue.trim();
                    const data = await createIssue({
                      name,
                      description: '',
                    });
                    if (!data) return;
                    setInputValue(name);
                    attatchIssue({ issueId: data.id });
                  }}
                >
                  <span className="flex-1">{inputValue}</span>
                  <span className="text-neutral-tertiary text-small-normal">
                    Create
                  </span>
                </div>
              )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {currentIssues.map((issue) => (
        <IssueBadge key={issue.id} name={issue.name} status={issue.status} />
      ))}
    </div>
  );
};

export default IssueCell;
