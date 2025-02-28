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
import { useThrottle } from 'react-use';

import { SelectSearchInput } from '@/shared';

import { useIssueSearchInfinite } from '../lib';

interface Props {
  onChange: (value?: string) => void;
  value?: string;
}

const IssueSelectBox = ({ onChange, value }: Props) => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const [inputValue, setInputValue] = useState('');
  const throttedValue = useThrottle(inputValue, 500);
  const { data, fetchNextPage, hasNextPage, isFetching } =
    useIssueSearchInfinite(Number(projectId), {
      queries: [{ name: throttedValue, condition: 'CONTAINS' }],
    });
  console.log('page: ', data.pages);

  return (
    <SelectSearchInput
      options={data.pages.flatMap((page) =>
        page ?
          page.items.map(({ name }) => ({ label: name, value: name }))
        : [],
      )}
      value={value}
      onChange={onChange}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isFetching={isFetching}
    />
  );
};

export default IssueSelectBox;
