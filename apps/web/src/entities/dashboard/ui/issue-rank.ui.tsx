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
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { useTranslation } from 'next-i18next';

import { Icon, PopoverCloseButton } from '@ufb/ui';

import { ISSUES, Path } from '@/shared';
import { DashboardTable } from '@/shared/ui';

import { DescriptionTooltip } from '@/components';
import { useIssueSearch } from '@/hooks';

interface IssueTableData {
  id: number;
  no: number;
  status: string;
  name: string;
  count: number;
}

const columnHelper = createColumnHelper<IssueTableData>();
const columns = (t: TFunction) => [
  columnHelper.accessor('no', { header: 'No', enableSorting: false, size: 50 }),
  columnHelper.accessor('name', {
    header: 'Issue',
    enableSorting: false,
    cell({ getValue, row }) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <div className="flex items-center gap-1">
          <p>{getValue()}</p>
          <Link
            href={{
              pathname: Path.ISSUE,
              query: { projectId: router.query.projectId, id: row.original.id },
            }}
            target="_blank"
            rel="noreferrer"
          >
            <Icon
              name="RightCircleStroke"
              size={16}
              className="text-tertiary cursor-pointer"
            />
          </Link>
        </div>
      );
    },
    size: 200,
  }),
  columnHelper.accessor('count', {
    header: () => (
      <div className="flex items-center">
        <p>Count</p>
        <DescriptionTooltip description={t('tooltip.issue-feedback-count')} />
      </div>
    ),
    cell: ({ getValue }) => <p>{getValue().toLocaleString()}</p>,
    size: 50,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    size: 50,
  }),
];
interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}
const limitOptions = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
];

const IssueRank: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const issues = useMemo(() => ISSUES(t), [t]);
  const [limit, setLimit] = useState(limitOptions[0]?.value ?? 0);

  const [currentIssueStatusList, setCurrentIssueStatusList] = useState(issues);

  const { data } = useIssueSearch(projectId, {
    sort: { feedbackCount: 'DESC' } as any,
    limit,
    query: { statuses: currentIssueStatusList.map((v) => v.key) },
  });

  const newData = useMemo(
    () =>
      data?.items.map((item, i) => ({
        id: item.id,
        no: i + 1,
        count: item.feedbackCount,
        name: item.name,
        status: ISSUES(t).find((v) => v.key === item.status)?.name ?? '',
      })) ?? [],
    [data, t],
  );

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columns: columns(t),
    data: newData,
    enableSorting: true,
  });

  return (
    <DashboardTable
      title={t('chart.issue-rank.title')}
      description={t('chart.issue-rank.description')}
      table={table}
      selectData={{
        options: limitOptions,
        defaultValue: limitOptions[0],
        onChange: (v) => setLimit(v?.value ?? 5),
      }}
      filterContent={
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex justify-between">
            <h1 className="font-16-bold">
              {t('popover.select-issue-status.issue-status')}{' '}
              <span>
                {currentIssueStatusList.length}
                <span className="text-tertiary">/5</span>
              </span>
            </h1>
            <PopoverCloseButton />
          </div>
          <ul>
            {issues.map((issue) => (
              <li key={issue.key} className="py-1">
                <label className="flex cursor-pointer items-center gap-2 py-1">
                  <input
                    className="checkbox checkbox-sm"
                    type="checkbox"
                    checked={currentIssueStatusList.some(
                      ({ key }) => key === issue.key,
                    )}
                    onChange={(e) =>
                      e.currentTarget.checked ?
                        setCurrentIssueStatusList((prev) => [...prev, issue])
                      : setCurrentIssueStatusList((prev) =>
                          prev.filter((v) => v.key !== issue.key),
                        )
                    }
                  />
                  <p className="font-12-regular flex-1">{issue.name}</p>
                </label>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
};

export default IssueRank;
