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
import { FormProvider, useForm } from 'react-hook-form';

import { Button, toast } from '@ufb/react';

import { SettingTemplate, useOAIMutation } from '@/shared';
import type { TenantInfo } from '@/entities/tenant';
import {
  TenantInfoForm,
  tenantInfoSchema,
  useTenantStore,
} from '@/entities/tenant';

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
        toast.success(t('v2.toast.success'));
      },
    },
  });

  useEffect(() => {
    if (!tenant) return;
    methods.reset(tenant);
  }, [tenant]);

  const onSubmit = (input: TenantInfo) => {
    if (!tenant) return;
    if (!tenant.oauthConfig) {
      mutate({ ...tenant, ...input, oauthConfig: null });
      return;
    }
    mutate({
      ...tenant,
      ...input,
      oauthConfig: {
        ...tenant.oauthConfig,
        loginButtonName: tenant.oauthConfig.loginButtonName ?? '',
        loginButtonType: tenant.oauthConfig.loginButtonType ?? 'CUSTOM',
      },
    });
  };

  return (
    <SettingTemplate
      title={t('tenant-setting-menu.tenant-info')}
      action={
        <Button
          form="tenantInfo"
          type="submit"
          disabled={!methods.formState.isDirty || isPending}
        >
          {t('button.save')}
        </Button>
      }
    >
      <form id="tenantInfo" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <TenantInfoForm />
        </FormProvider>
      </form>
    </SettingTemplate>
  );
};

export default TenantInfoSetting;
