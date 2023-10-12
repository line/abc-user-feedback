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
import Image from 'next/image';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icon, TextInput, toast } from '@ufb/ui';

import AuthTemplate from '@/components/templates/AuthTemplate';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useOAIMutation } from '@/hooks';
import type { NextPageWithLayout } from '../_app';

interface IForm {
  email: string;
}
const defaultValues: IForm = {
  email: '',
};

const schema = z.object({
  email: z.string().email(),
});

const ResetPasswordPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutate, isLoading } = useOAIMutation({
    method: 'post',
    path: '/api/users/password/reset/code',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });
        router.push(Path.SIGN_IN);
      },
      onError(error) {
        toast.negative({ title: error.message });
        setError('email', { message: error.message });
      },
    },
  });

  const onSubmit = (data: IForm) => mutate(data);
  return (
    <div className="m-auto w-[360px]">
      <div className="mb-12">
        <div className="mb-2 flex gap-0.5">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={12}
            height={12}
          />
          <Icon name="Title" className="h-[12px] w-[62px]" />
        </div>
        <p className="font-24-bold">{t('auth.reset-password.title')}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-12 space-y-4">
          <TextInput
            type="email"
            label="Email"
            placeholder={t('input.placeholder.email')}
            isSubmitted={formState.isSubmitted}
            isSubmitting={formState.isSubmitting}
            isValid={!formState.errors.email}
            hint={formState.errors.email?.message}
            {...register('email')}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formState.isValid || isLoading}
          >
            {t('auth.reset-password.button.send-email')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={router.back}
          >
            {t('button.back')}
          </button>
        </div>
      </form>
    </div>
  );
};

ResetPasswordPage.getLayout = function getLayout(page) {
  return <AuthTemplate>{page}</AuthTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default ResetPasswordPage;
