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
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from '@ufb/ui';

import AuthTemplate from '@/components/templates/AuthTemplate';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useTenant } from '@/contexts/tenant.context';
import { useOAIMutation } from '@/hooks';
import type { NextPageWithLayout } from '../_app';

interface IForm {
  siteName: string;
}

const schema: Zod.ZodType<IForm> = z.object({
  siteName: z.string(),
});

const defaultValues: IForm = {
  siteName: '',
};

const CreatePage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const { refetch } = useTenant();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });
        toast.positive({
          title: 'create Default Super User',
          description: 'email: user@feedback.com \n password: 12345678',
        });
        router.push(Path.SIGN_IN);
        refetch();
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });
  const onSubmit = (data: IForm) => mutate(data);

  return (
    <AuthTemplate>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-[400px] rounded border p-4 shadow">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <h1 className="font-20-bold">{t('tenant.create.title')}</h1>
            <label>
              <span>{t('tenant.create.site-name')}</span>
              <input className="input" type="text" {...register('siteName')} />
            </label>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={isPending}
            >
              {t('button.setting')}
            </button>
          </form>
        </div>
      </div>
    </AuthTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreatePage;
