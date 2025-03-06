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
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';

import { Button, toast } from '@ufb/react';

import { SettingTemplate, useOAIMutation } from '@/shared';
import { useTenantStore } from '@/entities/tenant';
import { InviteUserDialog, UserManagementTable } from '@/entities/user';

interface IProps {}

const UserManagementSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const overlay = useOverlay();
  const { tenant } = useTenantStore();

  const { mutateAsync } = useOAIMutation({
    method: 'post',
    path: '/api/admin/users/invite',
    queryOptions: {
      onSuccess() {
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const openInviateUserDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <InviteUserDialog
        close={close}
        isOpen={isOpen}
        onSubmit={async ({ email, roleId, type }) => {
          if (type === 'SUPER') await mutateAsync({ email, userType: type });
          if (type === 'GENERAL') {
            await mutateAsync({ email, roleId, userType: type });
          }
          close();
        }}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('tenant-setting-menu.user-mgmt')}
      action={
        <Button onClick={openInviateUserDialog} disabled={!tenant?.useEmail}>
          {t('v2.button.name.invite', { name: 'User' })}
        </Button>
      }
    >
      <UserManagementTable
        createButton={
          <Button onClick={openInviateUserDialog} disabled={!tenant?.useEmail}>
            {t('v2.button.name.invite', { name: 'User' })}
          </Button>
        }
      />
    </SettingTemplate>
  );
};

export default UserManagementSetting;
