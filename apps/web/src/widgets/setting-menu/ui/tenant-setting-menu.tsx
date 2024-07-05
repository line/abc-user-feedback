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
import { useTranslation } from 'next-i18next';

import { SubMenu } from '@/shared';
import { useTenantStore } from '@/entities/tenant';
import { useUserStore } from '@/entities/user';

import { SettingMenuTemplate } from '@/components';
import type { SettingMenuType } from '@/types/setting-menu.type';

interface IProps extends React.PropsWithChildren {
  onClickSettingMenu: (input: SettingMenuType) => void;
  settingMenu: SettingMenuType | null;
}

const TenantSettingMenu: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { onClickSettingMenu, settingMenu } = props;

  const { tenant } = useTenantStore();

  return (
    <SettingMenuTemplate title="Tenant">
      <input
        className="input input-md"
        value={tenant?.siteName}
        disabled
        style={{ color: 'var(--text-color-primary)' }}
      />
      <hr className="border-fill-tertiary" />
      <SubMenu
        className="flex-1"
        items={[
          {
            iconName: 'InfoCircleFill',
            name: t('tenant-setting-menu.tenant-info'),
            active: settingMenu === 'TENANT_INFO',
            onClick: () => onClickSettingMenu('TENANT_INFO'),
            disabled: user?.type !== 'SUPER',
          },
          {
            iconName: 'ProfileSettingFill',
            name: t('tenant-setting-menu.sign-up-mgmt'),
            active: settingMenu === 'SIGNUP_SETTING',
            onClick: () => onClickSettingMenu('SIGNUP_SETTING'),
            disabled: user?.type !== 'SUPER',
          },
          {
            iconName: 'ProfileCircleFill',
            name: t('tenant-setting-menu.user-mgmt'),
            active: settingMenu === 'USER_MANAGEMENT',
            onClick: () => onClickSettingMenu('USER_MANAGEMENT'),
            disabled: user?.type !== 'SUPER',
          },
        ]}
      />
    </SettingMenuTemplate>
  );
};

export default TenantSettingMenu;
