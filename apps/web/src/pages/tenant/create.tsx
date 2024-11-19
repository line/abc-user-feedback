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
import { useState } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/react';

import {
  AnonymousTemplate,
  DEFAULT_LOCALE,
  Path,
  useOAIMutation,
} from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { useTenantStore } from '@/entities/tenant';
import { SignUpWithEmailForm } from '@/features/auth/sign-up-with-email';
import { CreateTenantForm } from '@/features/create-tenant';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

const STEPS = ['tenant', 'user', 'final'] as const;

const CreateTenantPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [step, setStep] = useQueryState(
    'step',
    parseAsStringLiteral(STEPS)
      .withDefault('tenant')
      .withOptions({ history: 'push' }),
  );

  const [data, setData] = useState<{
    tenant: { siteName: string } | null;
    user: { email: string; password: string } | null;
  }>({
    tenant: null,
    user: null,
  });

  const { tenant, refetchTenant } = useTenantStore();

  const queryClient = useQueryClient();

  const { mutate: createTenant, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/tenants'],
        });
        await router.replace(Path.SIGN_IN);
        await refetchTenant();
        toast.success('Success');
      },
    },
  });

  return (
    <AnonymousTemplate
      title={
        step === 'final' ?
          t('tenant.create.complete-title')
        : t('tenant.create.title')
      }
      image={
        step === 'final' ?
          '/assets/images/complete-tenant-setting.png'
        : '/assets/images/tenant-info.png'
      }
    >
      {step === 'tenant' && (
        <CreateTenantForm
          onSubmit={({ siteName }) => {
            setData((prev) => ({ ...prev, tenant: { siteName } }));
            void setStep('user');
          }}
          submitText={t('button.next')}
        />
      )}
      {step === 'user' && (
        <SignUpWithEmailForm
          onSubmit={({ email, password }) => {
            setData((prev) => ({ ...prev, user: { email, password } }));
            void setStep('final');
          }}
          submitText={t('button.next')}
        />
      )}
      <div></div>
    </AnonymousTemplate>
  );
};

CreateTenantPage.getLayout = (page) => {
  return <AnonymousLayout> {page}</AnonymousLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreateTenantPage;
