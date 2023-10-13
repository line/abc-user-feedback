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
import { createContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Path } from '@/constants/path';
import client from '@/libs/client';
import type { TenantType } from '@/types/tenant.type';

export interface ITenantContext {
  tenant: TenantType | null;
  refetch: () => void;
}

export const TenantContext = createContext<ITenantContext>({
  tenant: null,
  refetch() {},
});

export const TenantProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [tenant, setTenant] = useState<TenantType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const fetch = () => {
    if (isInitialFetch) {
      setIsLoading(true);
      setIsInitialFetch(false);
    }

    client
      .get({ path: '/api/tenants' })
      .then(({ data }) => setTenant(data))
      .catch(() => router.push(Path.CREATE_TENANT))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (tenant && !isLoading) return;
    fetch();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, refetch: fetch }}>
      {isLoading ? (
        <p className="font-32-bold flex h-screen items-center justify-center">
          Loading...
        </p>
      ) : (
        <>
          <Head>
            <title>User Feedback - {tenant?.siteName}</title>
          </Head>
          {children}
        </>
      )}
    </TenantContext.Provider>
  );
};
