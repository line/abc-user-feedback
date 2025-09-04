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
import { useEffect } from 'react';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { parseAsString, useQueryState } from 'nuqs';

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Icon,
  Menu,
  MenuItem,
} from '@ufb/react';

import { useAllProjects } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import SideMenuLayout from '@/shared/ui/side-menu-layout.ui';
import { ChangePasswordSetting, UserProfileSetting } from '@/entities/user';
import { useAuth } from '@/features/auth';
import { Layout } from '@/widgets/layout';

import serverSideTranslations from '@/server-side-translations';

const ProfilePage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const overlay = useOverlay();
  const { user } = useAuth();
  const router = useRouter();

  const [currentMenu] = useQueryState<string>(
    'menu',
    parseAsString.withDefault('profile'),
  );
  const { data } = useAllProjects();

  const openWarningNoProjects = () => {
    overlay.open(({ close, isOpen }) => (
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent radius="large">
          <DialogTitle>
            {t('v2.dialog.no-project-in-profile-page.title')}
          </DialogTitle>
          <DialogBody className="flex flex-col items-center gap-2">
            <Image
              src="/assets/images/no-projects-in-profile-page.svg"
              alt=""
              width={240}
              height={240}
            />
            <p className="w-full whitespace-pre-line px-4">
              {t('v2.dialog.no-project-in-profile-page.description', {
                name: user?.name ?? '--',
              })}
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose variant="primary">
              {t('v2.button.confirm')}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ));
  };

  useEffect(() => {
    if (!data || data.items.length > 0) return;
    openWarningNoProjects();
  }, [data]);

  return (
    <SideMenuLayout
      sideMenu={
        <Menu
          type="single"
          orientation="vertical"
          className="w-full p-0"
          value={currentMenu}
          onValueChange={(value) =>
            router.push({ pathname: router.pathname, query: { menu: value } })
          }
        >
          <MenuItem value="profile">
            <Icon name="RiInformation2Line" />
            {t('main.profile.profile-info')}
          </MenuItem>
          <MenuItem value="change-password">
            <Icon name="RiUser2Line" />
            {t('main.profile.change-password')}
          </MenuItem>
        </Menu>
      }
    >
      {currentMenu === 'profile' && <UserProfileSetting />}
      {currentMenu === 'change-password' && <ChangePasswordSetting />}
    </SideMenuLayout>
  );
};

ProfilePage.getLayout = (page) => {
  return <Layout title="Profile">{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};
export default ProfilePage;
