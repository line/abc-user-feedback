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

import dayjs from 'dayjs';

import { Badge } from '@ufb/react';

import { DATE_TIME_FORMAT, ImagePreviewButton } from '@/shared';
import type { FieldInfo } from '@/entities/field';

interface Props {
  field: FieldInfo;
  value: unknown;
}

const FeedbackDetailCell = (props: Props) => {
  const { field, value } = props;
  return (
    <>
      {typeof value === 'undefined' ?
        '-'
      : field.format === 'date' ?
        dayjs(value as string).format(DATE_TIME_FORMAT)
      : field.format === 'multiSelect' ?
        <div className="flex gap-2">
          {(value as string[])
            .sort(
              (aKey, bKey) =>
                (field.options ?? []).findIndex(
                  (option) => option.key === aKey,
                ) -
                (field.options ?? []).findIndex(
                  (option) => option.key === bKey,
                ),
            )
            .map((key) => (
              <Badge variant="subtle">
                {
                  (field.options?.find((option) => option.key === key)?.name ??
                    value) as string
                }
              </Badge>
            ))}
        </div>
      : field.format === 'select' ?
        <Badge variant="subtle">
          {field.options?.find((option) => option.key === value)?.name ?? ''}
        </Badge>
      : field.format === 'images' ?
        <ImagePreviewButton urls={value as string[]} />
      : String(value)}
    </>
  );
};

export default FeedbackDetailCell;
