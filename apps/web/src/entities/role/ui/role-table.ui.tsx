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
import { useEffect } from 'react';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'react-i18next';

import type { IconNameType } from '@ufb/ui';
import { Icon, Popover, PopoverContent, PopoverTrigger } from '@ufb/ui';

import { cn } from '@/shared';

import { useInputRoleStore } from '../input-role.model';
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
} from '../permission.type';
import type { PermissionType } from '../permission.type';
import type { Role } from '../role.type';
import DeleteRolePopover from './delete-role-popover.ui';
import UpdateRoleNamePopover from './update-role-name-popover.ui';

interface IProps {
  roles: Role[];
  onUpdateRole?: (role: Role) => void;
  onDeleteRole?: (role: Role) => void;
}

const RoleTable: React.FC<IProps> = (props) => {
  const { onUpdateRole, onDeleteRole, roles } = props;

  const colSpan = roles.length + 2;

  return (
    <table className="table">
      <TableHead
        roles={roles}
        onUpdateRole={onUpdateRole}
        onDeleteRole={onDeleteRole}
      />
      <tbody>
        <RoleTitleRow colspan={colSpan} title="Feedback" depth={0} />
        <PermissionRows
          permText={FeedbackPermissionText}
          permissions={FeedbackPermissionList}
          roles={roles ?? []}
          depth={1}
        />

        <RoleTitleRow colspan={colSpan} title="Issue" depth={0} />
        <PermissionRows
          permText={IssuePermissionText}
          permissions={IssuePermissionList}
          roles={roles ?? []}
          depth={1}
        />

        <RoleTitleRow colspan={colSpan} title="Setting" depth={0} />
        <RoleTitleRow colspan={colSpan} title="Project" depth={1} />
        <RoleTitleRow colspan={colSpan} title="Project Info" depth={2} />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectInfoPermissionList.filter(
            (v) => v !== 'project_delete',
          )}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow title="Member" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectMemberPermissionList}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow title="Role" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectRolePermissionList}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow title="Api Key" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectApiKeyPermissionList}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow title="Issue Tracker" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectTrackerPermissionList}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow title="Webhook" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectWebhookPermissionList}
          roles={roles ?? []}
          depth={3}
        />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={['project_delete']}
          roles={roles ?? []}
          depth={2}
        />

        <RoleTitleRow title="Channel" colspan={colSpan} depth={1} />
        <RoleTitleRow title="Channel Info" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={ChannelInfoPermissionList.filter(
            (v) => v !== 'channel_create' && v !== 'channel_delete',
          )}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow title="Channel Field" colspan={colSpan} depth={2} />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={ChannelFieldPermissionList}
          roles={roles ?? []}
          depth={3}
        />

        <RoleTitleRow
          title="Channel Image Setting"
          colspan={colSpan}
          depth={2}
        />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={ChannelImageSettingPermissionList}
          roles={roles ?? []}
          depth={3}
        />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={['channel_create', 'channel_delete']}
          roles={roles ?? []}
          depth={2}
        />
      </tbody>
    </table>
  );
};

interface ITableHeadProps {
  roles: Role[];
  onUpdateRole?: (role: Role) => void;
  onDeleteRole?: (role: Role) => void;
}

