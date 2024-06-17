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
import { useEffect } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from '@/shared/types';
import { useTenantStore } from '@/entities/tenant';
import { CreateTenantForm } from '@/features/create-tenant';
import { MainLayout } from '@/widgets';

import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';

const CreateTenantPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { tenant } = useTenantStore();

  useEffect(() => {
    if (!tenant) return;
    router.replace(Path.SIGN_IN);
  }, [tenant]);

  return <CreateTenantForm />;
};

CreateTenantPage.getLayout = (page) => {
  return <MainLayout center> {page}</MainLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreateTenantPage;
