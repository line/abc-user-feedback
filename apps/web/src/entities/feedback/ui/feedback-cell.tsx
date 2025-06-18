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
import { memo } from 'react';
import dayjs from 'dayjs';
import Linkify from 'linkify-react';

import { Badge, Icon } from '@ufb/react';

import { DATE_TIME_FORMAT, ExpandableText, ImagePreviewButton } from '@/shared';
import type { FieldInfo } from '@/entities/field';

interface IProps {
  isExpanded: boolean;
  field: FieldInfo;
  value: unknown;
}

const FeedbackCell: React.FC<IProps> = memo((props) => {
  const { isExpanded, field, value } = props;

  return (
    <ExpandableText isExpanded={isExpanded}>
      {typeof value === 'undefined' || value === null ?
        undefined
      : <>
          {field.format === 'date' &&
            dayjs(value as string).format(DATE_TIME_FORMAT)}
          {field.format === 'multiSelect' && (
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
                  <Badge variant="subtle" key={key}>
                    {
                      (field.options?.find((option) => option.key === key)
                        ?.name ?? value) as string
                    }
                  </Badge>
                ))}
            </div>
          )}
          {field.format === 'select' && (
            <Badge variant="subtle">
              {field.options?.find((option) => option.key === value)?.name ??
                ''}
            </Badge>
          )}
          {field.format === 'images' && (
            <ImagePreviewButton urls={value as string[]} />
          )}
          {field.format === 'text' && (
            <Linkify
              options={{
                className: 'text-blue-500 underline',
                target: '_blank',
                rel: 'noopener noreferrer',
                attributes: {
                  onClick: (e: React.MouseEvent) => e.stopPropagation(),
                },
              }}
            >
              {value as string | undefined}
            </Linkify>
          )}
          {field.format === 'keyword' && value}
          {field.format === 'number' && value}
          {field.format === 'aiField' && (
            <AICell
              value={
                value as
                  | { status: 'loading' | 'success' | 'error'; message: string }
                  | undefined
              }
            />
          )}
        </>
      }
    </ExpandableText>
  );
});

const AICell = memo(
  (props: {
    value:
      | { status: 'loading' | 'success' | 'error'; message: string }
      | undefined;
  }) => {
    const { value } = props;

    if (!value) return null;

    return (
      <>
        {value.status === 'loading' && (
          <div className="flex flex-col gap-2">
            <div className="bg-neutral-tertiary h-4 w-full animate-pulse rounded" />
            <div className="bg-neutral-tertiary h-4 w-full animate-pulse rounded" />
            <div className="bg-neutral-tertiary h-4 w-full animate-pulse rounded" />
          </div>
        )}
        {value.status === 'error' && (
          <div className="flex items-center gap-1">
            <Icon
              name="RiErrorWarningFill"
              className="text-tint-red shrink-0"
              size={16}
            />
            <span>{value.message}</span>
          </div>
        )}
        {value.status === 'success' && <p>{value.message}</p>}
      </>
    );
  },
);

export default FeedbackCell;
