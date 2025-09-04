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
import { useEffect } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Icon } from '@ufb/react';

import { Path, useAllProjects } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { TenantGuard } from '@/entities/tenant';
import { useAuth } from '@/features/auth';

import serverSideTranslations from '@/server-side-translations';

const MainIndexPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useAllProjects();

  useEffect(() => {
    if (!data || !user) return;

    const [project] = data.items;
    if (project) {
      void router.push({
        pathname: Path.PROJECT_MAIN,
        query: { projectId: project.id },
      });
      return;
    }

    if (user.type === 'SUPER') {
      void router.push({ pathname: Path.CREATE_PROJECT });
      return;
    }
    void router.push({ pathname: '/main/profile' });
  }, [data, user, router]);

  return (
    <TenantGuard>
      <div className="flex h-screen items-center justify-center">
        <Icon name="RiLoader2Line" className="animate-spin" size={40} />
      </div>
    </TenantGuard>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default MainIndexPage;
