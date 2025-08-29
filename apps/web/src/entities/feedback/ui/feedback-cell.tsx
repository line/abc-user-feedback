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

import { Badge, Icon, Tag } from '@ufb/react';

import { DATE_TIME_FORMAT, ExpandableText, ImagePreviewButton } from '@/shared';
import { AICell } from '@/entities/ai';
import type { FieldInfo } from '@/entities/field';

import { useAIFIeldFeedbackCellLoading } from '..';

interface IProps {
  isExpanded: boolean;
  field: FieldInfo;
  value: unknown;
  feedbackId: number;
}

const FeedbackCell: React.FC<IProps> = memo((props) => {
  const { isExpanded, field, value, feedbackId } = props;

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
            <ImagePreviewButton urls={value as string[]}>
              <Tag
                variant="outline"
                size="small"
                className="cursor-pointer gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Icon name="RiImageFill" size={12} />
                Image
              </Tag>
            </ImagePreviewButton>
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
            <FeedbackAIFieldCell
              value={
                value as
                  | { status: 'loading' | 'success' | 'error'; message: string }
                  | undefined
              }
              feedbackId={feedbackId}
              field={field}
            />
          )}
        </>
      }
    </ExpandableText>
  );
});

const FeedbackAIFieldCell: React.FC<{
  value?: { status: 'loading' | 'success' | 'error'; message: string };
  feedbackId: number;
  field: FieldInfo;
}> = memo((props) => {
  const { field, value, feedbackId } = props;
  const loadingFeedbackIds = useAIFIeldFeedbackCellLoading(
    (state) => state.loadingFeedbackIds,
  );

  return (
    <AICell
      value={value}
      isLoading={
        loadingFeedbackIds.has(feedbackId) && field.status === 'ACTIVE'
      }
    />
  );
});

export default FeedbackCell;
