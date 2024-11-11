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
import { useTranslation } from 'react-i18next';

import { Button } from '@ufb/react';
import { toast } from '@ufb/ui';

import { SettingTemplate, useOAIMutation } from '@/shared';
import { InviteUserPopover, UserManagementTable } from '@/entities/user';

interface IProps {}

const UserManagementSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const overlay = useOverlay();

  const { mutateAsync } = useOAIMutation({
    method: 'post',
    path: '/api/admin/users/invite',
    queryOptions: {
      onSuccess() {
        toast.positive({ title: t('toast.invite'), iconName: 'MailFill' });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const openApiKeyDialog = () => {
    overlay.open(({ close, isOpen }) => (
      <InviteUserPopover
        close={close}
        isOpen={isOpen}
        onSubmit={async ({ email, roleId, type }) => {
          if (type === 'SUPER') await mutateAsync({ email, userType: type });
          if (type === 'GENERAL')
            await mutateAsync({ email, roleId, userType: type });
          close();
        }}
      />
    ));
  };

  return (
    <SettingTemplate
      title={t('tenant-setting-menu.user-mgmt')}
      action={
        <Button onClick={openApiKeyDialog}>
          {t('v2.button.name.register', { name: 'Member' })}
        </Button>
      }
    >
      <UserManagementTable />
    </SettingTemplate>
  );
};

export default UserManagementSetting;
