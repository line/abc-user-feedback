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
import { Trans } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { env } from '@/env.mjs';

type I18nKey =
  | 'help-card.image-setting'
  | 'help-card.webhook'
  | 'help-card.api-key';
interface IProps {
  i18nKey: I18nKey;
}
const urlMap: Record<I18nKey, string> = {
  'help-card.api-key': `${env.NEXT_PUBLIC_API_BASE_URL}/docs/redoc`,
  'help-card.image-setting':
    'https://github.com/line/abc-user-feedback/blob/main/GUIDE.md#image-storage-integration',
  'help-card.webhook':
    'https://github.com/line/abc-user-feedback/blob/main/GUIDE.md#webhook-feature',
};
const HelpCardDocs: React.FC<IProps> = ({ i18nKey }) => {
  return (
    <Trans
      i18nKey={i18nKey}
      components={{
        icon: (
          <Icon
            name="ExpandPopup"
            className="text-blue-primary cursor-pointer"
            size={12}
            onClick={() => window.open(urlMap[i18nKey], '_blank')}
          />
        ),
        docs: (
          <span
            className="text-blue-primary cursor-pointer"
            onClick={() => window.open(urlMap[i18nKey], '_blank')}
          />
        ),
      }}
    />
  );
};

export default HelpCardDocs;
