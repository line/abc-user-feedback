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
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { PATH } from '@/constants/path';
import { useUser } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const UserMenu: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { user, signOut } = useUser();
  const router = useRouter();

  const handlSignOut = useCallback(async () => {
    await signOut();
    router.push(PATH.AUTH.SIGN_IN);
  }, []);

  if (!user) return <></>;
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton mr={4}>
            {user.email}
            <ChevronDownIcon
              transform={isOpen ? 'rotate(180deg)' : 'none'}
              transition="transform .5s"
              boxSize={6}
            />
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Link
                href={PATH.SETTING.ACCOUNT.PROFILE}
                style={{ width: '100%' }}
              >
                {t('title.userSetting')}
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                href={PATH.SETTING.ACCOUNT.PASSWORD}
                style={{ width: '100%' }}
              >
                {t('title.changePassword')}
              </Link>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={handlSignOut}>{t('logout')}</MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default UserMenu;
