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
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useThrottle } from 'react-use';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  Icon,
  Tag,
  toast,
} from '@ufb/react';

import {
  client,
  cn,
  commandFilter,
  InfiniteScrollArea,
  useOAIMutation,
  usePermissions,
} from '@/shared';
import { IssueBadge, useIssueSearchInfinite } from '@/entities/issue';
import type { Issue } from '@/entities/issue';

import { useFeedbackSearch } from '../lib';
import AiIssueComboboxGroup from './ai-issue-combobox-group.ui';

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
    {
      queries: [{ key: 'id', value: feedbackId, condition: 'IS' }],
      operator: 'AND',
    },
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIssueSearchInfinite(Number(projectId), {
    limit: 50,
    queries: [{ key: 'name', value: throttledvalue, condition: 'CONTAINS' }],
    sort: { name: 'ASC' },
  });

  const allIssues = useMemo(() => {
    return allIssueData.pages
      .map((v) => v?.items)
      .filter((v) => !!v)
      .flat()
      .sort(
        (a, b) =>
          (currentIssues.some((issue) => issue.id === a.id) ? -1 : 1) -
          (currentIssues.some((issue) => issue.id === b.id) ? -1 : 1),
      );
  }, [allIssueData, currentIssues]);

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
  const { mutate: detachIssue } = useMutation({
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
        setInputValue('');
        toast.success(t('v2.toast.success'));
      },
    },
  });
  const onClickIssue = (issueId: number) => {
    if (currentIssues.some((v) => v.id === issueId)) {
      detachIssue({ issueId });
    } else {
      attatchIssue({ issueId });
    }
  };
  const onCreateIssue = async (name: string) => {
    const data = await createIssue({
      name,
      description: '',
    });
    if (!data) return;
    attatchIssue({ issueId: data.id });
  };

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
        <ComboboxContent
          options={{ filter: commandFilter }}
          className="w-[320px]"
        >
          <ComboboxInput
            onClick={(e) => e.stopPropagation()}
            onValueChange={(value) => setInputValue(value)}
            value={inputValue}
          />
          {!!feedbackId && !inputValue && (
            <AiIssueComboboxGroup
              projectId={projectId}
              channelId={channelId}
              feedbackId={feedbackId}
              onSelect={async ({ name, option, id }) => {
                if (option === 'CREATE') {
                  await onCreateIssue(name);
                }
                if (option === 'EXISTING' && id) {
                  onClickIssue(id);
                }
              }}
              currentIssues={currentIssues}
            />
          )}
          <ComboboxList maxHeight="333px">
            <ComboboxGroup
              heading={
                <span className="text-neutral-tertiary text-base-normal">
                  Issue List
                </span>
              }
            >
              <ComboboxEmpty>{t('v2.text.no-data.default')}</ComboboxEmpty>
              {allIssues.map((issue) => (
                <ComboboxItem
                  key={issue.id}
                  onSelect={() => onClickIssue(issue.id)}
                  value={issue.name}
                  className="group justify-between"
                  disabled={!perms.includes('feedback_issue_update')}
                >
                  <IssueBadge
                    key={issue.id}
                    name={issue.name}
                    status={issue.status}
                  />
                  {currentIssues.some((v) => v.id === issue.id) ?
                    <Icon name="RiCheckLine" size={16} />
                  : <span className="text-small-normal text-neutral-tertiary opacity-0 transition-opacity group-hover:opacity-100">
                      Add
                    </span>
                  }
                </ComboboxItem>
              ))}

              <InfiniteScrollArea
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </ComboboxGroup>
          </ComboboxList>
          {!!inputValue &&
            perms.includes('issue_create') &&
            !currentIssues.some((issue) => issue.name === inputValue) &&
            !allIssues.some((issue) => issue.name === inputValue) && (
              <ComboboxItem
                value={inputValue}
                className="justify-between"
                onSelect={() => onCreateIssue(inputValue)}
              >
                <IssueBadge name={inputValue} status="INIT" />
                <span className="text-neutral-tertiary text-small-normal">
                  Create
                </span>
              </ComboboxItem>
            )}
        </ComboboxContent>
      </Combobox>
      {currentIssues.map((issue) => (
        <IssueBadge key={issue.id} name={issue.name} status={issue.status} />
      ))}
    </div>
  );
};

export default IssueCell;
