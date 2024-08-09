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
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { useClickAway } from 'react-use';

import { Badge, Icon, toast } from '@ufb/ui';

import { client, cn, Popper, useOAIMutation, usePermissions } from '@/shared';
import { IssueBadge, useIssueSearch } from '@/entities/issue';
import type { Issue } from '@/entities/issue';

import { useFeedbackTable } from '../../model';
import IssueSetting from './issue-setting';

interface IProps extends React.PropsWithChildren {
  issues?: Issue[];
  feedbackId: number;
  isExpanded: boolean;
  cellWidth: number;
}

const IssueCell: React.FC<IProps> = (props) => {
  const { issues, feedbackId, isExpanded, cellWidth } = props;
  const queryClient = useQueryClient();
  const { projectId, channelId } = useFeedbackTable();
  const { t } = useTranslation();
  const perms = usePermissions(projectId);

  const [overflow, setOverflow] = useState<boolean>(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const comboBoxRef = useRef(null);
  const [openIssueId, setOpenIssueId] = useState<number | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [openPopover, setOpenPopover] = useState(false);

  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [
        '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search',
      ],
    });
  };

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

  const { mutateAsync: attatchIssue } = useMutation({
    mutationKey: [
      'post',
      '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
      projectId,
      channelId,
      feedbackId,
    ],
    mutationFn: async ({ issueId }: { issueId: number }) => {
      const { data } = await client.post({
        path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
        pathParams: { projectId, channelId, feedbackId, issueId },
      });
      return data;
    },
    onSuccess: async () => {
      await refetch();
      toast.positive({ title: t('toast.save') });
    },
    onError: (error) => {
      toast.negative({ title: error.message });
    },
  });

  const { mutateAsync: detecthIssue } = useMutation({
    mutationKey: [
      'delete',
      '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
      projectId,
      channelId,
      feedbackId,
    ],
    mutationFn: async ({ issueId }: { issueId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/{feedbackId}/issue/{issueId}',
        pathParams: { projectId, channelId, feedbackId, issueId },
      });
      return data;
    },
    onSuccess: async () => {
      await refetch();
      setInputValue('');
      toast.positive({ title: t('toast.save') });
    },
    onError: (error) => {
      toast.negative({ title: error.message });
    },
  });

  const { mutateAsync: createIssue } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/issues',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await allIssuesRefetch();
        toast.positive({ title: t('toast.register') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  useClickAway(comboBoxRef, () => setOpenPopover(false), ['click']);

  useEffect(() => {
    if (!ref.current) return;
    const newState = ref.current.clientWidth < ref.current.scrollWidth;
    if (newState === overflow) return;
    setOverflow(newState);
  }, [ref.current, cellWidth, issues]);

  const addIssue = async (input?: Issue | string) => {
    if (!input) return;

    if (typeof input === 'string') {
      const data = await createIssue({ name: inputValue });
      if (!data) return;
      await attatchIssue({ issueId: data.id });
    } else {
      await attatchIssue({ issueId: input.id });
    }
    setInputValue('');
  };

  return (
    <div className="relative">
      <Popper
        open={openPopover}
        setOpen={setOpenPopover}
        placement="bottom-start"
        offset={0}
        buttonChildren={
          issues?.length === 0 ?
            <button
              className="btn btn-xs btn-secondary btn-rounded font-12-regular my-2"
              onClick={(e) => {
                e.stopPropagation();
                setOpenPopover(true);
              }}
              disabled={!perms.includes('feedback_issue_update')}
            >
              {t('main.feedback.issue-cell.register-issue')}
            </button>
          : <div
              className={cn([
                'flex content-start items-center gap-1 py-2',
                !isExpanded ? 'flex-nowrap' : 'flex-wrap',
              ])}
            >
              <div
                ref={ref}
                className={cn([
                  'scrollbar-hide flex items-center gap-1',
                  !isExpanded ? 'overflow-x-hidden' : 'flex-wrap',
                ])}
              >
                {issues?.map((v) => <IssueBadge key={v.id} issue={v} />)}
              </div>
              {overflow && !isExpanded && (
                <Icon name="Dots" size={20} className="flex-shrink-0" />
              )}
              <button
                className="icon-btn icon-btn-xs icon-btn-rounded icon-btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopover(true);
                }}
                disabled={!perms.includes('feedback_issue_update')}
              >
                <Icon name="Plus" />
              </button>
            </div>
        }
      >
        <Combobox
          onChange={addIssue}
          as="div"
          className="w-[300px]"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="bg-primary flex cursor-text flex-wrap items-center gap-1 rounded px-3 py-2">
            {issues?.map((issue) => (
              <IssueBadge
                key={issue.id}
                issue={issue}
                right={{
                  iconName: 'Close',
                  onClick: () => detecthIssue({ issueId: issue.id }),
                  disabled: !perms.includes('feedback_issue_update'),
                }}
              />
            ))}
            <ComboboxInput
              className="input-sm bg-transparent"
              placeholder={t('main.feedback.issue-cell.input-issue')}
              onChange={(event) => setInputValue(event.target.value)}
              ref={comboBoxRef}
              autoFocus
            />
          </label>
          <ComboboxOptions className="border-t-[1px]" static>
            <div className="flex h-[42px] items-center p-1">
              <span className="text-secondary px-2 py-1">
                {t('main.feedback.issue-cell.issue-list')}
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {filteredIssues.map((item) => (
                <ComboboxOption
                  key={item.id}
                  value={item}
                  className="p-1"
                  disabled={!!issues?.find((issue) => issue.id === item.id)}
                >
                  {({ active, disabled }) => (
                    <div
                      className={cn([
                        'flex h-[34px] cursor-pointer items-center justify-between rounded py-1 pl-2',
                        disabled ?
                          'bg-fill-tertiary cursor-auto'
                        : 'cursor-pointer',
                        { 'bg-fill-secondary': active },
                      ])}
                    >
                      <IssueBadge issue={item} />
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
                            refetch={async () => {
                              await refetch();
                              await allIssuesRefetch();
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </ComboboxOption>
              ))}
            </div>
            {!filteredIssues.find(
              (v) => v.name.toLowerCase() === inputValue.toLowerCase(),
            ) &&
              perms.includes('issue_create') &&
              inputValue.length > 0 && (
                <ComboboxOption value={inputValue} className="p-1">
                  {({ focus }) => (
                    <div
                      className={
                        'flex h-[34px] cursor-pointer items-center gap-2 rounded px-2 py-1 ' +
                        (focus ? 'bg-fill-secondary' : 'bg-primary')
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
                </ComboboxOption>
              )}
          </ComboboxOptions>
        </Combobox>
      </Popper>
    </div>
  );
};

export default IssueCell;
