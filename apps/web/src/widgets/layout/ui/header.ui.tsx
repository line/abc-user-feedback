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
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useTranslation } from 'react-i18next';

import {
  Divider,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  IconButton,
  Menu,
  MenuItem,
} from '@ufb/react';

import { ThemeToggleButton } from '@/entities/theme';
import { useUserStore } from '@/entities/user';

import ProjectSelectBox from './project-select-box.ui';

const MENU_ITEMS = ['dashboard', 'feedback', 'issue', 'settings'] as const;

type MenuType = (typeof MENU_ITEMS)[number];
const firstLeterPascal = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

interface IProps {
  projectId: number;
}

const Header: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { signOut } = useUserStore();

  const currentMenu = useMemo(() => router.pathname.split('/').pop(), [router]);

  const onChangeLanguage = async (newLocale: string) => {
    const { pathname, asPath, query } = router;
    setCookie('NEXT_LOCALE', newLocale);
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const handleClickProfile = async () => {
    await router.push('/main/profile');
  };

  const handleClickSignout = () => {
    void signOut();
  };

  return (
    <div className="navbar gap-2">
      <ProjectSelectBox projectId={projectId} />
      <Divider variant="subtle" indent={8} orientation="vertical" />
      <div className="flex-1">
        <Menu
          value={currentMenu}
          type="single"
          className="navbar-menu"
          onValueChange={async (value: MenuType | '') => {
            if (!value) return;
            await router.push({
              pathname: `/main/project/[projectId]/${value}`,
              query: { projectId },
            });
          }}
        >
          {MENU_ITEMS.map((v, i) => (
            <MenuItem key={i} value={v}>
              {firstLeterPascal(v)}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className="flex gap-3">
        <IconButton icon="RiBuildingLine" variant="ghost" />
        <ThemeToggleButton />
        <Dropdown>
          <DropdownTrigger asChild>
            <IconButton icon="RiTranslate2" variant="ghost" />
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
        <Dropdown>
          <DropdownTrigger asChild>
            <IconButton icon="RiUser6Line" variant="ghost" />
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem
              className="hover:bg-fill-quaternary cursor-pointer p-3 hover:cursor-pointer"
              onClick={handleClickProfile}
            >
              {t('header.profile')}
            </DropdownItem>
            <DropdownItem
              className="hover:bg-fill-quaternary cursor-pointer p-3 hover:cursor-pointer"
              onClick={handleClickSignout}
            >
              {t('header.sign-out')}
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
