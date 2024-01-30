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

import { useTranslation } from 'react-i18next';

import { CreateSectionTemplate } from '@/components/templates';
import { useOAIQuery } from '@/hooks';
import { RoleSettingTable } from '../setting-menu/RoleSetting/';

interface IProps {
  projectId: number;
}

const RoleSection: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/roles',
    variables: { projectId },
  });

  return (
    <CreateSectionTemplate title={t('project-setting-menu.role-mgmt')}>
      <RoleSettingTable
        roles={data?.roles ?? []}
        onDelete={() => {}}
        updateRole={() => {}}
        viewOnly
      />
    </CreateSectionTemplate>
  );
};

export default RoleSection;
