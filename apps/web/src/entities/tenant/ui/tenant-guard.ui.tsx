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
import type React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Path, useOAIQuery } from '@/shared';

import { useTenantStore } from '../tenant.model';
import type { Tenant } from '../tenant.type';

interface IProps extends React.PropsWithChildren {}

const TenantGuard: React.FC<IProps> = ({ children }) => {
  const router = useRouter();
  const { setTenant } = useTenantStore();

  const { data, error } = useOAIQuery({
    path: '/api/admin/tenants',
    queryOptions: { retry: false, refetchOnWindowFocus: false },
  });

  useEffect(() => {
    if (error?.statusCode === 404) void router.replace(Path.CREATE_TENANT);
    if (data) setTenant(data as Tenant);
  }, [data, error, router.pathname]);

  return children;
};

export default TenantGuard;
