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
import { useEffect, useState } from 'react';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { Button, toast } from '@ufb/react';

import { AnonymousTemplate, Path, TextInput, useOAIMutation } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { useTenantStore } from '@/entities/tenant';
import type { SignUpWithEmailType } from '@/features/auth/sign-up-with-email';
import { SignUpWithEmailForm } from '@/features/auth/sign-up-with-email';
import { CreateTenantForm } from '@/features/create-tenant';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

import { env } from '@/env';
import serverSideTranslations from '@/server-side-translations';

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
    user: SignUpWithEmailType | null;
  }>({
    tenant: null,
    user: null,
  });

  const { tenant } = useTenantStore();

  const { mutate: createTenant, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        await router.replace(Path.SIGN_IN);
        router.reload();
        toast.success(t('v2.toast.success'));
      },
    },
  });

  const onClickComplete = () => {
    if (!data.tenant || !data.user) return;
    createTenant({
      siteName: data.tenant.siteName,
      email: data.user.email,
      password: data.user.password,
    });
  };

  useEffect(() => {
    if (env.NODE_ENV === 'development') return;
    if (!tenant) return;
    void router.replace(Path.MAIN);
  }, [tenant]);

  return (
    <AnonymousTemplate
      title={t('v2.create-tenant.tenant.title')}
      description={t(`v2.create-tenant.${step}.description`)}
      image={
        step === 'final' ?
          '/assets/images/complete-tenant-setting.svg'
        : '/assets/images/tenant-setting.svg'
      }
    >
      <div className="flex min-h-[300px] flex-col">
        {step === 'tenant' && (
          <CreateTenantForm
            onSubmit={({ siteName }) => {
              setData((prev) => ({ ...prev, tenant: { siteName } }));
              void setStep('user');
            }}
            submitText={t('button.next')}
            defaultValues={data.tenant}
          />
        )}
        {step === 'user' && (
          <SignUpWithEmailForm
            onSubmit={(user) => {
              setData((prev) => ({ ...prev, user }));
              void setStep('final');
            }}
            submitText={t('button.next')}
            initialValues={data.user}
          />
        )}
        {step === 'final' && (
          <>
            <div className="mb-44 flex flex-col gap-4">
              <TextInput label="Name" value={data.tenant?.siteName} disabled />
              <TextInput label="Email" value={data.user?.email} disabled />
            </div>
            <Button size="medium" onClick={onClickComplete} loading={isPending}>
              {t('v2.button.confirm')}
            </Button>
          </>
        )}
      </div>
    </AnonymousTemplate>
  );
};

CreateTenantPage.getLayout = (page) => {
  return <AnonymousLayout> {page}</AnonymousLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default CreateTenantPage;
