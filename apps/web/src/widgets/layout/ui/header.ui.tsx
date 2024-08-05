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

import {
  NavBar,
  NavBarButton,
  NavBarDivider,
  NavBarDropdownButton,
  NavBarMenu,
} from '@ufb/react';

import { ThemeToggleButton } from '@/entities/theme';

import ProjectSelectBox from './project-select-box.ui';

const MENU_ITEMS = ['dashboard', 'feedback', 'issue', 'settings'];

interface IProps {
  projectId: number;
}

const Header: React.FC<IProps> = ({ projectId }) => {
  const router = useRouter();

  const currentMenu = useMemo(() => router.pathname.split('/').pop(), [router]);

  const onChangeLanguage = async (newLocale: string) => {
    const { pathname, asPath, query } = router;
    setCookie('NEXT_LOCALE', newLocale);
    await router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <NavBar>
      <ProjectSelectBox projectId={projectId} />
      <NavBarDivider />
      <NavBarMenu
        className="flex-1"
        type="single"
        value={currentMenu}
        items={MENU_ITEMS.map((v) => ({ children: v, value: v }))}
      />
      <div className="flex gap-3">
        <NavBarButton icon="RiBuildingLine" />
        <ThemeToggleButton />
        <NavBarDropdownButton
          triggerIcon="RiTranslate2"
          items={router.locales
            ?.filter((v) => v !== 'default')
            .map((v) => ({ children: v, onClick: () => onChangeLanguage(v) }))}
        />
        <NavBarButton icon="RiUser6Line" />
      </div>
    </NavBar>
  );
};

export default Header;
