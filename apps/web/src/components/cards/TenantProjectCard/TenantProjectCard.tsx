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
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { getDescriptionStr } from '@/utils/description-string';

interface IProps {
  name: string;
  description?: string | null;
  type: 'tenant' | 'project';
  total?: number;
  feedbackCount?: number;
  onClick?: () => void;
}

const TenantProjectCard: React.FC<IProps> = ({
  name,
  type,
  description,
  feedbackCount,
  total,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={[
        'border-fill-tertiary h-[204px] w-[452px] rounded border p-8',
        type === 'project' ? 'hover:cursor-pointer hover:opacity-50' : '',
      ].join(' ')}
      onClick={onClick}
    >
      <div className="mb-10 flex gap-5">
        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded',
            type === 'tenant' ? 'bg-[#5D7BE7]' : 'bg-[#48DECC]',
          ].join(' ')}
        >
          <Icon
            name={type === 'tenant' ? 'OfficeFill' : 'CollectionFill'}
            className="text-inverse"
            size={20}
          />
        </div>
        <div className="flex-1">
          <p className="font-16-bold mb-1">{name}</p>
          <p className="font-12-regular text-secondary line-clamp-1 break-all">
            {getDescriptionStr(description)}
          </p>
        </div>
      </div>
      <div className="flex gap-16">
        <div>
          <p className="font-12-regular mb-1">
            {type === 'tenant'
              ? t('main.index.total-project')
              : t('main.index.total-channel')}
          </p>
          <p
            className={[
              'font-24-bold',
              typeof total === 'undefined'
                ? 'bg-secondary w-15 h-7 animate-pulse rounded-sm'
                : '',
            ].join(' ')}
          >
            {total?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-12-regular mb-1">
            {t('main.index.total-feedback')}
          </p>
          <p
            className={[
              'font-24-bold',
              typeof feedbackCount === 'undefined'
                ? 'bg-secondary w-15 h-7 animate-pulse rounded-sm'
                : '',
            ].join(' ')}
          >
            {feedbackCount?.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantProjectCard;
