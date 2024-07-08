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

import { create } from 'zustand';

import { PermissionList } from './permission.type';
import type { PermissionType } from './permission.type';
import type { Role } from './role.type';

type State = {
  editingRole: Role | null;
  editPermissions: Partial<Record<PermissionType, boolean>>;
};
type Action = {
  changeEditingRole: <T extends keyof Role>(key: T, value: Role[T]) => void;
  clearEditingRole: () => void;
  setEditingRole: (edit: Role) => void;
  checkPermission: (perm: PermissionType, isChecked: boolean) => void;
};

export const useInputRoleStore = create<State & Action>((set) => ({
  editingRole: null,
  editPermissions: {},
  checkPermission: (perm: PermissionType, checked: boolean) => {
    set(({ editPermissions }) => ({
      editPermissions: { ...editPermissions, [perm]: checked },
    }));
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
      relatedPerms.forEach((perm) => {
        set(({ editPermissions }) => ({
          editPermissions: { ...editPermissions, [perm]: true },
        }));
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

      relatedPerms.forEach((perm) => {
        set(({ editPermissions }) => ({
          editPermissions: { ...editPermissions, [perm]: false },
        }));
      });
    }
  },
  clearEditingRole: () => set({ editingRole: null }),
  setEditingRole: (role) => set({ editingRole: role }),
  changeEditingRole: (key, value) =>
    set(({ editingRole }) =>
      editingRole ? { editingRole: { ...editingRole, [key]: value } } : {},
    ),
  // saveROle: (key,value) => set()
}));
