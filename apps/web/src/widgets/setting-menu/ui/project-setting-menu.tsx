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

import { SubMenu, useOAIQuery, usePermissions } from '@/shared';

import type { SettingMenuType } from '../setting-menu.type';
import SettingMenuTemplate from './setting-menu-template';

interface IProps {
  projectId: number;
  onClickSettingMenu: (input: SettingMenuType) => void;
  settingMenu: SettingMenuType | null;
}

const ProjectSettingMenu: React.FC<IProps> = (props) => {
  const { projectId, onClickSettingMenu, settingMenu } = props;
  const perms = usePermissions(projectId);
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  const { t } = useTranslation();

  return (
    <SettingMenuTemplate title="Project">
      <input
        className="input input-md text-primary"
        value={data?.name}
        style={{ color: 'var(--text-color-primary)' }}
        disabled
      />
      <hr className="border-fill-tertiary basis" />
      <SubMenu
        className="flex-1"
        items={[
          {
            iconName: 'DocumentInfoFill',
            name: t('project-setting-menu.project-info'),
            active: settingMenu === 'PROJECT_INFO',
            onClick: () => onClickSettingMenu('PROJECT_INFO'),
          },
          {
            iconName: 'ProfileCircleFill',
            onClick: () => onClickSettingMenu('MEMBER_MANAGEMENT'),
            active: settingMenu === 'MEMBER_MANAGEMENT',
            name: t('project-setting-menu.member-mgmt'),
            disabled: !perms.includes('project_member_read'),
          },
          {
            iconName: 'ShieldPrivacyFill',
            onClick: () => onClickSettingMenu('ROLE_MANAGEMENT'),
            active: settingMenu === 'ROLE_MANAGEMENT',
            name: t('project-setting-menu.role-mgmt'),
            disabled: !perms.includes('project_role_read'),
          },
          {
            iconName: 'ShieldWSimFill',
            onClick: () => onClickSettingMenu('API_KEY_MANAGEMENT'),
            active: settingMenu === 'API_KEY_MANAGEMENT',
            name: t('project-setting-menu.api-key-mgmt'),
            disabled: !perms.includes('project_apikey_read'),
          },
          {
            iconName: 'TicketFill',
            onClick: () => onClickSettingMenu('TICKET_MANAGEMENT'),
            active: settingMenu === 'TICKET_MANAGEMENT',
            name: t('project-setting-menu.issue-tracker-mgmt'),
            disabled: !perms.includes('project_tracker_read'),
          },
          {
            iconName: 'TicketFill',
            onClick: () => onClickSettingMenu('WEBHOOK_MANAGEMENT'),
            active: settingMenu === 'WEBHOOK_MANAGEMENT',
            name: t('project-setting-menu.webhook-integration'),
            disabled: !perms.includes('project_webhook_read'),
          },
          {
            iconName: 'TrashFill',
            onClick: () => onClickSettingMenu('DELETE_PROJECT'),
            active: settingMenu === 'DELETE_PROJECT',
            name: t('project-setting-menu.delete-project'),
            disabled: !perms.includes('project_delete'),
          },
        ]}
      />
    </SettingMenuTemplate>
  );
};

export default ProjectSettingMenu;
