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

import { cn, useOAIMutation, usePermissions } from '@/shared';
import type { Issue } from '@/entities/issue';

interface IProps {
  issue: Issue;
  projectId: number;
  onClose: () => void;
  refetch: () => void | Promise<void>;
}

const IssueSetting: React.FC<IProps> = (props) => {
  const { issue, projectId, onClose, refetch } = props;

  const { t } = useTranslation();
  const perms = usePermissions();

  const { mutate: update, isPending: updatePending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/issues/{issueId}',
    pathParams: { issueId: issue.id, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const { mutate: deleteIssue, isPending: deleteIssuePending } = useOAIMutation(
    {
      method: 'delete',
      path: '/api/admin/projects/{projectId}/issues/{issueId}',
      pathParams: { projectId, issueId: issue.id },
      queryOptions: {
        async onSuccess() {
          await refetch();
          toast.negative({ title: t('toast.delete') });
        },
        onError(error) {
          toast.negative({ title: error.message });
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
            disabled={!perms.includes('issue_update') || updatePending}
          />
        </li>
        <li
          className={cn([
            'hover:bg-fill-quaternary m-1 flex cursor-pointer items-center gap-2 rounded-sm p-2',
            !perms.includes('issue_delete') || deleteIssuePending ?
              'text-tertiary cursor-not-allowed'
            : 'text-primary cursor-pointer',
          ])}
          onClick={() => {
            if (!perms.includes('issue_delete') || deleteIssuePending) return;
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
