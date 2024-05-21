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
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useTenantActions } from '../tenant.model';

import { Path } from '@/constants/path';
import { useOAIQuery } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

export const TenantGuard: React.FC<IProps> = ({ children }) => {
  const router = useRouter();
  const { setTenant } = useTenantActions();

  const { data, status, error } = useOAIQuery({
    path: '/api/admin/tenants',
    queryOptions: { retry: 0 },
  });

  useEffect(() => {
    if (error?.statusCode === 404) void router.push(Path.CREATE_TENANT);
    if (data) setTenant(data);
  }, [data, error]);

  if (status === 'pending') return <div>Loading...</div>;
  return children;
};
