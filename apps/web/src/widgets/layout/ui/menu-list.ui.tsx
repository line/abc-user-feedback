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
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Menu, MenuItem } from '@ufb/react';

import { firstLeterPascal } from '@/shared';

const MENU_ITEMS = ['dashboard', 'feedback', 'issue', 'settings'] as const;

type MenuType = (typeof MENU_ITEMS)[number];

interface Props {
  projectId?: number;
}

const MenuList: React.FC<Props> = ({ projectId }) => {
  const router = useRouter();
  const currentMenu = useMemo(() => router.pathname.split('/').pop(), [router]);

  return (
    <div className="flex-1">
      <Menu
        value={currentMenu}
        type="single"
        className="navbar-menu"
        disabled={!projectId}
        onValueChange={async (value: MenuType | '') => {
          if (!value) return;
          await router.push({
            pathname: `/main/project/[projectId]/${value}`,
            query: { projectId },
          });
        }}
      >
        {MENU_ITEMS.map((v, i) => (
          <MenuItem key={i} value={v}>
            {firstLeterPascal(v)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuList;
