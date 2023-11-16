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
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { Path } from '@/constants/path';
import { usePermissions } from '@/hooks';

interface IProps {
  projectId: number;
}

const NoChannel: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();
  const perms = usePermissions(projectId);
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3">
        <Icon name="NoChannelFill" size={56} className="text-tertiary" />
        <p>{t('text.no-channel')}.</p>
      </div>
      {perms.includes('channel_create') && (
        <button
          className="btn btn-blue btn-lg w-[200px] gap-2"
          onClick={() =>
            router.push({
              pathname: Path.CREATE_CHANNEL,
              query: { projectId },
            })
          }
        >
          <Icon name="Plus" size={24} className="text-above-primary" />
          {t('main.setting.button.create-channel')}
        </button>
      )}
    </div>
  );
};

export default NoChannel;
