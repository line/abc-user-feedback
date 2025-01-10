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
import { useTranslation } from 'react-i18next';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
  toast,
} from '@ufb/react';

import type { Field } from '@/entities/field';

import useFeedbackDownload from '../lib/use-feedback-download';

interface Props {
  fields: Field[];
  queries: Record<string, unknown>[];
}

const FeedbackTableDownload = ({ fields, queries }: Props) => {
  const router = useRouter();
  const { channelId, projectId } = router.query;
  const { t } = useTranslation();

  const { mutateAsync: download } = useFeedbackDownload({
    params: { channelId: Number(channelId), projectId: Number(projectId) },
  });

  const fieldIds = useMemo(
    () => fields.sort((a, b) => a.order - b.order).map((v) => v.id),
    [fields],
  );

  const exportFeedbackResponse = (type: 'xlsx' | 'csv') => () => {
    void toast.promise(download({ type, fieldIds, queries }), {
      success: () => t('main.feedback.download.success'),
      error: () => t('main.feedback.download.error'),
      loading: t('main.feedback.download.loading'),
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Icon name="RiDownload2Line" />
        Export
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem onClick={exportFeedbackResponse('xlsx')}>
          Excel
        </DropdownItem>
        <DropdownItem onClick={exportFeedbackResponse('csv')}>CSV</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default FeedbackTableDownload;
