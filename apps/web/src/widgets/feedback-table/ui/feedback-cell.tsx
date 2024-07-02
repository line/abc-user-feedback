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
import { memo } from 'react';
import dayjs from 'dayjs';

import { DATE_TIME_FORMAT, ExpandableText } from '@/shared';

import { ImagePreviewButton } from '@/components/buttons';
import type { FieldType } from '@/types/field.type';

interface IProps extends React.PropsWithChildren {
  isExpanded: boolean;
  field: FieldType;
  value: any;
}

const FeedbackCell: React.FC<IProps> = memo((props) => {
  const { isExpanded, field, value } = props;

  return (
    <ExpandableText isExpanded={isExpanded}>
      {typeof value === 'undefined' ?
        undefined
      : field.format === 'date' ?
        dayjs(value as string).format(DATE_TIME_FORMAT)
      : field.format === 'multiSelect' ?
        (value as string[])
          .sort(
            (aKey, bKey) =>
              (field.options ?? []).findIndex((option) => option.key === aKey) -
              (field.options ?? []).findIndex((option) => option.key === bKey),
          )
          .map(
            (key) =>
              field.options?.find((option) => option.key === key)?.name ??
              value,
          )
          .join(', ')
      : field.format === 'select' ?
        field.options?.find((option) => option.key === value)?.name ?? value
      : field.format === 'images' ?
        <ImagePreviewButton urls={value} />
      : field.format === 'text' ?
        (value as string)
      : String(value)}
    </ExpandableText>
  );
});

export default FeedbackCell;
