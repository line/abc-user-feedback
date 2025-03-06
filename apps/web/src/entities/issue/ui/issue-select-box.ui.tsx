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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useThrottle } from 'react-use';

import { client, SelectSearchInput } from '@/shared';

import { useIssueSearchInfinite } from '../lib';

interface Props {
  onChange: (value?: string) => void;
  value?: string;
}

const IssueSelectBox = ({ onChange, value }: Props) => {
  const router = useRouter();
  const projectId = Number(router.query.projectId as string);
  const [issueName, setIssueName] = useState(value);

  const [inputValue, setInputValue] = useState('');
  const throttedValue = useThrottle(inputValue, 500);
  const { data, fetchNextPage, hasNextPage } = useIssueSearchInfinite(
    projectId,
    { queries: [{ name: throttedValue, condition: 'CONTAINS' }] },
  );

  useEffect(() => {
    if (!value) {
      setIssueName(undefined);
      return;
    }
    const issueId = parseInt(value);
    if (isNaN(issueId)) {
      setIssueName(value);
      return;
    }
    void client
      .get({
        path: '/api/admin/projects/{projectId}/issues/{issueId}',
        pathParams: { projectId, issueId },
      })
      .then(({ data }) => setIssueName(data.name));
  }, [value]);

  return (
    <SelectSearchInput
      options={data.pages.flatMap((page) =>
        page ?
          page.items.map(({ name }) => ({ label: name, value: name }))
        : [],
      )}
      value={issueName}
      onChange={(v) => onChange(v)}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      inputValue={inputValue}
      setInputValue={setInputValue}
    />
  );
};

export default IssueSelectBox;
