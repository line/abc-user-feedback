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
import { useEffect, useMemo, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Icon, Popover, PopoverContent, PopoverTrigger, toast } from '@ufb/ui';

import { cn, usePermissions } from '@/shared';
import type { Field } from '@/entities/field';
import { useThemeStore } from '@/entities/theme';

import type { FeedbackColumnType } from '../feedback-table-columns';
import { useFeedbackDownload } from '../lib';
import { useFeedbackTable } from '../model';

interface IProps {
  query: Record<string, unknown>;
  fieldData: Field[];
  count?: number;
  isHead?: boolean;
  table: Table<FeedbackColumnType>;
}

const FeedbackTableDownloadButton: React.FC<IProps> = (props) => {
  const { query, table, fieldData, count, isHead = false } = props;

  const { channelId, projectId, createdAtRange } = useFeedbackTable();

  const { columnOrder, columnVisibility } = table.getState();
  const fieldIds = useMemo(() => {
    if (columnOrder.length === 0) return fieldData.map((v) => v.id);

    return fieldData
      .filter((v) => columnVisibility[v.key] !== false)
      .sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key))
      .map((v) => v.id);
  }, [columnOrder, columnVisibility, fieldData]);

  const [open, setOpen] = useState(false);
  const { theme } = useThemeStore();
  const perms = usePermissions(projectId);

  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    setIsClicked(false);
  }, [query]);

  const { mutateAsync } = useFeedbackDownload({
    params: { channelId, projectId },
    options: {
      onSuccess() {
        setIsClicked(false);
      },
      onError: (error) => {
        setIsClicked(false);
        toast.negative({ title: error.message });
      },
    },
  });

  const exportFeedbackResponse = (type: 'xlsx' | 'csv') => () => {
    setIsClicked(true);
    setOpen(false);
    void toast.promise(
      mutateAsync({
        type,
        fieldIds,
        query: {
          ...query,
          createdAt: {
            gte: dayjs(createdAtRange?.startDate).startOf('day').toISOString(),
            lt: dayjs(createdAtRange?.endDate).endOf('day').toISOString(),
          },
        },
      }),
      {
        title: {
          loading: t('main.feedback.download.loading'),
          success: t('main.feedback.download.success'),
          error: t('main.feedback.download.error'),
        },
        description: {
          loading: t('main.feedback.download.loading-description', { count }),
          success: t('main.feedback.download.success-description', { count }),
          error: t('main.feedback.download.error-description', { count }),
        },
      },
      theme,
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn([
          'btn btn-sm gap-2',
          isHead ? 'btn-tertiary' : 'btn-secondary',
        ])}
        disabled={!perms.includes('feedback_download_read')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex gap-1">
          <Icon name="Download" size={16} />
          {isHead ?
            t('main.feedback.button.select-download', { count })
          : t('main.feedback.button.all-download')}
        </div>
        <Icon name="ChevronDown" size={12} />
      </PopoverTrigger>
      <PopoverContent>
        <p className="font-12-bold px-3 py-3">
          {t('text.number-count', { count })}
        </p>
        <ul>
          <li>
            <button
              className="hover:bg-secondary flex w-full items-center justify-start gap-2 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={exportFeedbackResponse('xlsx')}
              disabled={isClicked}
            >
              <Icon name="Download" size={16} />
              <p className="font-12-regular whitespace-nowrap">
                {t('main.feedback.button.excel-download')}
              </p>
            </button>
          </li>
          <li>
            <button
              className="hover:bg-secondary flex w-full items-center justify-start gap-2 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={exportFeedbackResponse('csv')}
              disabled={isClicked}
            >
              <Icon name="Download" size={16} />
              <p className="font-12-regular whitespace-nowrap">
                {t('main.feedback.button.csv-download')}
              </p>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default FeedbackTableDownloadButton;
