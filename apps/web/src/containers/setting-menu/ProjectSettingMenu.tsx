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

import { Icon } from '@ufb/ui';

import { SettingMenuTemplate } from '@/components';
import { SettingMenuItem } from '@/components/layouts/setting-menu';
import { useOAIQuery, usePermissions } from '@/hooks';
import type { SettingMenuType } from '@/types/setting-menu.type';

interface IProps extends React.PropsWithChildren {
  projectId: number;
  onClickSettingMenu: (input: SettingMenuType) => () => void;
  settingMenu: SettingMenuType | null;
}

const ProjectSettingMenu: React.FC<IProps> = (props) => {
  const { projectId, onClickSettingMenu, settingMenu } = props;
  const perms = usePermissions(projectId);
  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}',
    variables: { projectId },
  });

  const { t } = useTranslation();

  return (
    <SettingMenuTemplate title="Project">
      <input className="input input-md" value={data?.name} disabled />
      <hr className="border-fill-tertiary basis" />
      <ul className="flex-1">
        <SettingMenuItem
          iconName="DocumentInfoFill"
          onClick={onClickSettingMenu('PROJECT_INFO')}
          active={settingMenu === 'PROJECT_INFO'}
          name={t('main.setting.subtitle.project-info')}
          disabled={!perms.includes('project_read')}
        />
        <SettingMenuItem
          iconName="ProfileCircleFill"
          onClick={onClickSettingMenu('MEMBER_MANAGEMENT')}
          active={settingMenu === 'MEMBER_MANAGEMENT'}
          name={t('main.setting.subtitle.member-mgmt')}
          disabled={!perms.includes('project_member_read')}
        />
        <SettingMenuItem
          iconName="ShieldPrivacyFill"
          onClick={onClickSettingMenu('ROLE_MANAGEMENT')}
          active={settingMenu === 'ROLE_MANAGEMENT'}
          name={t('main.setting.subtitle.role-mgmt')}
          disabled={!perms.includes('project_role_read')}
        />
        <SettingMenuItem
          iconName="ShieldWSimFill"
          onClick={onClickSettingMenu('API_KEY_MANAGEMENT')}
          active={settingMenu === 'API_KEY_MANAGEMENT'}
          name={t('main.setting.subtitle.api-key-mgmt')}
          disabled={!perms.includes('project_apikey_read')}
        />
        <SettingMenuItem
          iconName="TicketFill"
          onClick={onClickSettingMenu('TICKET_MANAGEMENT')}
          active={settingMenu === 'TICKET_MANAGEMENT'}
          name={t('main.setting.subtitle.issue-tracker-mgmt')}
          disabled={!perms.includes('project_tracker_read')}
        />
        <SettingMenuItem
          iconName="TrashFill"
          onClick={onClickSettingMenu('DELETE_PROJECT')}
          active={settingMenu === 'DELETE_PROJECT'}
          name={t('main.setting.subtitle.delete-project')}
          disabled={!perms.includes('project_delete')}
        />
      </ul>
      <button className="btn btn-primary btn-lg gap-2" disabled>
        <Icon name="Plus" size={24} className="text-above-primary" />
        {t('main.setting.button.create-project')}
      </button>
    </SettingMenuTemplate>
  );
};

export default ProjectSettingMenu;
