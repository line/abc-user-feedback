/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { useRouter } from 'next/router';

import { PermissionList } from '@/entities/role';
import type { PermissionType } from '@/entities/role';
import { useAuth } from '@/features/auth';

import useOAIQuery from './useOAIQuery';

const usePermissions = (inputProjectId?: number | null) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<readonly PermissionType[]>([]);

  const router = useRouter();

  const { data } = useOAIQuery({
    path: '/api/admin/users/{userId}/roles',
    variables: { userId: user?.id ?? 0 },
    queryOptions: { enabled: !!user },
  });

  const projectId = useMemo(() => {
    if (inputProjectId) return inputProjectId;
    if (!router.query.projectId) return null;
    return Number(router.query.projectId);
  }, [router, inputProjectId]);

  useEffect(() => {
    if (user?.type === 'SUPER') return setPermissions(PermissionList);
    if (!data) return;
    const role = data.roles.find((v) => v.project.id === projectId);
    if (!role) setPermissions([]);
    else setPermissions(role.permissions);
  }, [data, projectId]);

  return permissions;
};

export default usePermissions;
