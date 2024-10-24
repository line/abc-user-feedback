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

import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ufb/react';

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

interface IProps {
  roles: Role[];
  onClickRole?: (role: Role) => void;
}

const RoleTable: React.FC<IProps> = (props) => {
  const { onClickRole, roles } = props;

  const colSpan = roles.length + 2;

  return (
    <Table className="border-separate border-spacing-0 rounded border">
      <RoleTableHead roles={roles} onClickRole={onClickRole} />
      <TableBody>
        <RoleTitleRow colspan={colSpan} title="Feedback" />
        <PermissionRows
          permText={FeedbackPermissionText}
          permissions={FeedbackPermissionList}
          roles={roles}
        />

        <RoleTitleRow colspan={colSpan} title="Issue" />
        <PermissionRows
          permText={IssuePermissionText}
          permissions={IssuePermissionList}
          roles={roles}
        />

        <RoleTitleRow colspan={colSpan} title="Project" />
        <RoleTitleRow colspan={colSpan} title="Project Info" sub />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectInfoPermissionList.filter(
            (v) => v !== 'project_delete',
          )}
          roles={roles}
        />

        <RoleTitleRow title="Member" colspan={colSpan} sub />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectMemberPermissionList}
          roles={roles}
        />

        <RoleTitleRow title="Role" colspan={colSpan} sub />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectRolePermissionList}
          roles={roles}
        />

        <RoleTitleRow title="Api Key" colspan={colSpan} sub />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectApiKeyPermissionList}
          roles={roles}
        />

        <RoleTitleRow title="Issue Tracker" colspan={colSpan} sub />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectTrackerPermissionList}
          roles={roles}
        />

        <RoleTitleRow title="Webhook" colspan={colSpan} sub />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={ProjectWebhookPermissionList}
          roles={roles}
        />
        <PermissionRows
          permText={ProjectPermissionText}
          permissions={['project_delete']}
          roles={roles}
        />

        <RoleTitleRow colspan={colSpan} title="Channel" />
        <RoleTitleRow title="Channel Info" colspan={colSpan} sub />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={ChannelInfoPermissionList.filter(
            (v) => v !== 'channel_create' && v !== 'channel_delete',
          )}
          roles={roles}
        />

        <RoleTitleRow title="Channel Field" colspan={colSpan} sub />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={ChannelFieldPermissionList}
          roles={roles}
        />

        <RoleTitleRow title="Channel Image Setting" colspan={colSpan} sub />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={ChannelImageSettingPermissionList}
          roles={roles}
        />
        <PermissionRows
          permText={ChannelPermissionText}
          permissions={['channel_create', 'channel_delete']}
          roles={roles}
        />
      </TableBody>
    </Table>
  );
};

interface IRoleTableHeadProps {
  roles: Role[];
  onClickRole?: (role: Role) => void;
}

const RoleTableHead: React.FC<IRoleTableHeadProps> = (props) => {
  const { roles, onClickRole } = props;

  return (
    <TableHeader>
      <TableRow>
        <TableHead></TableHead>
        {roles.map((role) => (
          <TableHead key={role.id} className="text-center">
            <Button
              onClick={() => onClickRole?.(role)}
              variant="ghost"
              size="small"
              iconR="RiEditFill"
              className="font-normal"
            >
              {role.name}
            </Button>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

interface IRoleTitleRowProps {
  colspan: number;
  title: string;
  sub?: boolean;
}
const RoleTitleRow: React.FC<IRoleTitleRowProps> = ({
  colspan,
  title,
  sub,
}) => {
  return (
    <TableRow className={cn({ 'bg-neutral-tertiary': !sub })}>
      <TableCell colSpan={colspan}>
        <p className="font-12-bold">{title}</p>
      </TableCell>
    </TableRow>
  );
};

interface IPermissionRowsProps<T extends PermissionType> {
  permissions: readonly T[];
  permText: Record<T, string>;
  roles: Role[];
}

const PermissionRows = <T extends PermissionType>(
  props: IPermissionRowsProps<T>,
) => {
  const { permText, permissions, roles } = props;

  const { editingRole, editPermissions, checkPermission } = useInputRoleStore();

  return (
    <>
      {permissions.map((perm) => (
        <TableRow key={perm}>
          <TableCell width="250">{permText[perm]}</TableCell>
          {roles.map((role) => (
            <TableCell key={`${perm} ${role.id}`}>
              <p className="text-center">
                <Checkbox
                  disabled={editingRole?.id !== role.id}
                  onCheckedChange={(checked) =>
                    checkPermission(perm, !!checked)
                  }
                  checked={
                    editingRole?.id === role.id ?
                      (editPermissions[perm] ?? role.permissions.includes(perm))
                    : role.permissions.includes(perm)
                  }
                />
              </p>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default RoleTable;
