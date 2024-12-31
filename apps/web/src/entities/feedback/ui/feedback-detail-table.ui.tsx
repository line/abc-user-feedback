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

import FeedbackDetailCell from './feedback-detail-cell.ui';
import FeedbackDetailEditingCell from './feedback-detail-editing-cell.ui';
import IssueCell from './issue-cell';

interface Props {
  rows: {
    field: FieldInfo;
    value: unknown;
    onChangeFeedback: (fieldKey: string, value: unknown) => void;
  }[];
  isEditing?: boolean;
}

const FeedbackDetailTable = (props: Props) => {
  const { rows, isEditing = false } = props;
  const feedbackId = useMemo(
    () =>
      rows.find(({ field }) => field.key === 'id')?.value as number | undefined,
    [rows],
  );

  return (
    <table>
      <tbody>
        {rows.map(({ field, value, onChangeFeedback }) => (
          <tr id={field.key}>
            <th className="text-neutral-tertiary min-w-[120px] py-2.5 align-top font-normal">
              <FieldFormatLabel format={field.format} name={field.name} />
            </th>
            <td className="w-full py-2.5">
              {field.key === 'issues' && feedbackId ?
                <IssueCell issues={value as Issue[]} feedbackId={feedbackId} />
              : isEditing && field.property === 'EDITABLE' ?
                <FeedbackDetailEditingCell
                  field={field}
                  value={value}
                  onChangeFeedback={onChangeFeedback}
                />
              : <FeedbackDetailCell field={field} value={value} />}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FeedbackDetailTable;
