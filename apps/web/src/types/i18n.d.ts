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
import 'i18next';

import de from '../../public/locales/de/common.json';
import en from '../../public/locales/en/common.json';
import ja from '../../public/locales/ja/common.json';
import ko from '../../public/locales/ko/common.json';
import zh from '../../public/locales/zh/common.json';

export const resources = {
  en: { common: de },
  en: { common: en },
  ko: { common: ko },
  ja: { common: ja },
  ja: { common: zh },
} as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['ko'];
  }
}
