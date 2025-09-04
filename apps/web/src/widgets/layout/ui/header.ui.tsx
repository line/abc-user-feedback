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

import Link from 'next/link';

import { Button, Divider, Icon } from '@ufb/react';

import { LanguageSelectBox, ThemeSelectBox } from '@/shared';
import { useAuth } from '@/features/auth';

import MenuList from './menu-list.ui';
import ProjectSelectBox from './project-select-box.ui';
import UserProfileBox from './user-profile-box.ui';

interface IProps {
  projectId?: number;
}

const Header: React.FC<IProps> = ({ projectId }) => {
  const { user } = useAuth();
  return (
    <header className="navbar items-center gap-2">
      <ProjectSelectBox projectId={projectId} />
      <Divider variant="subtle" indent={8} orientation="vertical" />
      <div className="flex-1">
        <MenuList projectId={projectId} />
      </div>
      <div className="flex items-center gap-3">
        {user?.type === 'SUPER' && (
          <Link href={{ pathname: '/main/tenant' }}>
            <Button variant="ghost">
              <Icon name="RiBuildingLine" />
            </Button>
          </Link>
        )}
        <ThemeSelectBox />
        <LanguageSelectBox />
        <UserProfileBox />
      </div>
    </header>
  );
};

export default Header;
