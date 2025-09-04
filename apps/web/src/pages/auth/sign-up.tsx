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
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { toast } from '@ufb/react';

import { AnonymousTemplate, Path, useOAIMutation } from '@/shared';
import type { NextPageWithLayout } from '@/shared/types';
import { SignUpWithEmailForm } from '@/features/auth';
import { AnonymousLayout } from '@/widgets/anonymous-layout';

import serverSideTranslations from '@/server-side-translations';

const SignUpPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: signUp, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/auth/signUp/email',
    queryOptions: {
      async onSuccess() {
        await router.push(Path.SIGN_IN);
        toast.success(t('v2.toast.success'));
      },
    },
  });

  return (
    <AnonymousTemplate
      title={t('v2.auth.sign-up.title')}
      image="/assets/images/sign-up.svg"
    >
      <SignUpWithEmailForm
        onSubmit={signUp}
        loading={isPending}
        submitText={t('button.sign-up')}
      />
    </AnonymousTemplate>
  );
};

SignUpPage.getLayout = (page) => {
  return <AnonymousLayout>{page}</AnonymousLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    },
  };
};

export default SignUpPage;
