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
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxTrigger,
} from '@ufb/react';

import { IssueBadge } from '@/entities/issue';
import type { Issue } from '@/entities/issue';

interface IProps {
  issues?: Issue[];
}

const IssueCell: React.FC<IProps> = (props) => {
  const { issues } = props;

  return (
    <div
      className="flex flex-wrap items-center gap-1 rounded"
      onClick={(e) => e.stopPropagation()}
    >
      {issues?.map((issue) => <IssueBadge key={issue.id} issue={issue} />)}
      <Combobox>
        <ComboboxTrigger>test</ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput></ComboboxInput>
          <ComboboxGroup></ComboboxGroup>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default IssueCell;
