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
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useThrottle } from 'react-use';

import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  toast,
} from '@ufb/react';

import { client, useOAIMutation } from '@/shared';
import { IssueBadge, useIssueSearch } from '@/entities/issue';
import type { Issue } from '@/entities/issue';

import { useFeedbackSearch } from '../lib';
import IssueCellEditCombobox from './issue-cell-edit-combobox.ui';

interface IProps extends React.PropsWithChildren {
  issues?: Issue[];
  feedbackId?: number;
}

const IssueCell: React.FC<IProps> = (props) => {
  const { feedbackId, children, issues } = props;

  const { t } = useTranslation();

  const router = useRouter();
  const projectId = Number(router.query.projectId);
  const channelId = Number(router.query.channelId);

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
    data: allIssues,
    refetch: allIssuesRefetch,
    isLoading,
  } = useIssueSearch(Number(projectId), {
    limit: 100,
    queries: [{ name: throttledvalue, condition: 'CONTAINS' }],
  });

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
        <ComboboxTrigger asChild>{children}</ComboboxTrigger>
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
                  Selected Issue
                </span>
              }
            >
              {currentIssues.map((issue) => (
                <ComboboxItem
                  key={issue.id}
                  onSelect={() => detecthIssue({ issueId: issue.id })}
                  className="flex justify-between"
                  value={issue.name}
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
            {isLoading && <div className="combobox-item">Loading...</div>}
            {!isLoading && !!allIssues?.items.length && (
              <ComboboxGroup
                heading={
                  <span className="text-neutral-tertiary text-base-normal">
                    Issue List
                  </span>
                }
              >
                {allIssues.items
                  .filter(
                    (v) => !currentIssues.some((issue) => issue.id === v.id),
                  )
                  .map((issue) => (
                    <ComboboxItem
                      key={issue.id}
                      onSelect={() => attatchIssue({ issueId: issue.id })}
                      className="flex justify-between"
                      value={issue.name}
                    >
                      <IssueBadge
                        key={issue.id}
                        name={issue.name}
                        status={issue.status}
                      />
                      <IssueCellEditCombobox issue={issue} />
                    </ComboboxItem>
                  ))}
              </ComboboxGroup>
            )}
            {!!inputValue &&
              !currentIssues.some((issue) => issue.name === inputValue) &&
              !isLoading &&
              !allIssues?.items.some((issue) => issue.name === inputValue) && (
                <div
                  className="combobox-item flex justify-between"
                  onClick={async () => {
                    const data = await createIssue({
                      name: inputValue,
                      description: '',
                    });
                    if (!data) return;
                    attatchIssue({ issueId: data.id });
                  }}
                >
                  <span>{inputValue}</span>
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
