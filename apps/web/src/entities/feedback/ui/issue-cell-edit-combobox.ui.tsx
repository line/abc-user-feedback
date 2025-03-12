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
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import {
  Badge,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
  TextInput,
  toast,
} from '@ufb/react';

import { useOAIMutation, usePermissions } from '@/shared';
import type { Issue } from '@/entities/issue';

interface Props {
  issue: Issue;
}

const IssueCellEditCombobox = (props: Props) => {
  const { issue } = props;

  const { t } = useTranslation();
  const perms = usePermissions();
  const router = useRouter();
  const projectId = Number(router.query.projectId);

  const [inputIssueName, setInputIssueName] = useState(issue.name);
  const queryClient = useQueryClient();
  const refetch = async () => {
    await queryClient.invalidateQueries({
      queryKey: [
        '/api/admin/projects/{projectId}/channels/{channelId}/feedbacks/search',
      ],
    });
    await queryClient.invalidateQueries({
      queryKey: ['/api/admin/projects/{projectId}/issues/search'],
    });
  };

  const { mutate: update } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/issues/{issueId}',
    pathParams: { issueId: issue.id, projectId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const { mutate: deleteIssue } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/issues/{issueId}',
    pathParams: { projectId, issueId: issue.id },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button>
          <Badge onClick={(e) => e.stopPropagation()} variant="subtle">
            Edit
          </Badge>
        </button>
      </DropdownTrigger>
      <DropdownContent onClick={(e) => e.stopPropagation()} side="right">
        <div className="border-b">
          <TextInput
            className="border-none"
            value={inputIssueName}
            onChange={(e) => setInputIssueName(e.currentTarget.value)}
            disabled={!perms.includes('issue_update')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                const name = inputIssueName.trim();
                update({ ...issue, name });
                setInputIssueName(name);
              }
            }}
          />
        </div>
        <DropdownItem
          className="gap-2"
          onSelect={() => deleteIssue(undefined)}
          disabled={!perms.includes('issue_delete')}
        >
          <Icon name="RiDeleteBin5Fill" size={16} />
          Delete Issue
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default IssueCellEditCombobox;
