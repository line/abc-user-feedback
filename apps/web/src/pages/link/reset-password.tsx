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
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon, TextInput, toast } from '@ufb/ui';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useOAIMutation } from '@/hooks';

import { NextPageWithLayout } from '../_app';

interface IForm {
  password: string;
  confirmPassword: string;
}

const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(
    (schema) => schema.password === schema.confirmPassword,
    'Password not matched',
  );

const defaultValues = { password: '', confirmPassword: '' };

const ResetPasswordPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const code = useMemo(() => router.query?.code as string, [router.query]);
  const email = useMemo(() => router.query?.email as string, [router.query]);

  const { handleSubmit, register, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutate, isLoading } = useOAIMutation({
    method: 'post',
    path: '/api/users/password/reset',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });
        router.push(Path.SIGN_IN);
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  const onSubmit = async ({ password }: IForm) =>
    mutate({ code, email, password });

  return (
    <MainTemplate>
      <div className="max-w-[440px] w-[100%] m-auto border border-fill-secondary rounded p-10">
        <div className="mb-12">
          <div className="flex gap-0.5 mb-2">
            <Image
              src="/assets/images/logo.svg"
              alt="logo"
              width={12}
              height={12}
            />
            <Icon name="Title" className="w-[62px] h-[12px]" />
          </div>
          <p className="font-24-bold">{t('link.reset-password.title')}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mb-12">
            <TextInput type="email" label="Email" value={email} disabled />
            <TextInput
              type="password"
              label={t('input.label.password')}
              placeholder={t('input.placeholder.password')}
              isSubmitted={formState.isSubmitted}
              isSubmitting={formState.isSubmitting}
              isValid={!formState.errors.password}
              hint={formState.errors.password?.message}
              {...register('password')}
              required
            />
            <TextInput
              type="password"
              label={t('input.label.confirm-password')}
              placeholder={t('input.placeholder.confirm-password')}
              isSubmitted={formState.isSubmitted}
              isSubmitting={formState.isSubmitting}
              isValid={!formState.errors.confirmPassword}
              hint={formState.errors.confirmPassword?.message}
              {...register('confirmPassword')}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formState.isValid || isLoading}
            >
              {t('button.setting')}
            </button>
          </div>
        </form>
      </div>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default ResetPasswordPage;
