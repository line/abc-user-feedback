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
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LOCALE, SectionTemplate } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { ProjectCard } from '@/entities/project';
import { TenantCard, useTenantStore } from '@/entities/tenant';
import { RouteCreateProjectButton } from '@/features/create-project';
import { MainLayout } from '@/widgets';

import { useOAIQuery } from '@/hooks';

const MainIndexPage: NextPageWithLayout = () => {
  const { data } = useOAIQuery({
    path: '/api/admin/projects',
    variables: { limit: 1000, page: 1 },
  });
  const { tenant } = useTenantStore();

  return (
    <div className="mx-4 my-2 flex flex-col gap-8">
      <SectionTemplate title="Tenant">
        {tenant && <TenantCard tenant={tenant} />}
      </SectionTemplate>
      <SectionTemplate title="Project">
        <div className="flex flex-wrap gap-4">
          {data?.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <div
            className={
              'border-fill-tertiary flex h-[204px] w-[452px] flex-col items-center justify-center rounded border'
            }
          >
            <RouteCreateProjectButton
              hasProject={data?.meta.totalItems !== 0}
            />
          </div>
        </div>
      </SectionTemplate>
    </div>
  );
};

MainIndexPage.getLayout = (page) => {
  return <MainLayout>{page}</MainLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: { ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)) },
  };
};

export default MainIndexPage;
