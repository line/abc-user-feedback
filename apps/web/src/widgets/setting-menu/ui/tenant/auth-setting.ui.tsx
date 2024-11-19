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

import { Switch } from '@ufb/react';
import { toast } from '@ufb/ui';

import { useOAIMutation } from '@/shared';
import type { AuthInfo } from '@/entities/tenant';
import {
  authInfoScema,
  EmailConfigForm,
  OAuthConfigForm,
  useTenantStore,
} from '@/entities/tenant';

import SettingMenuTemplate from '../setting-menu-template';

interface IProps {}

const AuthSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { tenant, refetchTenant } = useTenantStore();

  const methods = useForm<AuthInfo>({
    resolver: zodResolver(authInfoScema),
  });

  const { reset, handleSubmit, formState, watch, setValue } = methods;
  const { isRestrictDomain, useOAuth } = watch();

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
    reset(tenant);
  }, [tenant]);

  const onSubmit = (input: AuthInfo) => {
    if (!tenant) return;
    if (input.isRestrictDomain) {
      input.allowDomains = (input.allowDomains ?? []).filter(
        (v) => v && v.length > 0,
      );
    } else {
      input.allowDomains = [];
    }
    mutate({ ...tenant, ...input });
  };

  return (
    <SettingMenuTemplate
      title={t('tenant-setting-menu.sign-up-mgmt')}
      actionBtn={{
        children: t('button.save'),
        onClick: handleSubmit(onSubmit),
        form: 'form',
        type: 'submit',
        disabled: !formState.isDirty || isPending,
      }}
    >
      <FormProvider {...methods}>
        <form id="form" className="flex flex-col gap-6">
          <div className="border-neutral-tertiary flex flex-col gap-2 rounded border p-6">
            <div className="flex">
              <div className="flex-1">
                <h5 className="text-title-h5 mb-1">Email Login</h5>
                <p className="text-neutral-tertiary text-small-normal">
                  Email 인증을 통해 회원가입 및 로그인할 수 있는 방식을
                  제공합니다.
                </p>
              </div>
              <Switch
                checked={isRestrictDomain}
                onCheckedChange={(checked) =>
                  setValue('isRestrictDomain', checked, { shouldDirty: true })
                }
              />
            </div>
            <EmailConfigForm disabled={!isRestrictDomain} />
          </div>
          <div className="border-neutral-tertiary flex flex-col gap-2 rounded border p-6">
            <div className="flex">
              <div className="flex-1">
                <h5 className="text-title-h5 mb-1">OAuth2.0 Login</h5>
                <p className="text-neutral-tertiary text-small-normal">
                  OAuth2.0을 활용해 로그인할 수 있는 방식을 제공합니다.
                </p>
              </div>
              <Switch
                checked={useOAuth}
                onCheckedChange={(checked) =>
                  setValue('useOAuth', checked, { shouldDirty: true })
                }
              />
            </div>
            <OAuthConfigForm disabled={!useOAuth} />
          </div>
        </form>
      </FormProvider>
    </SettingMenuTemplate>
  );
};

export default AuthSetting;
