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
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
} from '@ufb/react';

interface IProps extends React.PropsWithChildren {}

const LocaleSelectBox: React.FC<IProps> = () => {
  const router = useRouter();
  const onChangeLanguage = useCallback(
    async (newLocale: string) => {
      const { pathname, asPath, query } = router;
      await setCookie('NEXT_LOCALE', newLocale);
      await router.push({ pathname, query }, asPath, { locale: newLocale });
    },
    [router],
  );

  return (
    <Dropdown>
      <DropdownTrigger variant="ghost">
        <Icon name="RiTranslate2" />
      </DropdownTrigger>
      <DropdownContent>
        {router.locales
          ?.filter((v) => v !== 'default')
          .map((v) => (
            <DropdownItem key={v} onClick={() => onChangeLanguage(v)}>
              {v}
            </DropdownItem>
          ))}
      </DropdownContent>
    </Dropdown>
  );
};

export default LocaleSelectBox;
