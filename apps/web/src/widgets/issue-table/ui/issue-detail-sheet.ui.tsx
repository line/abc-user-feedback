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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Divider,
  Icon,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  toast,
} from '@ufb/react';

import {
  client,
  ISSUES,
  SheetDetailTable,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import type { SheetDetailTableRow } from '@/shared/ui/sheet-detail-table.ui';
import type { Channel } from '@/entities/channel';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

interface Props {
  item: Issue;
  issueTracker?: IssueTracker;
  projectId: number;
}

const IssueDetailSheet = (props: Props) => {
  const { item, issueTracker, projectId } = props;
  const { t } = useTranslation();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [currentItem, setCurrentItem] = useState(item);

  const TOP_ROWS: SheetDetailTableRow[] = [
    { format: 'text', key: 'id', name: 'ID' },
    { format: 'date', key: 'createdAt', name: 'Created' },
    { format: 'date', key: 'updatedAt', name: 'Updated' },
  ];

  const BOTTON_ROWS: SheetDetailTableRow[] = [
    { format: 'keyword', key: 'name', name: 'Title' },
    { format: 'text', key: 'description', name: 'Description' },
    { format: 'select', key: 'status', name: 'Status', options: ISSUES(t) },
    { format: 'ticket', key: 'externalIssueId', name: 'Ticket', issueTracker },
  ];
  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });
  const { data: channelFeedbackCountData } = useQuery({
    queryKey: ['feedbackCountPerChannelByIssueId', channelData?.items],
    queryFn: async () => {
      const channels = (channelData?.items ?? []) as (Channel & {
        feedbackCount: number | undefined;
      })[];
      for (const channel of channels) {
        const { data } = await client.post({
          path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search',
          pathParams: { channelId: channel.id, projectId },
          body: { limit: 0, query: { issueIds: [item.id] } as never },
        });
        channel.feedbackCount = data?.meta.totalItems;
      }
      return channels;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: deleteIssue, isPending: isPendingDeletingIssue } =
    useOAIMutation({
      method: 'delete',
      path: '/api/admin/projects/{projectId}/issues/{issueId}',
      pathParams: {
        issueId: item.id,
        projectId: projectId,
      },
      queryOptions: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['/api/admin/projects/{projectId}/issues/search'],
          });
          toast.success(t('v2.toast.success'));
        },
      },
    });

  const { mutate: editIssue, isPending: isPendingEditingIssue } =
    useOAIMutation({
      method: 'put',
      path: '/api/admin/projects/{projectId}/issues/{issueId}',
      pathParams: {
        issueId: item.id,
        projectId: projectId,
      },
      queryOptions: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['/api/admin/projects/{projectId}/issues/search'],
          });
          setMode('view');
          toast.success(t('v2.toast.success'));
        },
      },
    });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="bg-neutral-primary border-neutral-tertiary rounded-8 shadow-default cursor-pointer border px-4 py-3 hover:opacity-60">
          <p className="text-neutral-primary text-base-strong">{item.name}</p>
          <p className="text-neutral-tertiary">{item.description}</p>
          <div className="text-neutral-secondary flex flex-wrap gap-x-2">
            <div className="flex flex-shrink-0 items-center gap-1">
              <Icon name="RiMessage2Line" size={12} />
              <span>{item.feedbackCount}</span>
              <span>feedbacks</span>
            </div>
            {item.externalIssueId && (
              <div className="flex flex-shrink-0 items-center gap-1">
                <Icon name="RiTicketLine" size={12} />
                <span>
                  {issueTracker?.ticketKey ?
                    `${issueTracker.ticketKey}-${item.externalIssueId}`
                  : item.externalIssueId}
                </span>
              </div>
            )}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('v2.text.name.detail', { name: 'Issue' })}</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <SheetDetailTable data={item} rows={TOP_ROWS} />
          <Divider variant="subtle" className="my-4" />
          <SheetDetailTable
            data={currentItem}
            rows={BOTTON_ROWS}
            mode={mode}
            onChange={(key, value) =>
              setCurrentItem((prev) => ({ ...prev, [key]: value }))
            }
          />
          <Divider variant="subtle" className="my-4" />
          <div className="space-y-2">
            {channelFeedbackCountData?.map((v) => (
              <div className="bg-neutral-primary border-neutral-tertiary rounded-8 flex cursor-pointer flex-col gap-2 border px-4 py-3 hover:opacity-60">
                <div className="text-base-strong">{v.name}</div>
                <div className="text-neutral-secondary text-small-normal flex items-center gap-1">
                  <Icon name="RiListIndefinite" size={12} />
                  {v.feedbackCount} feedbacks
                </div>
              </div>
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <div className="flex-1">
            <Button
              variant="destructive"
              onClick={() => deleteIssue(undefined)}
              loading={isPendingDeletingIssue}
            >
              {t('v2.button.delete')}
            </Button>
          </div>
          {mode === 'edit' && (
            <>
              <Button variant="secondary" onClick={() => setMode('view')}>
                {t('v2.button.cancel')}
              </Button>
              <Button
                onClick={() => editIssue(currentItem)}
                loading={isPendingEditingIssue}
              >
                {t('v2.button.save')}
              </Button>
            </>
          )}
          {mode === 'view' && (
            <>
              <SheetClose>{t('v2.button.cancel')}</SheetClose>
              <Button onClick={() => setMode('edit')}>
                {t('v2.button.edit')}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default IssueDetailSheet;
