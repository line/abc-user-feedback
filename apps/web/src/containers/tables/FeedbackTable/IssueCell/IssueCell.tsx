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
import { useEffect, useMemo, useRef, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useClickAway } from 'react-use';

import {
  Badge,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  toast,
} from '@ufb/ui';

import { getStatusColor } from '@/constants/issues';
import { useIssueSearch, useOAIMutation, usePermissions } from '@/hooks';
import client from '@/libs/client';
import type { IFetchError } from '@/types/fetch-error.type';
import type { IssueType } from '@/types/issue.type';
import useFeedbackTable from '../feedback-table.context';
import IssueSetting from './IssueSetting';

interface IProps extends React.PropsWithChildren {
  issues?: IssueType[];
  feedbackId: number;
  refetch: () => Promise<any>;
  isExpanded: boolean;
  cellWidth: number;
}

const IssueCell: React.FC<IProps> = (props) => {
  const { issues, feedbackId, refetch, isExpanded, cellWidth } = props;

  const { projectId, channelId } = useFeedbackTable();
  const { t } = useTranslation();

  const perms = usePermissions(projectId);

  const [overflow, setOverflow] = useState<boolean>(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const comboBoxRef = useRef(null);
  const [openIssueId, setOpenIssueId] = useState<number | null>(null);

  useClickAway(comboBoxRef, () => setIsEditing(false), ['click']);

  const [inputValue, setInputValue] = useState('');

  const { data: allIssues, refetch: allIssuesRefetch } = useIssueSearch(
    projectId,
    { limit: 1000 },
  );
  const filteredIssues = useMemo(
    () =>
      allIssues?.items.filter((v) =>
        v.name.toLowerCase().includes(inputValue.toLowerCase()),
      ) ?? [],
    [allIssues, inputValue, issues],
  );

  useEffect(() => {
    if (!ref.current) return;
    const newState = ref.current.clientWidth < ref.current.scrollWidth;
    if (newState === overflow) return;
    setOverflow(newState);
  }, [ref.current, cellWidth, issues]);

  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync: attatchIssue } = useMutation({
    mutationKey: [
      'post',
      '/api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
      projectId,
      channelId,
      feedbackId,
    ],
    mutationFn: async ({ issueId }: { issueId: number }) => {
      const { data } = await client.post({
        path: '/api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
        pathParams: { projectId, channelId, feedbackId, issueId },
      });
      return data;
    },
    onSuccess: async () => {
      await refetch();
      toast.positive({ title: t('toast.save') });
    },
  });

  const { mutateAsync: detecthIssue } = useMutation({
    mutationKey: [
      'delete',
      '/api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
      projectId,
      channelId,
      feedbackId,
    ],
    mutationFn: async ({ issueId }: { issueId: number }) => {
      const { data } = await client.delete({
        path: '/api/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
        pathParams: { projectId, channelId, feedbackId, issueId },
      });
      return data;
    },
    onSuccess: async () => {
      await refetch();
      setInputValue('');
      toast.positive({ title: t('toast.save') });
    },
    onError: (error: IFetchError) => {
      toast.negative({ title: error.message });
    },
  });

  const { mutateAsync: createIssue } = useOAIMutation({
    method: 'post',
    path: '/api/projects/{projectId}/issues',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        allIssuesRefetch();
        toast.positive({ title: t('toast.register') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const addIssue = async (issue: IssueType | undefined) => {
    let issueId = issue?.id;
    if (!issueId) {
      const data = await createIssue({ name: inputValue });
      if (!data) return;
      issueId = data?.id;
    }
    await attatchIssue({ issueId });
    setInputValue('');
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <Popover
        open={isEditing}
        onOpenChange={setIsEditing}
        placement="bottom-start"
      >
        <PopoverTrigger asChild={true}>
          {issues?.length === 0 ? (
            <button
              className="btn btn-xs btn-secondary btn-rounded font-12-regular my-2"
              onClick={() => setIsEditing(true)}
              disabled={!perms.includes('feedback_issue_update')}
            >
              {t('main.feedback.issue-cell.register-issue')}
            </button>
          ) : (
            <div
              className={[
                'flex content-start items-center gap-1 py-2',
                !isExpanded ? 'flex-nowrap' : 'flex-wrap',
              ].join(' ')}
            >
              <div
                ref={ref}
                className={[
                  'scrollbar-hide flex items-center gap-1',
                  !isExpanded ? 'overflow-x-hidden' : 'flex-wrap',
                ].join(' ')}
              >
                {issues?.map((v) => (
                  <Badge
                    key={v.id}
                    color={getStatusColor(v.status)}
                    type="secondary"
                  >
                    {v.name}
                  </Badge>
                ))}
              </div>
              {overflow && !isExpanded && (
                <Icon name="Dots" size={20} className="flex-shrink-0" />
              )}
              <button
                className="icon-btn icon-btn-xs icon-btn-rounded icon-btn-secondary"
                onClick={() => setIsEditing(true)}
                disabled={!perms.includes('feedback_issue_update')}
              >
                <Icon name="Plus" />
              </button>
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent>
          <Combobox onChange={addIssue} as="div" className="w-[300px]">
            <label className="bg-primary flex cursor-text flex-wrap items-center gap-1 rounded px-3 py-2">
              {issues?.map(({ id, name, status }) => (
                <Badge
                  key={id}
                  color={getStatusColor(status)}
                  type="secondary"
                  right={{
                    iconName: 'Close',
                    onClick: () => detecthIssue({ issueId: id }),
                    disabled: !perms.includes('feedback_issue_update'),
                  }}
                >
                  {name}
                </Badge>
              ))}
              <Combobox.Input
                className="input-sm bg-transparent"
                placeholder={t('main.feedback.issue-cell.input-issue')}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                ref={comboBoxRef}
                autoFocus
              />
            </label>
            <Combobox.Options className="border-t-[1px]" static>
              <div className="flex h-[42px] items-center p-1">
                <span className="text-secondary px-2 py-1">
                  {t('main.feedback.issue-cell.issue-list')}
                </span>
              </div>
              <div className=" max-h-[300px] overflow-y-auto">
                {filteredIssues?.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    value={item}
                    className="p-1"
                    disabled={!!issues?.find((issue) => issue.id === item.id)}
                  >
                    {({ active, disabled }) => (
                      <div
                        className={[
                          'flex h-[34px] cursor-pointer items-center justify-between rounded py-1 pl-2',
                          active ? 'bg-fill-secondary' : '',
                          disabled
                            ? 'bg-fill-tertiary cursor-auto'
                            : 'cursor-pointer',
                        ].join(' ')}
                      >
                        <Badge
                          color={getStatusColor(item.status)}
                          type="secondary"
                        >
                          {item.name}
                        </Badge>
                        <div onClick={(e) => e.stopPropagation()}>
                          <button
                            className="icon-btn icon-btn-sm icon-btn-tertiary hover:bg-secondary"
                            onClick={() => setOpenIssueId(item.id)}
                            disabled={
                              !perms.includes('issue_update') &&
                              !perms.includes('issue_delete')
                            }
                          >
                            <Icon name="Dots" size={20} />
                          </button>
                          {openIssueId === item.id && (
                            <IssueSetting
                              issue={item}
                              projectId={projectId}
                              onClose={() => setOpenIssueId(null)}
                              refetch={() => {
                                refetch();
                                allIssuesRefetch();
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </Combobox.Option>
                ))}
              </div>
              {!filteredIssues.find(
                (v) => v.name.toLowerCase() === inputValue.toLowerCase(),
              ) &&
                perms.includes('issue_create') &&
                inputValue.length > 0 && (
                  <Combobox.Option value={undefined} className="p-1">
                    {({ active }) => (
                      <div
                        className={
                          'flex h-[34px] cursor-pointer items-center gap-2 rounded px-2 py-1 ' +
                          (active ? 'bg-fill-secondary' : 'bg-primary')
                        }
                      >
                        <span className="text-secondary">
                          {t('main.feedback.issue-cell.create-issue')}
                        </span>
                        <Badge color="red" type="secondary">
                          {inputValue}
                        </Badge>
                      </div>
                    )}
                  </Combobox.Option>
                )}
            </Combobox.Options>
          </Combobox>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default IssueCell;
