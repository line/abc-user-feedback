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
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TextInput, toast } from '@ufb/ui';

import { SettingMenuTemplate } from '@/components';
import { useTenant } from '@/contexts/tenant.context';
import { useOAIMutation } from '@/hooks';

interface IForm {
  siteName: string;
  description: string | null;
}
const scheme: Zod.ZodType<IForm> = z.object({
  siteName: z.string().min(2),
  description: z.string().nullable(),
});

interface IProps extends React.PropsWithChildren {}

const TenantInfoSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { tenant: data, refetch } = useTenant();
  const { reset, register, handleSubmit, formState } = useForm<IForm>({
    resolver: zodResolver(scheme),
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/tenants',
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  useEffect(() => {
    if (!data) return;
    reset(data);
  }, [data]);

  const onSubmit = (input: IForm) => {
    if (!data) return;
    mutate({ ...data, ...input });
  };
  return (
    <SettingMenuTemplate
      title={t('tenant-setting-menu.tenant-info')}
      actionBtn={{
        children: t('button.save'),
        onClick: handleSubmit(onSubmit),
        form: 'form',
        type: 'submit',
        disabled: !formState.isDirty || isPending,
      }}
    >
      <form id="form" className="flex flex-col gap-6">
        <TextInput value={data?.id} label="Tenant ID" disabled />
        <TextInput
          {...register('siteName')}
          label="Tenant Name"
          hint={formState.errors.siteName?.message}
          isValid={!formState.errors.siteName}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
          required
        />
        <TextInput
          {...register('description')}
          label="Description"
          hint={formState.errors.siteName?.message}
          isValid={!formState.errors.siteName}
          isSubmitted={formState.isSubmitted}
          isSubmitting={formState.isSubmitting}
        />
      </form>
    </SettingMenuTemplate>
  );
};

export default TenantInfoSetting;
