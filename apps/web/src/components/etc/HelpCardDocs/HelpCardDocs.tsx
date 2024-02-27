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

interface IProps {
  i18nKey: 'help-card.image-setting' | 'help-card.webhook';
}

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
            onClick={() => {
              if (typeof window === 'undefined') return;
              window.open(
                'https://github.com/line/abc-user-feedback/blob/main/GUIDE.md',
                '_blank',
              );
            }}
          />
        ),
        docs: (
          <span
            className="text-blue-primary cursor-pointer"
            onClick={() => {
              if (typeof window === 'undefined') return;
              window.open(
                'https://github.com/line/abc-user-feedback/blob/main/GUIDE.md',
                '_blank',
              );
            }}
          />
        ),
      }}
    />
  );
};

export default HelpCardDocs;
