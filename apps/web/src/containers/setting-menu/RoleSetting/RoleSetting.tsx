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
import { toast } from '@ufb/ui';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SettingMenuTemplate } from '@/components';
import { useOAIMutation, useOAIQuery } from '@/hooks';
import {
  ChannelFieldPermissionList,
  ChannelInfoPermissionList,
  ChannelPermissionText,
  FeedbackPermissionList,
  FeedbackPermissionText,
  IssuePermissionList,
  IssuePermissionText,
  PermissionType,
  ProjectApiKeyPermissionList,
  ProjectInfoPermissionList,
  ProjectMemberPermissionList,
  ProjectPermissionText,
  ProjectRolePermissionList,
  ProjectTrackerPermissionList,
} from '@/types/permission.type';

import AddRoleDialog from './AddRoleDialog';
import PermissionRows from './PermissionRows';
import RoleSettingHead from './RoleSettingHead';
import RoleTitleRow from './RoleTitleRow';

interface IProps {
  projectId: number;
}

const RoleSetting: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data, refetch } = useOAIQuery({
    path: '/api/projects/{projectId}/roles',
    variables: { projectId },
  });
  const [editRoleId, setEditRoleId] = useState<number>();

  const [editPermissions, setEditPermissions] = useState<
    Partial<Record<PermissionType, boolean>>
  >({});

  const [editName, setEditName] = useState<string>();
  useEffect(() => {
    setEditName(undefined);
    setEditPermissions({});
  }, [editRoleId]);

  const { mutate } = useOAIMutation({
    method: 'put',
    path: '/api/projects/{projectId}/roles/{roleId}',
    pathParams: { projectId, roleId: editRoleId ?? -1 },
    queryOptions: {
      async onSuccess() {
        setEditRoleId(undefined);
        refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        if (!error) return;
        toast.negative({ title: error.message });
      },
    },
  });

  const newRole = (roleId: number) => {
    const targetRole = data?.roles.find((v) => v.id === roleId);
    if (!targetRole) return;
    const endtires = Object.entries(editPermissions) as [
      PermissionType,
      boolean,
    ][];
    const permissions = endtires.reduce<PermissionType[]>(
      (prev, [perm, checked]) => {
        if (checked) return prev.includes(perm) ? prev : prev.concat(perm);
        else return prev.includes(perm) ? prev.filter((v) => v !== perm) : prev;
      },
      targetRole.permissions,
    );

    return { permissions, name: editName ?? targetRole.name };
  };
  const colSpan = useMemo(() => (data?.roles.length ?? 0) + 2, [data]);

  return (
    <SettingMenuTemplate
      title={t('main.setting.subtitle.role-mgmt')}
      action={<AddRoleDialog projectId={projectId} refetch={refetch} />}
    >
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Permissions</th>
              {data?.roles.map((v) => (
                <th key={v.id}>
                  <RoleSettingHead
                    name={v.name}
                    roleId={v.id}
                    isEdit={editRoleId === v.id}
                    projectId={projectId}
                    onChangeEditRole={setEditRoleId}
                    onChangeEditName={setEditName}
                    refetch={refetch}
                    onSubmitEdit={() => {
                      const role = newRole(v.id);
                      if (!role) return;
                      mutate(role);
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <RoleTitleRow colspan={colSpan} title="Feedback" depth={0} />

            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={FeedbackPermissionText}
              permissions={FeedbackPermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={1}
            />
            <RoleTitleRow colspan={colSpan} title="Issue" depth={0} />

            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={IssuePermissionText}
              permissions={IssuePermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={1}
            />
            <RoleTitleRow colspan={colSpan} title="Setting" depth={0} />
            <RoleTitleRow colspan={colSpan} title="Project" depth={1} />
            <RoleTitleRow colspan={colSpan} title="Project Info" depth={2} />

            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ProjectPermissionText}
              permissions={ProjectInfoPermissionList.filter(
                (v) => v !== 'project_delete',
              )}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <RoleTitleRow title="Member" colspan={colSpan} depth={2} />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ProjectPermissionText}
              permissions={ProjectMemberPermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <RoleTitleRow title="Role" colspan={colSpan} depth={2} />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ProjectPermissionText}
              permissions={ProjectRolePermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <RoleTitleRow title="Api Key" colspan={colSpan} depth={2} />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ProjectPermissionText}
              permissions={ProjectApiKeyPermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <RoleTitleRow title="Issue Tracker" colspan={colSpan} depth={2} />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ProjectPermissionText}
              permissions={ProjectTrackerPermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ProjectPermissionText}
              permissions={['project_delete']}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={2}
            />
            <RoleTitleRow title="Channel" colspan={colSpan} depth={1} />
            <RoleTitleRow title="Channel Info" colspan={colSpan} depth={2} />

            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ChannelPermissionText}
              permissions={ChannelInfoPermissionList.filter(
                (v) => v !== 'channel_create' && v !== 'channel_delete',
              )}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <RoleTitleRow title="Channel Field" colspan={colSpan} depth={2} />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ChannelPermissionText}
              permissions={ChannelFieldPermissionList}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={3}
            />
            <PermissionRows
              editRoleId={editRoleId}
              editPermissions={editPermissions}
              permText={ChannelPermissionText}
              permissions={['channel_create', 'channel_delete']}
              onChecked={(perm, checked) => {
                setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
              }}
              roles={data?.roles ?? []}
              depth={2}
            />
          </tbody>
        </table>
      </div>
    </SettingMenuTemplate>
  );
};

export default RoleSetting;
