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
import { Icon, Popover, PopoverContent, PopoverTrigger, toast } from '@ufb/ui';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';

import { useDownload, usePermissions } from '@/hooks';
import { IFetchError } from '@/types/fetch-error.type';
import themeStore from '@/zustand/theme.store';

import useFeedbackTable from '../feedback-table.context';

export interface IDownloadButtonProps {
  query: any;
  count?: number;
  isHead?: boolean;
}

const DownloadButton: React.FC<IDownloadButtonProps> = ({
  count,
  query,
  isHead = false,
}) => {
  const [open, setOpen] = useState(false);
  const { theme } = useStore(themeStore);
  const { channelId, projectId, createdAtRange } = useFeedbackTable();
  const perms = usePermissions(projectId);

  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    setIsClicked(false);
  }, [query]);

  const { mutateAsync } = useDownload({
    params: {
      channelId,
      projectId,
    },
    options: {
      onSuccess: async () => {
        setIsClicked(false);
      },
      onError: (err) => {
        setIsClicked(false);
        const error = err as IFetchError;
        toast.negative({ title: error.message });
      },
    },
  });

  const exportFeedbackResponse = (type: 'xlsx' | 'csv') => () => {
    setIsClicked(true);
    setOpen(false);
    toast.promise(
      mutateAsync({
        type,
        limit: count,
        page: 1,
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

  const btnCls = useMemo(
    () => (isHead ? 'btn-tertiary' : 'btn-secondary'),
    [isHead],
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={['btn btn-sm gap-2', btnCls].join(' ')}
        disabled={!perms.includes('feedback_download_read')}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="Download" size={16} />
        {isHead
          ? t('main.feedback.button.select-download', { count })
          : t('main.feedback.button.all-download')}
      </PopoverTrigger>
      <PopoverContent>
        <p className="px-3 py-3 font-12-bold">
          {t('text.number-count', { count })}
        </p>
        <ul>
          <li>
            <button
              className="flex items-center justify-start px-3 py-2 gap-2 w-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={exportFeedbackResponse('xlsx')}
              disabled={isClicked}
            >
              <Icon name="Download" size={16} />
              <p className="whitespace-nowrap font-12-regular">
                {t('main.feedback.button.excel-download')}
              </p>
            </button>
          </li>
          <li>
            <button
              className="flex items-center justify-start px-3 py-2 gap-2 w-full hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={exportFeedbackResponse('csv')}
              disabled={isClicked}
            >
              <Icon name="Download" size={16} />
              <p className="whitespace-nowrap font-12-regular">
                {t('main.feedback.button.csv-download')}
              </p>
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default DownloadButton;
