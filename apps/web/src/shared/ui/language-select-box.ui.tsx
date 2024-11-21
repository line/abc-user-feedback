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
import { setCookie } from 'cookies-next';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  IconButton,
} from '@ufb/react';

const LanguageMap: Record<string, string> = {
  en: 'English',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
};

interface Props {}

const LanguageSelectBox: React.FC<Props> = () => {
  const router = useRouter();

  const onChangeLanguage = async (newLocale: string) => {
    const { pathname, asPath, query } = router;
    setCookie('NEXT_LOCALE', newLocale);
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <IconButton icon="RiTranslate2" variant="ghost" />
      </DropdownTrigger>
      <DropdownContent align="end">
        {router.locales
          ?.filter((v) => v !== 'default')
          .map((v) => (
            <DropdownItem key={v} onClick={() => onChangeLanguage(v)}>
              {LanguageMap[v] ?? v.toLocaleUpperCase()}
            </DropdownItem>
          ))}
      </DropdownContent>
    </Dropdown>
  );
};

export default LanguageSelectBox;
