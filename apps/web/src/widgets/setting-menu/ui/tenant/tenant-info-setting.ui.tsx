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
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { useOAIMutation } from '@/shared';
import type { TenantInfo } from '@/entities/tenant';
import {
  TenantInfoForm,
  tenantInfoSchema,
  useTenantStore,
} from '@/entities/tenant';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {}

const TenantInfoSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { tenant, refetchTenant } = useTenantStore();

  const methods = useForm<TenantInfo>({
    resolver: zodResolver(tenantInfoSchema),
  });

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        await refetchTenant();
        toast.positive({ title: t('toast.save') });
      },
      onError(error) {
        toast.negative({ title: error.message ?? 'Error' });
      },
    },
  });

  useEffect(() => {
    if (!tenant) return;
    methods.reset(tenant);
  }, [tenant]);

  const onSubmit = (input: TenantInfo) => {
    if (!tenant) return;
    mutate({ ...tenant, ...input });
  };

  return (
    <SettingMenuTemplate
      title={t('tenant-setting-menu.tenant-info')}
      actionBtn={{
        form: 'form',
        type: 'submit',
        children: t('button.save'),
        disabled: !methods.formState.isDirty || isPending,
      }}
    >
      <form id="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <TenantInfoForm />
        </FormProvider>
      </form>
    </SettingMenuTemplate>
  );
};

export default TenantInfoSetting;
