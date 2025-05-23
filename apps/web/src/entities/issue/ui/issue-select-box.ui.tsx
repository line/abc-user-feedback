/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useThrottle } from 'react-use';

import { client } from '@/shared';
import AsyncMultiSelectSearchInput from '@/shared/ui/inputs/async-multi-select-search-input.ui';

import { useIssueSearchInfinite } from '../lib';

interface Props {
  onChange: (value?: number[]) => void;
  value?: number[];
}

const IssueSelectBox = ({ onChange, value }: Props) => {
  const router = useRouter();
  const projectId = Number(router.query.projectId as string);
  const [selectedIssues, setSelectedIssues] = useState<
    { label: string; value: string }[]
  >([]);

  const [inputValue, setInputValue] = useState('');
  const throttedValue = useThrottle(inputValue, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useIssueSearchInfinite(projectId, {
      queries: [{ key: 'name', value: throttedValue, condition: 'CONTAINS' }],
      sort: { name: 'ASC' },
    });

  useEffect(() => {
    if (!value) {
      setSelectedIssues([]);
      return;
    }

    void Promise.all(
      value.map(async (issueId) => {
        const { data } = await client.get({
          path: '/api/admin/projects/{projectId}/issues/{issueId}',
          pathParams: { projectId, issueId },
        });
        return { label: data.name, value: String(issueId) };
      }),
    ).then((v) => setSelectedIssues(v));
  }, [value]);

  return (
    <AsyncMultiSelectSearchInput
      options={data.pages.flatMap((page) =>
        page ?
          page.items.map(({ name, id }) => ({ label: name, value: String(id) }))
        : [],
      )}
      value={selectedIssues}
      onChange={(input) => onChange(input.map((v) => Number(v.value)))}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

export default IssueSelectBox;
