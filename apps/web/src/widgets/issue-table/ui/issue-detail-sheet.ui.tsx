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
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { encode } from 'js-base64';
import { useTranslation } from 'next-i18next';

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
  Tag,
  toast,
} from '@ufb/react';

import type { FormOverlayProps } from '@/shared';
import {
  client,
  DeleteDialog,
  isObjectEqual,
  ISSUES,
  SheetDetailTable,
  useAllChannels,
  useOAIMutation,
  usePermissions,
} from '@/shared';
import type { SheetDetailTableRow } from '@/shared/ui/sheet-detail-table.ui';
import type { Channel } from '@/entities/channel';
import type { Issue } from '@/entities/issue';
import type { IssueTracker } from '@/entities/issue-tracker';

interface Props extends Omit<FormOverlayProps<Issue>, 'onSubmit'> {
  projectId: number;
  issueTracker?: IssueTracker;
  data: Issue;
  onSubmit?: undefined;
}

const IssueDetailSheet = (props: Props) => {
  const { issueTracker, projectId, data, close, isOpen } = props;

  const perms = usePermissions(projectId);
  const { t } = useTranslation();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [currentItem, setCurrentItem] = useState(data);
  const overlay = useOverlay();
  const TOP_ROWS: SheetDetailTableRow[] = [
    { format: 'text', key: 'id', name: 'ID' },
    { format: 'date', key: 'createdAt', name: 'Created' },
    { format: 'date', key: 'updatedAt', name: 'Updated' },
    { format: 'cateogry', key: 'category', name: 'Category', issueId: data.id },
  ];

  const BOTTON_ROWS: SheetDetailTableRow[] = [
    { format: 'keyword', key: 'name', name: 'Title', editable: true },
    { format: 'text', key: 'description', name: 'Description', editable: true },
    {
      format: 'select',
      key: 'status',
      name: 'Status',
      options: ISSUES(t),
      editable: true,
    },
    {
      format: 'ticket',
      key: 'externalIssueId',
      name: 'Ticket',
      issueTracker,
      editable: true,
    },
  ];

  const { data: channelData } = useAllChannels(projectId);

  const { data: channelFeedbackCountData, isLoading } = useQuery({
    queryKey: [
      '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search',
      channelData?.items.map((v) => v.id),
      data.id,
    ],
    queryFn: async () => {
      const channels = (channelData?.items ?? []) as (Channel & {
        feedbackCount: number;
      })[];

      for (const channel of channels) {
        const { data: feeedbakData } = await client.post({
          path: '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search',
          pathParams: { channelId: channel.id, projectId },
          body: { limit: 0, queries: [{ issueIds: [data.id] }] as never },
        });
        channel.feedbackCount = feeedbakData?.meta.totalItems ?? 0;
      }

      return channels;
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: deleteIssue, isPending: isPendingDeletingIssue } =
    useOAIMutation({
      method: 'delete',
      path: '/api/admin/projects/{projectId}/issues/{issueId}',
      pathParams: {
        issueId: data.id,
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
        issueId: data.id,
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

  const openDeleteDialog = () => {
    overlay.open(({ close: dialogClose, isOpen }) => (
      <DeleteDialog
        close={dialogClose}
        isOpen={isOpen}
        onClickDelete={async () => {
          await deleteIssue(undefined);
          dialogClose();
          close();
        }}
      />
    ));
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {t('v2.text.name.detail', { name: 'Issue' })}
            <Tag
              variant="outline"
              size="small"
              className="cursor-pointer"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/${window.location.pathname}?queries=${encode(JSON.stringify([{ name: data.name, condition: 'IS' }]))}`,
                );
                toast(t('v2.toast.copy'), {
                  icon: <Icon name="RiCheckboxMultipleFill" />,
                });
              }}
            >
              Copy URL
            </Tag>
          </SheetTitle>
        </SheetHeader>
        <SheetBody>
          <SheetDetailTable data={data} rows={TOP_ROWS} />
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
          <div className="flex flex-col gap-2">
            {isLoading && <Icon name="RiLoader5Line" className="spinner" />}
            {channelFeedbackCountData
              ?.filter((v) => !!v.feedbackCount)
              .map((v) => (
                <Link
                  key={v.id}
                  href={{
                    pathname: '/main/project/[projectId]/feedback',
                    query: {
                      projectId,
                      channelId: v.id,
                      queries: encode(
                        JSON.stringify([
                          { issueIds: [data.id], condition: 'IS' },
                        ]),
                      ),
                    },
                  }}
                  target="_blank"
                >
                  <div className="bg-neutral-primary border-neutral-tertiary rounded-8 flex cursor-pointer flex-col gap-2 border px-4 py-3 hover:opacity-60">
                    <div className="text-base-strong">{v.name}</div>
                    <div className="text-neutral-secondary text-small-normal flex items-center gap-1">
                      <Icon name="RiListIndefinite" size={12} />
                      {v.feedbackCount} feedbacks
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <div className="flex-1">
            <Button
              variant="destructive"
              onClick={openDeleteDialog}
              loading={isPendingDeletingIssue}
              disabled={!perms.includes('issue_delete')}
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
                disabled={isObjectEqual(
                  { ...data, updatedAt: '' },
                  { ...currentItem, updatedAt: '' },
                )}
              >
                {t('v2.button.save')}
              </Button>
            </>
          )}
          {mode === 'view' && (
            <>
              <SheetClose>{t('v2.button.cancel')}</SheetClose>
              <Button
                onClick={() => setMode('edit')}
                disabled={!perms.includes('issue_update')}
              >
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
