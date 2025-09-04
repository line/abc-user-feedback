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

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icon,
} from '@ufb/react';

import { useAuth } from '@/features/auth';

interface Props {}

const UserProfileBox: React.FC<Props> = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { signOut } = useAuth();

  const handleClickProfile = async () => {
    await router.push('/main/profile');
  };

  const handleClickSignout = () => {
    void signOut();
  };

  return (
    <Dropdown>
      <DropdownTrigger variant="ghost">
        <Icon name="RiUser6Line" />
      </DropdownTrigger>
      <DropdownContent align="end" className="min-w-[120px]">
        <DropdownItem onClick={handleClickProfile}>
          {t('header.profile')}
        </DropdownItem>
        <DropdownItem onClick={handleClickSignout}>
          {t('header.sign-out')}
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};

export default UserProfileBox;
