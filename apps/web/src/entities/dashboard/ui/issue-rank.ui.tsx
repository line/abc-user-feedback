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
import { encode } from 'js-base64';
import { useTranslation } from 'next-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxSelectItem,
  ComboboxTrigger,
  Icon,
} from '@ufb/react';

import { DescriptionTooltip, ISSUES, Path } from '@/shared';
import { DashboardTable } from '@/shared/ui';
import type { IssueStatus } from '@/entities/issue';
import { IssueBadge, useIssueSearch } from '@/entities/issue';

interface IssueTableData {
  id: number;
  no: number;
  status: IssueStatus;
  name: string;
  count: number;
}

const columnHelper = createColumnHelper<IssueTableData>();
const getColumns = (t: TFunction) => [
  columnHelper.accessor('no', {
    header: 'No',
    enableSorting: false,
    size: 30,
  }),
  columnHelper.accessor('name', {
    header: 'Issue',
    enableSorting: false,
    cell({ getValue, row }) {
      const router = useRouter();
      return (
        <>
          <span>{getValue()}</span>
          <Link
            href={{
              pathname: Path.ISSUE,
              query: {
                projectId: router.query.projectId,
                queries: encode(
                  JSON.stringify([
                    { name: row.original.name, condition: 'IS' },
                  ]),
                ),
              },
            }}
            target="_blank"
            rel="noreferrer"
            className="ml-1"
          >
            <Icon
              name="RiExternalLinkFill"
              size={16}
              className="cursor-pointer"
            />
          </Link>
        </>
      );
    },
  }),
  columnHelper.accessor('count', {
    header: () => (
      <div className="flex items-center">
        <p>Count</p>
        <DescriptionTooltip description={t('tooltip.issue-feedback-count')} />
      </div>
    ),
    cell: ({ getValue }) => <p>{getValue().toLocaleString()}</p>,
    enableSorting: false,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell({ getValue }) {
      return <IssueBadge status={getValue()} />;
    },
  }),
];
interface IProps {
  projectId: number;
  from: Date;
  to: Date;
}
const limitOptions = [
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '15', value: '15' },
  { label: '20', value: '20' },
];

const IssueRank: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();

  const issues = useMemo(() => ISSUES(t), [t]);
  const [limit, setLimit] = useState(Number(limitOptions[0]?.value ?? 0));

  const [currentIssueStatusList, setCurrentIssueStatusList] = useState(issues);

  const { data } = useIssueSearch(projectId, {
    sort: { feedbackCount: 'DESC' },
    limit,
    queries: currentIssueStatusList.map((v) => ({
      status: v.key,
      condition: 'IS',
    })),
    operator: 'OR',
  });

  const newData = useMemo(
    () =>
      data?.items.map((item, i) => ({
        id: item.id,
        no: i + 1,
        count: item.feedbackCount,
        name: item.name,
        status: item.status,
      })) ?? [],
    [data, t],
  );
  const columns = useMemo(() => getColumns(t), [t]);

  const table = useReactTable({
    columns,
    data: newData,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DashboardTable
      title={t('chart.issue-rank.title')}
      description={t('chart.issue-rank.description')}
      table={table}
      selectData={{
        options: limitOptions,
        value: String(limit),
        onChange: (v) => setLimit(Number(v)),
      }}
      filterContent={
        <Combobox>
          <ComboboxTrigger>
            <Icon name="RiFilter3Line" />
            Filter
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxList>
              {issues.map((issue) => (
                <ComboboxSelectItem
                  key={issue.key}
                  checked={currentIssueStatusList.some(
                    ({ key }) => key === issue.key,
                  )}
                  onSelect={() => {
                    const isChecked = currentIssueStatusList.some(
                      ({ key }) => key === issue.key,
                    );
                    setCurrentIssueStatusList((prev) =>
                      isChecked ?
                        prev.filter((v) => v.key !== issue.key)
                      : [...prev, issue],
                    );
                  }}
                >
                  {issue.name}
                </ComboboxSelectItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      }
    />
  );
};

export default IssueRank;
