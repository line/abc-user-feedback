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
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { useTruncatedElement } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const FeedbackDetailCell: React.FC<IProps> = ({ children }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLTableCellElement>(null);
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({ ref });

  return (
    <td className="pl-2" colSpan={3}>
      <div
        className={`font-14-regular text-primary break-words break-all align-top ${
          !isShowingMore && 'line-clamp-6'
        }`}
        ref={ref}
      >
        {children}
      </div>
      {isTruncated && (
        <button
          onClick={toggleIsShowingMore}
          className="text-blue-primary flex items-center gap-1"
        >
          {isShowingMore ? t('text.shrink') : t('text.more')}
          <Icon
            name="ChevronDown"
            size={12}
            className={isShowingMore ? 'rotate-180' : ''}
          />
        </button>
      )}
    </td>
  );
};

export default FeedbackDetailCell;
