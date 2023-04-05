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
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { LocaleList } from '@/types/locale.type';

interface IProps extends React.PropsWithChildren {}

const LocaleMenu: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const onToggleLanguageClick = useCallback(
    (newLocale: string) => () => {
      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale: newLocale });
    },
    [router],
  );

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton>
            {t(`locale.${router.locale as (typeof LocaleList)[number]}`)}
            <ChevronDownIcon
              transform={isOpen ? 'rotate(180deg)' : 'none'}
              transition="transform .5s"
              boxSize={6}
            />
          </MenuButton>
          <MenuList>
            {LocaleList.map((v) => (
              <MenuItem key={v} onClick={onToggleLanguageClick(v)}>
                {t(`locale.${v}`)}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default LocaleMenu;
