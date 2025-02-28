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

import { Button, Switch, toast } from '@ufb/react';

import {
  SettingTemplate,
  useOAIMutation,
  useWarnIfUnsavedChanges,
} from '@/shared';
import type { AuthInfo } from '@/entities/tenant';
import {
  authInfoScema,
  EmailConfigForm,
  OAuthConfigForm,
  useTenantStore,
} from '@/entities/tenant';

interface IProps {}

const LoginSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { tenant, refetchTenant } = useTenantStore();

  const methods = useForm<AuthInfo>({ resolver: zodResolver(authInfoScema) });

  const { reset, handleSubmit, formState, watch, setValue } = methods;

  const { useEmail, useOAuth } = watch();

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        await refetchTenant();
        toast.success(t('v2.toast.success'));
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  useEffect(() => {
    if (!tenant) return;
    reset(tenant);
  }, [tenant]);

  const onSubmit = (input: AuthInfo) => {
    if (!tenant) return;
    if (!input.useEmail && !input.useOAuth) {
      toast.error("You can't disable both email and OAuth login");
      return;
    }
    if (!input.oauthConfig) {
      mutate({ ...tenant, ...input, oauthConfig: null });
      return;
    }

    mutate({
      ...tenant,
      ...input,
      oauthConfig: {
        ...input.oauthConfig,
        loginButtonName: input.oauthConfig.loginButtonName ?? '',
        loginButtonType: input.oauthConfig.loginButtonType ?? 'CUSTOM',
      },
    });
  };
  useWarnIfUnsavedChanges(formState.isDirty);

  return (
    <SettingTemplate
      title={t('tenant-setting-menu.sign-up-mgmt')}
      action={
        <Button
          form="form"
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={!formState.isDirty || isPending}
        >
          {t('button.save')}
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form id="form" className="flex flex-col gap-4">
          <div className="border-neutral-tertiary flex flex-col gap-2 rounded border p-6">
            <div className="flex">
              <div className="flex-1">
                <h5 className="text-title-h5 mb-1">Email Login</h5>
                <p className="text-neutral-tertiary text-small-normal">
                  {t('v2.login-setting.email-description')}
                </p>
              </div>
              <Switch
                checked={useEmail}
                onCheckedChange={(checked) =>
                  setValue('useEmail', checked, { shouldDirty: true })
                }
              />
            </div>
            {useEmail && <EmailConfigForm disabled={!useEmail} />}
          </div>
          <div className="border-neutral-tertiary flex flex-col gap-6 rounded border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-title-h5 mb-1">OAuth2.0 Login</h5>
                <p className="text-neutral-tertiary text-small-normal">
                  {t('v2.login-setting.oauth-description')}
                </p>
              </div>
              <Switch
                checked={useOAuth}
                onCheckedChange={(checked) => {
                  setValue('useOAuth', checked, { shouldDirty: true });
                  if (checked && !watch('oauthConfig.loginButtonType')) {
                    setValue('oauthConfig.loginButtonType', 'CUSTOM', {
                      shouldDirty: true,
                    });
                  }
                }}
              />
            </div>
            {useOAuth && <OAuthConfigForm disabled={!useOAuth} />}
          </div>
        </form>
      </FormProvider>
    </SettingTemplate>
  );
};

export default LoginSetting;
