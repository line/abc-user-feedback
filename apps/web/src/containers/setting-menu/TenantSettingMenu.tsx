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

import { useTenantState } from '@/entities/tenant';
import { useUserState } from '@/entities/user';

import { SettingMenuTemplate } from '@/components';
import { SettingMenuItem } from '@/components/layouts/setting-menu';
import type { SettingMenuType } from '@/types/setting-menu.type';

interface IProps extends React.PropsWithChildren {
  onClickSettingMenu: (input: SettingMenuType) => () => void;
  settingMenu: SettingMenuType | null;
}

const TenantSettingMenu: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { user } = useUserState();
  const { onClickSettingMenu, settingMenu } = props;

  const tenant = useTenantState();

  return (
    <SettingMenuTemplate title="Tenant">
      <input
        className="input input-md"
        value={tenant?.siteName}
        disabled
        style={{ color: 'var(--text-color-primary)' }}
      />
      <hr className="border-fill-tertiary" />
      <ul>
        <SettingMenuItem
          iconName="InfoCircleFill"
          name={t('tenant-setting-menu.tenant-info')}
          onClick={onClickSettingMenu('TENANT_INFO')}
          active={settingMenu === 'TENANT_INFO'}
          disabled={user?.type !== 'SUPER'}
        />
        <SettingMenuItem
          iconName="ProfileSettingFill"
          name={t('tenant-setting-menu.sign-up-mgmt')}
          onClick={onClickSettingMenu('SIGNUP_SETTING')}
          active={settingMenu === 'SIGNUP_SETTING'}
          disabled={user?.type !== 'SUPER'}
        />
        <SettingMenuItem
          iconName="ProfileCircleFill"
          name={t('tenant-setting-menu.user-mgmt')}
          onClick={onClickSettingMenu('USER_MANAGEMENT')}
          active={settingMenu === 'USER_MANAGEMENT'}
          disabled={user?.type !== 'SUPER'}
        />
      </ul>
    </SettingMenuTemplate>
  );
};

export default TenantSettingMenu;
