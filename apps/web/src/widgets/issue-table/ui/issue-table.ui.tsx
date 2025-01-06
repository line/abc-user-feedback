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
import type { TFunction } from 'next-i18next';
import { useTranslation } from 'next-i18next';

import { Badge, Button, Icon } from '@ufb/react';

import { cn, DateRangePicker, TableSearchPopover, useOAIQuery } from '@/shared';
import { useIssueSearch } from '@/entities/issue';
import type { Issue, IssueStatus } from '@/entities/issue';

import { env } from '@/env';
import { useIssueCount, useIssueQuery } from '../lib';

interface IssuesItem {
  key: IssueStatus;
  name: string;
  bgClassName: string;
  fgClassName: string;
}

export const ISSUES: (t: TFunction) => IssuesItem[] = (t) => [
  {
    key: 'INIT',
    name: t('text.issue.init'),
    bgClassName: 'bg-yellow-50',
    fgClassName: 'bg-yellow-500',
  },
  {
    key: 'ON_REVIEW',
    name: t('text.issue.onReview'),
    bgClassName: 'bg-green-50',
    fgClassName: 'bg-green-500',
  },
  {
    key: 'IN_PROGRESS',
    name: t('text.issue.inProgress'),
    bgClassName: 'bg-teal-50',
    fgClassName: 'bg-teal-500',
  },
  {
    key: 'RESOLVED',
    name: t('text.issue.resolved'),
    bgClassName: 'bg-slate-50',
    fgClassName: 'bg-slate-500',
  },
  {
    key: 'PENDING',
    name: t('text.issue.pending'),
    bgClassName: 'bg-indigo-50',
    fgClassName: 'bg-indigo-500',
  },
];

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const IssueTable: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const { dateRange, setDateRange } = useIssueQuery(projectId);

  const { data: issueCountData } = useIssueCount(projectId, {});

  const { data: issueTracker } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });

  const { data: initData } = useIssueSearch(projectId, {
    query: { status: 'INIT' },
  });
  const { data: onReviewData } = useIssueSearch(projectId, {
    query: { status: 'ON_REVIEW' },
  });
  const { data: inProgressData } = useIssueSearch(projectId, {
    query: { status: 'IN_PROGRESS' },
  });
  const { data: resolvedData } = useIssueSearch(projectId, {
    query: { status: 'RESOLVED' },
  });
  const { data: pendingData } = useIssueSearch(projectId, {
    query: { status: 'PENDING' },
  });
  const data: Record<IssueStatus, Issue[] | undefined> = {
    INIT: initData?.items,
    ON_REVIEW: onReviewData?.items,
    IN_PROGRESS: inProgressData?.items,
    RESOLVED: resolvedData?.items,
    PENDING: pendingData?.items,
  };

  return (
    <>
      <div className="mb-3 flex justify-between">
        <Button variant="outline">
          <Icon name="RiAddLine" /> {t('main.feedback.issue-cell.create-issue')}
        </Button>
        <div className="flex gap-2">
          <DateRangePicker
            onChange={(v) => setDateRange(v)}
            value={dateRange}
            maxDate={new Date()}
            maxDays={env.NEXT_PUBLIC_MAX_DAYS}
          />
          <TableSearchPopover
            onSubmit={(filters) => {
              console.log(filters);
            }}
            filterFields={[
              {
                format: 'text',
                key: 'name',
                name: 'Title',
              },
              {
                format: 'select',
                key: 'status',
                name: 'Status',
                options: ISSUES(t).map((issue) => ({
                  key: issue.key,
                  name: issue.name,
                })),
              },
              {
                format: 'text',
                key: 'description',
                name: 'Description',
              },
              {
                format: 'text',
                key: 'ticket',
                name: 'issueId',
              },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {ISSUES(t).map((issue) => (
          <div
            key={issue.key}
            className={cn(
              'rounded-16 flex flex-col gap-2 px-2 py-3',
              issue.bgClassName,
            )}
          >
            <div
              className={
                'text-neutral-inverse rounded-8 text-base-strong flex items-center justify-between px-4 py-2 ' +
                issue.fgClassName
              }
            >
              <div className="flex items-center gap-1">
                {issue.name}
                <Badge variant="subtle" radius="large">
                  {
                    issueCountData?.find((item) => item.key === issue.key)
                      ?.count
                  }
                </Badge>
              </div>

              <span>
                <Icon name="RiArrowUpDownFill" size={20} />
              </span>
            </div>
            {data[issue.key]?.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-primary border-neutral-tertiary rounded-8 shadow-default border px-4 py-3"
              >
                <p className="text-neutral-primary text-base-strong">
                  {item.name}
                </p>
                <p className="text-neutral-tertiary">{item.description}</p>
                <div className="text-neutral-secondary flex gap-2">
                  <div className="flex items-center gap-1">
                    <Icon name="RiMessage2Line" size={12} />
                    <span>{item.feedbackCount}</span>
                    <span>feedbacks</span>
                  </div>
                  {item.externalIssueId && (
                    <div className="flex items-center gap-1">
                      <Icon name="RiTicketLine" size={12} />
                      <span>{`${issueTracker?.data.ticketKey ?? ''} - ${item.externalIssueId}`}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default IssueTable;
