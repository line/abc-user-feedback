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

import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Popover, PopoverModalContent, toast } from '@ufb/ui';

import type { Issue } from '@/entities/issue';

import { useOAIMutation } from '@/hooks';

interface IProps {
  open: boolean;
  close: () => void;
  onSuccess: () => Promise<void>;
  projectId: number;
  table: Table<Issue>;
}

const IssueDeletionPopover: React.FC<IProps> = (props) => {
  const { close, open, onSuccess, projectId, table } = props;
  const { rowSelection } = table.getState();

  const { mutate: deleteIssues, isPending: deleteIssuesPending } =
    useOAIMutation({
      method: 'delete',
      path: '/api/admin/projects/{projectId}/issues',
      pathParams: { projectId },
      queryOptions: {
        onSuccess,
        onError(error) {
          toast.negative({ title: error?.message ?? 'Error' });
        },
      },
    });

  const { t } = useTranslation();

  return (
    <Popover open={open} onOpenChange={close} modal>
      <PopoverModalContent
        title={t('main.issue.dialog.delete-issue.title')}
        description={t('main.issue.dialog.delete-issue.description')}
        cancelButton={{ children: t('button.cancel') }}
        submitButton={{
          children: t('button.delete'),
          onClick: () =>
            deleteIssues({
              issueIds: Object.keys(rowSelection).map((v) => parseInt(v)),
            }),
          disabled: deleteIssuesPending,
        }}
        icon={{
          name: 'WarningCircleFill',
          className: 'text-red-primary',
          size: 56,
        }}
      />
    </Popover>
  );
};

export default IssueDeletionPopover;