const TableHead: React.FC<ITableHeadProps> = (props) => {
  const { roles, onUpdateRole, onDeleteRole } = props;

  const { t } = useTranslation();
  const overlay = useOverlay();

  const { editingRole, clear, setEditingRole, editPermissions } =
    useInputRoleStore();
  useEffect(() => {
    clear();
  }, []);

  const openUpdateRoleNameModal = (role: Role) => {
    return (
      onUpdateRole &&
      overlay.open(({ isOpen, close }) => (
        <UpdateRoleNamePopover
          open={isOpen}
          onOpenChange={() => close()}
          onClickUpdate={onUpdateRole}
          role={role}
          roles={roles}
        />
      ))
    );
  };
  const openDeleteRolePopover = (role: Role) => {
    return (
      onDeleteRole &&
      overlay.open(({ isOpen, close }) => (
        <DeleteRolePopover
          open={isOpen}
          onOpenChange={() => close()}
          onClickDelete={() => onDeleteRole(role)}
        />
      ))
    );
  };

  const onEditPermission = async () => {
    if (!editingRole) return;

    const permEntires = Object.entries(editPermissions) as [
      PermissionType,
      boolean,
    ][];

    const newPermissions = permEntires
      .reduce<PermissionType[]>((prev, [perm, checked]) => {
        if (checked) return prev.includes(perm) ? prev : prev.concat(perm);
        else return prev.includes(perm) ? prev.filter((v) => v !== perm) : prev;
      }, editingRole.permissions)
      .filter((v) => PermissionList.includes(v));

    onUpdateRole?.({ ...editingRole, permissions: newPermissions });
    clear();
  };

  type MenuType = {
    icon: IconNameType;
    label: string;
    onClick: (role: Role) => void;
  };

  const MENU_ITEMS: MenuType[] = [
    ...((onUpdateRole ?
      [
        {
          icon: 'EditFill',
          label: t('main.setting.role-mgmt.edit-role'),
          onClick: (role: Role) => setEditingRole(role),
        },
        {
          icon: 'DriverRegisterFill',
          label: t('main.setting.role-mgmt.update-role-name'),
          onClick: (role: Role) => openUpdateRoleNameModal(role),
        },
      ]
    : []) as MenuType[]),
    ...((onDeleteRole ?
      [
        {
          icon: 'TrashFill',
          label: t('main.setting.role-mgmt.delete-role'),
          onClick: (role: Role) => openDeleteRolePopover(role),
        },
      ]
    : []) as MenuType[]),
  ];

  return (
    <thead>
      <tr>
        <th>Permissions</th>
        {roles.map((role) => (
          <th key={role.id}>
            <div className="flex items-center justify-center gap-1">
              <p className="text-center">{role.name}</p>
              {role.id === editingRole?.id ?
                <div className="flex gap-1">
                  <button
                    className="icon-btn icon-btn-xs icon-btn-tertiary"
                    onClick={clear}
                  >
                    <Icon name="Close" className="text-red-primary" />
                  </button>
                  <button
                    className="icon-btn icon-btn-xs icon-btn-tertiary"
                    onClick={onEditPermission}
                  >
                    <Icon name="Check" className="text-blue-primary" />
                  </button>
                </div>
              : MENU_ITEMS.length > 0 && (
                  <Popover placement="bottom-start">
                    <PopoverTrigger className="icon-btn icon-btn-xs icon-btn-tertiary">
                      <Icon name="Dots" className="rotate-90" />
                    </PopoverTrigger>
                    <PopoverContent>
                      <ul className="w-[160px] p-1">
                        {MENU_ITEMS.map(({ icon, label, onClick }, i) => (
                          <li key={i}>
                            <button
                              className={cn([
                                'hover:bg-fill-tertiary mb-1 flex w-full items-center gap-2 rounded p-2 text-start disabled:bg-inherit',
                                //   !hasUpdateRolePerm ?
                                //     'text-tertiary cursor-not-allowed'
                                //   : 'hover:bg-fill-tertiary cursor-pointer',
                              ])}
                              onClick={() => onClick(role)}
                            >
                              <Icon name={icon} size={16} />
                              <span className="font-12-regular">{label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                )
              }
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

interface IRoleTitleRowProps {
  colspan: number;
  depth?: number;
  title: string;
}
const RoleTitleRow: React.FC<IRoleTitleRowProps> = ({
  colspan,
  title,
  depth,
}) => {
  return (
    <tr>
      <td colSpan={colspan}>
        <p
          className="font-12-bold"
          style={{ marginLeft: depth ? depth * 10 * 4 : 0 }}
        >
          {title}
        </p>
      </td>
    </tr>
  );
};

interface IPermissionRowsProps<T extends PermissionType> {
  permissions: readonly T[];
  permText: Record<T, string>;
  roles: Role[];
  depth?: number;
}

const PermissionRows = <T extends PermissionType>(
  props: IPermissionRowsProps<T>,
) => {
  const { permText, permissions, roles, depth } = props;

  const { editingRole, editPermissions, checkPermission } = useInputRoleStore();

  return (
    <>
      {permissions.map((perm) => (
        <tr key={perm}>
          <td width="30%">
            <p style={{ marginLeft: depth ? depth * 10 * 4 : 0 }}>
              {permText[perm]}
            </p>
          </td>
          {roles.map((role) => (
            <td key={`${perm} ${role.id}`}>
              <p className="text-center">
                <input
                  className="checkbox"
                  type="checkbox"
                  disabled={editingRole?.id !== role.id}
                  checked={
                    editingRole?.id === role.id ?
                      editPermissions[perm] ?? role.permissions.includes(perm)
                    : role.permissions.includes(perm)
                  }
                  onChange={(e) => checkPermission(perm, e.target.checked)}
                />
              </p>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default RoleTable;
