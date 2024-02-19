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

import { Badge, Icon } from '@ufb/ui';

import { DATE_TIME_FORMAT } from '@/constants/dayjs-format';
import { getStatusColor } from '@/constants/issues';
import { useFeedbackSearch, useOAIQuery } from '@/hooks';
import type { FieldType } from '@/types/field.type';
import type { IssueType } from '@/types/issue.type';
import FeedbackDetailCell from './FeedbackDetailCell';

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

  const feedbackData = data?.items?.[0] ?? {};

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
                  {channelData?.fields.sort(fieldSortType).map((field) => (
                    <tr key={field.name}>
                      <th className="font-14-regular text-secondary min-w-[80px] max-w-[80px] break-words text-left align-text-top">
                        {field.name}
                      </th>
                      <FeedbackDetailCell>
                        {typeof feedbackData[field.key] === 'undefined' ? (
                          '-'
                        ) : field.key === 'issues' ? (
                          <div className="flex flex-wrap gap-2">
                            {(
                              feedbackData[field.key] ?? ([] as IssueType[])
                            ).map((v) => (
                              <Badge
                                key={v.id}
                                color={getStatusColor(v.status)}
                                type="secondary"
                              >
                                {v.name}
                              </Badge>
                            ))}
                          </div>
                        ) : field.format === 'multiSelect' ? (
                          (feedbackData[field.key] ?? ([] as string[])).join(
                            ', ',
                          )
                        ) : field.format === 'date' ? (
                          dayjs(feedbackData[field.key]).format(
                            DATE_TIME_FORMAT,
                          )
                        ) : (
                          feedbackData[field.key]
                        )}
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
const fieldSortType = (a: FieldType, b: FieldType) => {
  const aNum = a.type === 'DEFAULT' ? 1 : a.type === 'API' ? 2 : 3;
  const bNum = b.type === 'DEFAULT' ? 1 : b.type === 'API' ? 2 : 3;
  return aNum - bNum;
};

export default FeedbackDetail;
