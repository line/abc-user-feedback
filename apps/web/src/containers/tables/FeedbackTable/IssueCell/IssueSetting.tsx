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
import { useTranslation } from 'react-i18next';

import { Icon, toast } from '@ufb/ui';

import { useOAIMutation, usePermissions } from '@/hooks';
import type { IssueType } from '@/types/issue.type';

interface IProps {
  issue: IssueType;
  projectId: number;
  onClose: () => void;
  refetch: () => void;
}

const IssueSetting: React.FC<IProps> = ({
  issue: issue,
  projectId,
  onClose,
  refetch,
}) => {
  const { t } = useTranslation();
  const perms = usePermissions();

  const { mutate: update, isLoading: updateLoading } = useOAIMutation({
    method: 'put',
    path: '/api/projects/{projectId}/issues/{issueId}',
    pathParams: { issueId: issue.id, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  const { mutate: deleteIssue, isLoading: deleteIssueLoading } = useOAIMutation(
    {
      method: 'delete',
      path: '/api/projects/{projectId}/issues/{issueId}',
      pathParams: { projectId, issueId: issue.id },
      queryOptions: {
        async onSuccess() {
          refetch();
          toast.negative({ title: t('toast.delete') });
        },
        onError(error) {
          toast.negative({ title: error?.message ?? 'Error' });
        },
      },
    },
  );
  const [inputIssueName, setInputIssueName] = useState(issue.name);

  return (
    <div className="absolute cursor-default">
      <div className="fixed inset-0" onClick={onClose} />
      <ul className="bg-primary absolute w-[200px] rounded border">
        <li className="px-3 py-1.5">
          <input
            className="input input-sm"
            value={inputIssueName}
            onChange={(e) => setInputIssueName(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') update({ ...issue, name: inputIssueName });
            }}
            disabled={!perms.includes('issue_update') || updateLoading}
          />
        </li>
        <li
          className={[
            'hover:bg-fill-quaternary m-1 flex cursor-pointer items-center gap-2 rounded-sm p-2',
            !perms.includes('issue_delete') || deleteIssueLoading
              ? 'text-tertiary cursor-not-allowed'
              : 'text-primary cursor-pointer',
          ].join(' ')}
          onClick={() => {
            if (!perms.includes('issue_delete') || deleteIssueLoading) return;
            deleteIssue(undefined);
          }}
        >
          <Icon name="TrashStroke" size={16} className="text-secondary" />
          <span>{t('main.feedback.issue-cell.delete-issue')}</span>
        </li>
      </ul>
    </div>
  );
};

export default IssueSetting;
