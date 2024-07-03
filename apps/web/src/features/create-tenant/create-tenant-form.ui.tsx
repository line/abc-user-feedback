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
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';

import { toast } from '@ufb/ui';

import { Path, useOAIMutation } from '@/shared';
import { useTenantStore } from '@/entities/tenant';

import { createTenantFormSchema } from './create-tenant-form.schema';
import { DEFAULT_SUPER_ACCOUNT } from './default-super-account.constant';

type FormType = z.infer<typeof createTenantFormSchema>;

interface IProps {}

const CreateTenantForm: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { refetchTenant } = useTenantStore();
  const { register, handleSubmit, formState } = useForm<FormType>({
    resolver: zodResolver(createTenantFormSchema),
  });

  const { mutate: createTenant, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });

        toast.positive({
          title: 'Default Super User',
          description: `email: ${DEFAULT_SUPER_ACCOUNT.email} \n password: ${DEFAULT_SUPER_ACCOUNT.password}`,
        });

        router.replace(Path.SIGN_IN);
        await refetchTenant();
      },
      onError(error) {
        toast.negative({ title: 'Error', description: error?.message });
      },
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(({ siteName }) => createTenant({ siteName }))}
    >
      <h1 className="font-20-bold">{t('tenant.create.title')}</h1>
      <label>
        <span>{t('tenant.create.site-name')}</span>
        <input
          className="input"
          type="text"
          placeholder="Please enter the site name"
          {...register('siteName')}
        />
      </label>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={isPending || !formState.isValid}
      >
        {t('button.setting')}
      </button>
    </form>
  );
};

export default CreateTenantForm;
