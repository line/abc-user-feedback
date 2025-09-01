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
import { Trans } from 'next-i18next';

import { env } from '@/env';

type I18nKey =
  | 'help-card.image-config'
  | 'help-card.webhook'
  | 'help-card.api-key';

const urlMap: Record<I18nKey, string> = {
  'help-card.api-key': `${env.NEXT_PUBLIC_API_BASE_URL}/docs/redoc`,
  'help-card.image-config':
    'https://github.com/line/abc-user-feedback/blob/main/GUIDE.md#image-storage-integration',
  'help-card.webhook':
    'https://github.com/line/abc-user-feedback/blob/main/GUIDE.md#webhook-feature',
};

interface IProps {
  i18nKey?: I18nKey;
}

const HelpCardDocs: React.FC<IProps> = ({ i18nKey }) => {
  return (
    <span>
      {i18nKey ?
        <Trans
          i18nKey={i18nKey}
          components={{
            docs: (
              <span
                className="text-tint-blue mr-1 cursor-pointer"
                onClick={() => window.open(urlMap[i18nKey], '_blank')}
              />
            ),
          }}
        />
      : '도움말'}
    </span>
  );
};

export default HelpCardDocs;
