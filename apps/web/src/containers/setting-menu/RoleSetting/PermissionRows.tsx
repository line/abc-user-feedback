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
import { PermissionType } from '@/types/permission.type';
import { RoleType } from '@/types/role.type';

interface IProps<T extends PermissionType> {
  permissions: readonly T[];
  permText: Record<T, string>;
  roles: RoleType[];
  editRoleId?: number;
  editPermissions: Partial<Record<PermissionType, boolean>>;
  onChecked: (perm: T, checked: boolean) => void;
  depth?: number;
}

function PermissionRows<T extends PermissionType>(props: IProps<T>) {
  const {
    permissions,
    permText,
    roles,
    editRoleId,
    onChecked,
    editPermissions,
    depth,
  } = props;
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
                  disabled={editRoleId !== role.id}
                  checked={
                    editRoleId === role.id
                      ? editPermissions[perm] ?? role.permissions.includes(perm)
                      : role.permissions.includes(perm)
                  }
                  onChange={(e) => onChecked(perm, e.target.checked)}
                />
              </p>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default PermissionRows;
