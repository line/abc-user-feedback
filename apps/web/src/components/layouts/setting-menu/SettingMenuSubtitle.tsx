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
import { Fragment, useMemo } from 'react';

import { Icon } from '@ufb/ui';

import { useOAIQuery } from '@/shared';
import { useTenantStore } from '@/entities/tenant';

import type { SettingMenuType } from '@/types/setting-menu.type';

interface IProps extends React.PropsWithChildren {
  settingMenu?: SettingMenuType;
  projectId: number;
  channelId: number | null;
}

const SettingMenuSubtitle: React.FC<IProps> = (props) => {
  const { settingMenu, channelId, projectId } = props;
  const { tenant } = useTenantStore();
  const { data: projectData } = useOAIQuery({ path: '/api/admin/projects' });
  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });

  const projectName = useMemo(
    () => projectData?.items.find((v) => v.id === projectId)?.name ?? '',
    [projectData, projectId],
  );

  const channelName = useMemo(
    () => channelData?.items.find((v) => v.id === channelId)?.name ?? '',
    [channelData, channelId],
  );

  const titleList = useMemo(() => {
    switch (settingMenu) {
      case 'TENANT_INFO':
      case 'SIGNUP_SETTING':
        return [tenant?.siteName];
      case 'PROJECT_INFO':
      case 'API_KEY_MANAGEMENT':
      case 'TICKET_MANAGEMENT':
      case 'DELETE_PROJECT':
        return [tenant?.siteName, projectName];
      case 'CHANNEL_INFO':
      case 'FIELD_MANAGEMENT':
      case 'DELETE_CHANNEL':
        return [tenant?.siteName, projectName, channelName];
      default:
        return [];
    }
  }, [settingMenu, tenant, projectName, channelName]);

  return (
    <h2 className="flex items-center gap-1">
      {titleList.map((v, i) => (
        <Fragment key={i}>
          <span>{v}</span>
          {i !== titleList.length - 1 && (
            <Icon name="ChevronRight" size={8} className="text-tertiary" />
          )}
        </Fragment>
      ))}
    </h2>
  );
};

export default SettingMenuSubtitle;
