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

import type { NextPageWithLayout } from '@/shared/types';
import { MainLayout } from '@/widgets';

import { DEFAULT_LOCALE } from '@/constants/i18n';
import { CreateProjectButton } from '@/containers/buttons';
import { ProjectCard, TenantCard } from '@/containers/main';
import { useProjects } from '@/hooks';

const CARD_BORDER_CSS =
  'border-fill-tertiary h-[204px] w-[452px] rounded border';

const MainIndexPage: NextPageWithLayout = () => {
  const { data } = useProjects();

  return (
    <div className="mx-4 my-2">
      <h1 className="font-20-bold mb-4">Tenant</h1>
      <div className="flex flex-wrap gap-2">
        <TenantCard />
      </div>
      <h1 className="font-20-bold my-6 mb-4">Project</h1>
      <div className="flex flex-wrap gap-2">
        {data?.items.map(({ id }) => <ProjectCard key={id} projectId={id} />)}
        <div
          className={[
            CARD_BORDER_CSS,
            'flex flex-col items-center justify-center',
          ].join(' ')}
        >
          <CreateProjectButton hasProject={data?.meta.totalItems !== 0} />
        </div>
      </div>
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
