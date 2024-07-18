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
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { DATE_TIME_FORMAT, ImageSlider, useOAIQuery } from '@/shared';
import { useFeedbackSearch } from '@/entities/feedback';
import { isDefaultField, sortField } from '@/entities/field';
import { IssueBadge } from '@/entities/issue';
import type { Issue } from '@/entities/issue';

import FeedbackDetailCell from './feedback-detail-cell';
import FeedbackDetailIssueCell from './feedback-detail-issue-cell';

interface IProps {
  id: number;
  projectId: number;
  channelId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDetail: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { channelId, id, projectId, onOpenChange, open } = props;
  const { data } = useFeedbackSearch(projectId, channelId, {
    query: { ids: [id] },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const feedbackData = (data?.items[0] ?? {}) as Record<string, any>;

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { channelId, projectId },
  });

  const { refs, context } = useFloating({
    open,
    onOpenChange,
    whileElementsMounted: autoUpdate,
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  const idField = useMemo(
    () => channelData?.fields.find((field) => field.key === 'id'),
    [channelData?.fields],
  );
  const issuesField = useMemo(
    () => channelData?.fields.find((field) => field.key === 'issues'),
    [channelData?.fields],
  );
  const createdField = useMemo(
    () => channelData?.fields.find((field) => field.key === 'createdAt'),
    [channelData?.fields],
  );
  const updatedField = useMemo(
    () => channelData?.fields.find((field) => field.key === 'updatedAt'),
    [channelData?.fields],
  );

  const feedbackFields = useMemo(() => {
    if (!channelData?.fields) return [];
    return channelData.fields.filter((field) => !isDefaultField(field));
  }, [channelData?.fields]);

  if (!(idField && issuesField && createdField && updatedField)) return <></>;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal>
        <FloatingOverlay
          lockScroll={true}
          className="bg-dim"
          style={{ display: 'grid', placeItems: 'center', zIndex: 20 }}
        >
          <div
            className="bg-primary fixed right-0 top-0 h-screen w-[760px] overflow-auto"
            ref={refs.setFloating}
            {...getFloatingProps()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto p-10">
              <div className="flex items-center">
                <h1 className="font-20-bold flex-1">
                  {t('text.feedback-detail')}
                </h1>
                <button
                  className="icon-btn icon-btn-tertiary icon-btn-md"
                  onClick={() => context.onOpenChange(false)}
                >
                  <Icon name="CloseCircleFill" size={20} />
                </button>
              </div>
              <table className="table-fixed border-separate border-spacing-y-5">
                <tbody>
                  <tr>
                    <th className="font-14-regular text-secondary w-20 break-words text-left align-text-top">
                      {idField.name}
                    </th>
                    <td width="260" className="align-text-top">
                      {JSON.stringify(feedbackData[idField.key])}
                    </td>
                    <th className="font-14-regular text-secondary w-20 break-words text-left align-text-top">
                      {issuesField.name}
                    </th>
                    <td width="260" className="overflow-hidden">
                      <FeedbackDetailIssueCell
                        issues={
                          (feedbackData[issuesField.key] ?? []) as Issue[]
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="font-14-regular text-secondary w-20 break-words text-left align-text-top">
                      {createdField.name}
                    </th>
                    <td>
                      {dayjs(feedbackData[createdField.key] as string).format(
                        DATE_TIME_FORMAT,
                      )}
                    </td>
                    <th className="font-14-regular text-secondary w-20 break-words text-left align-text-top">
                      {updatedField.name}
                    </th>
                    <td>
                      {dayjs(feedbackData[updatedField.key] as string).format(
                        DATE_TIME_FORMAT,
                      )}
                    </td>
                  </tr>
                  {feedbackFields.sort(sortField).map((field) => (
                    <tr key={field.id}>
                      <th className="font-14-regular text-secondary min-w-[80px] max-w-[80px] break-words text-left align-text-top">
                        {field.name}
                      </th>
                      <FeedbackDetailCell>
                        {typeof feedbackData[field.key] === 'undefined' ?
                          '-'
                        : field.key === 'issues' ?
                          <div className="flex flex-wrap gap-2">
                            {((feedbackData[field.key] ?? []) as Issue[]).map(
                              (v) => (
                                <IssueBadge key={v.id} issue={v} />
                              ),
                            )}
                          </div>
                        : field.format === 'multiSelect' ?
                          ((feedbackData[field.key] ?? []) as string[]).join(
                            ', ',
                          )
                        : field.format === 'date' ?
                          dayjs(feedbackData[field.key] as string).format(
                            DATE_TIME_FORMAT,
                          )
                        : field.format === 'images' ?
                          <ImageSlider
                            urls={(feedbackData[field.key] ?? []) as string[]}
                          />
                        : feedbackData[field.key]}
                      </FeedbackDetailCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FloatingOverlay>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};

export default FeedbackDetail;
