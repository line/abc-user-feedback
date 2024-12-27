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

import { FieldFormatLabel } from '@/entities/field';
import type { FieldInfo } from '@/entities/field';
import type { Issue } from '@/entities/issue';

import FeedbackCell from './feedback-cell';
import IssueCell from './issue-cell';

interface Props {
  rows: { field: FieldInfo; value: unknown }[];
}

const FeedbackDetailTable = ({ rows }: Props) => {
  const feedbackId = useMemo(() => {
    return rows.find(({ field }) => field.key === 'id')?.value as
      | number
      | undefined;
  }, [rows]);
  return (
    <table>
      <tbody>
        {rows.map(({ field, value }) => (
          <tr id={field.key}>
            <th className="text-neutral-tertiary min-w-[120px] py-2.5 align-top font-normal">
              <FieldFormatLabel format={field.format} name={field.name} />
            </th>
            <td className="py-2.5">
              {field.key === 'issues' && feedbackId ?
                <IssueCell issues={value as Issue[]} feedbackId={feedbackId} />
              : <FeedbackCell field={field} isExpanded value={value} />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackDetailTable;
