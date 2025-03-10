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

import { useMemo } from 'react';
import { useRouter } from 'next/router';
import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownTrigger,
  Icon,
  toast,
} from '@ufb/react';

import type { TableFilterOperator } from '@/shared';
import type { Field } from '@/entities/field';

import type { Feedback } from '../feedback.type';
import useFeedbackDownload from '../lib/use-feedback-download';

interface Props {
  fields: Field[];
  queries: Record<string, unknown>[];
  disabled: boolean;
  table: Table<Feedback>;
  operator: TableFilterOperator;
  totalItems: number;
}

const FeedbackTableDownload = (props: Props) => {
  const { fields, queries, disabled, table, operator, totalItems } = props;
  const router = useRouter();
  const { channelId, projectId } = router.query;
  const { t } = useTranslation();

  const { mutateAsync: download } = useFeedbackDownload({
    params: { channelId: Number(channelId), projectId: Number(projectId) },
  });

  const visibleColumns = table.getVisibleFlatColumns();
  const { rowSelection } = table.getState();
  const feedbackIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([_, v]) => !!v)
        .map(([k]) => Number(k)),
    [rowSelection],
  );

  const fieldIds = useMemo(
    () =>
      fields
        .filter((v) => visibleColumns.some((column) => column.id === v.key))
        .sort((a, b) => a.order - b.order)
        .map((v) => v.id),
    [fields, visibleColumns],
  );

  const exportFeedbackResponse = (type: 'xlsx' | 'csv') => () => {
    void toast.promise(
      download({
        type,
        fieldIds,
        queries,
        operator,
        filterFeedbackIds: feedbackIds.length > 0 ? feedbackIds : undefined,
      }),
      {
        success: () => t('main.feedback.download.success'),
        error: () => t('main.feedback.download.error'),
        loading: t('main.feedback.download.loading'),
      },
    );
  };

  return (
    <Dropdown>
      <DropdownTrigger disabled={disabled}>
        <Icon name="RiDownload2Line" />
        Export
      </DropdownTrigger>
      <DropdownContent>
        <DropdownLabel>
          {feedbackIds.length > 0 ? feedbackIds.length : totalItems} Items
        </DropdownLabel>
        <DropdownItem onClick={exportFeedbackResponse('xlsx')}>
          Excel
        </DropdownItem>
        <DropdownItem onClick={exportFeedbackResponse('csv')}>CSV</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default FeedbackTableDownload;
