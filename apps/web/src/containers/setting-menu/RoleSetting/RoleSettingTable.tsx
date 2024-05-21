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

import { useEffect, useMemo, useState } from 'react';

import PermissionRows from './PermissionRows';
import RoleSettingHead from './RoleSettingHead';
import RoleTitleRow from './RoleTitleRow';

import type { PermissionType } from '@/types/permission.type';
import {
  ChannelFieldPermissionList,
  ChannelImageSettingPermissionList,
  ChannelInfoPermissionList,
  ChannelPermissionText,
  FeedbackPermissionList,
  FeedbackPermissionText,
  IssuePermissionList,
  IssuePermissionText,
  PermissionList,
  ProjectApiKeyPermissionList,
  ProjectInfoPermissionList,
  ProjectMemberPermissionList,
  ProjectPermissionText,
  ProjectRolePermissionList,
  ProjectTrackerPermissionList,
  ProjectWebhookPermissionList,
} from '@/types/permission.type';
import type { RoleType } from '@/types/role.type';

interface IProps {
  projectId?: number;
  roles: RoleType[];
  updateRole: (input: {
    id: number;
    permissions: PermissionType[];
    name: string;
  }) => Promise<void> | void;
  onDelete: (roleId: number) => void;
  viewOnly?: boolean;
}

const RoleSettingTable: React.FC<IProps> = (props) => {
  const { projectId, roles, onDelete, updateRole, viewOnly } = props;
  const [editRoleId, setEditRoleId] = useState<number>();

  const [editPermissions, setEditPermissions] = useState<
    Partial<Record<PermissionType, boolean>>
  >({});

  const [editName, setEditName] = useState<string>();

  useEffect(() => {
    setEditPermissions({});
  }, [editRoleId]);

  const colSpan = useMemo(() => (roles.length ?? 0) + 2, [roles]);
  const onSubmitEdit = async () => {
    if (!editName || !editRoleId) return;
    const newRole = roles.find((v) => v.id === editRoleId);
    if (!newRole) return;

    const permEntires = Object.entries(editPermissions) as [
      PermissionType,
      boolean,
    ][];

    const newPermissions = permEntires.reduce<PermissionType[]>(
      (prev, [perm, checked]) => {
        if (checked) return prev.includes(perm) ? prev : prev.concat(perm);
        else return prev.includes(perm) ? prev.filter((v) => v !== perm) : prev;
      },
      newRole.permissions,
    );

    await updateRole({
      name: editName,
      permissions: newPermissions,
      id: editRoleId,
    });
    setEditRoleId(undefined);
  };
  const onChecked = (perm: PermissionType, checked: boolean) => {
    setEditPermissions((prev) => ({ ...prev, [perm]: checked }));
    if (
      checked &&
      (perm.includes('create') ||
        perm.includes('update') ||
        perm.includes('delete'))
    ) {
      const permPrefix = perm.split('_').slice(0, -1).join('_');

      const relatedPerms = PermissionList.filter((v) => {
        const vPrefix = v.split('_').slice(0, -1).join('_');
        return (
          vPrefix === permPrefix &&
          v.includes('read') &&
          !v.includes('download')
        );
      });
      relatedPerms.forEach((v) => {
        setEditPermissions((prev) => ({ ...prev, [v]: true }));
      });
    }
    if (!checked && perm.includes('read') && !perm.includes('download')) {
      const permprefix = perm.split('_').slice(0, -1).join('_');

      const relatedPerms = PermissionList.filter((v) => {
        const vPrefix = v.split('_').slice(0, -1).join('_');

        return (
          vPrefix === permprefix &&
          (v.includes('create') || v.includes('update') || v.includes('delete'))
        );
      });

      relatedPerms.forEach((v) => {
        setEditPermissions((prev) => ({ ...prev, [v]: false }));
      });
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Permissions</th>
          {roles.map((role) => (
            <th key={role.id}>
              <RoleSettingHead
                role={role}
                roles={roles}
                isEdit={editRoleId === role.id}
                projectId={projectId}
                onChangeEditRole={setEditRoleId}
                onChangeEditName={setEditName}
                onSubmitEdit={onSubmitEdit}
                onClickDelete={onDelete}
                onClickUpdate={updateRole}
                viewOnly={viewOnly}
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
          onChecked={onChecked}
          roles={roles ?? []}
          depth={1}
        />
        <RoleTitleRow colspan={colSpan} title="Issue" depth={0} />

        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={IssuePermissionText}
          permissions={IssuePermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
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
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow title="Member" colspan={colSpan} depth={2} />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ProjectPermissionText}
          permissions={ProjectMemberPermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow title="Role" colspan={colSpan} depth={2} />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ProjectPermissionText}
          permissions={ProjectRolePermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow title="Api Key" colspan={colSpan} depth={2} />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ProjectPermissionText}
          permissions={ProjectApiKeyPermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow title="Issue Tracker" colspan={colSpan} depth={2} />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ProjectPermissionText}
          permissions={ProjectTrackerPermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow title="Webhook" colspan={colSpan} depth={2} />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ProjectPermissionText}
          permissions={ProjectWebhookPermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ProjectPermissionText}
          permissions={['project_delete']}
          onChecked={onChecked}
          roles={roles ?? []}
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
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow title="Channel Field" colspan={colSpan} depth={2} />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ChannelPermissionText}
          permissions={ChannelFieldPermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <RoleTitleRow
          title="Channel Image Setting"
          colspan={colSpan}
          depth={2}
        />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ChannelPermissionText}
          permissions={ChannelImageSettingPermissionList}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={3}
        />
        <PermissionRows
          editRoleId={editRoleId}
          editPermissions={editPermissions}
          permText={ChannelPermissionText}
          permissions={['channel_create', 'channel_delete']}
          onChecked={onChecked}
          roles={roles ?? []}
          depth={2}
        />
      </tbody>
    </table>
  );
};

export default RoleSettingTable;
