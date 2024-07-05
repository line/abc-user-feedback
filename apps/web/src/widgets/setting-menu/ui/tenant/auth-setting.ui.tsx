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
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { Badge, Input, toast } from '@ufb/ui';

import { DescriptionTooltip, RadioGroup, useOAIMutation } from '@/shared';
import type { AuthInfo } from '@/entities/tenant';
import {
  authInfoScema,
  OAuthConfigForm,
  useTenantStore,
} from '@/entities/tenant';

import { SettingMenuTemplate } from '@/components';

type DomainStateType = {
  isSubmitted: boolean;
  isValid: boolean;
  hint?: string;
};

interface IProps {}

const AuthSetting: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { tenant, refetchTenant } = useTenantStore();

  const methods = useForm<AuthInfo>({
    resolver: zodResolver(authInfoScema),
  });

  const { reset, handleSubmit, watch, setValue, formState } = methods;

  const [domainState, setDomainState] = useState<DomainStateType>({
    isSubmitted: false,
    isValid: false,
  });

  const [currentDomain, setCurrentDomain] = useState('');

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        await refetchTenant();
        toast.positive({ title: t('toast.save') });
        setDomainState({ isSubmitted: false, isValid: false });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  useEffect(() => {
    if (!tenant) return;
    reset(tenant);
  }, [tenant]);

  const onClickDelete = (targetIndex: number) => () => {
    setValue(
      'allowDomains',
      (watch('allowDomains') ?? []).filter((_, i) => i !== targetIndex),
      { shouldDirty: true },
    );
  };

  const onClickAdd = () => {
    setDomainState({ isSubmitted: true, isValid: true });
    if (!currentDomain || currentDomain.length < 1) {
      setDomainState((prev) => ({
        ...prev,
        isValid: false,
        hint: t('hint.required'),
      }));
      return;
    }

    const domain = currentDomain.slice(currentDomain.startsWith('@') ? 1 : 0);

    if (!/[a-z]+\.[a-z]{2,3}/.test(domain)) {
      setDomainState((prev) => ({
        ...prev,
        isValid: false,
        hint: t('hint.invalid-domain'),
      }));
      return;
    }

    setValue(`allowDomains.${(watch('allowDomains') ?? []).length}`, domain, {
      shouldDirty: true,
    });

    setCurrentDomain('');
    setDomainState((prev) => ({ ...prev, isValid: true }));
  };

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
          <div className="flex flex-col gap-4">
            <p className="input-label flex items-center gap-1">Login Method</p>
            <RadioGroup
              name="signUpMethod"
              radios={[
                {
                  label: t('main.setting.sign-up-mgmt.ufb-login'),
                  checked: watch('useEmail') && !watch('useOAuth'),
                  onChecked: (isChecked) => {
                    if (!isChecked) return;
                    setValue('useEmail', true, { shouldDirty: true });
                    setValue('useOAuth', false, { shouldDirty: true });
                  },
                },
                {
                  label: t('main.setting.sign-up-mgmt.oauth-login'),
                  checked: !watch('useEmail') && watch('useOAuth'),
                  onChecked: (isChecked) => {
                    if (!isChecked) return;
                    setValue('useEmail', false, { shouldDirty: true });
                    setValue('useOAuth', true, { shouldDirty: true });
                  },
                },
                {
                  label: t('main.setting.sign-up-mgmt.all-login'),
                  checked: watch('useEmail') && watch('useOAuth'),
                  onChecked: (isChecked) => {
                    if (!isChecked) return;
                    setValue('useEmail', true, { shouldDirty: true });
                    setValue('useOAuth', true, { shouldDirty: true });
                  },
                },
              ]}
            />
            {watch('useOAuth') && <OAuthConfigForm />}
          </div>
          <div className="flex flex-col gap-4">
            <p className="input-label flex items-center gap-1">
              Sign Up Method
            </p>
            <RadioGroup
              name="isPrivate"
              radios={[
                {
                  label: t('main.setting.sign-up-mgmt.possibility'),
                  checked: !watch('isPrivate'),
                  onChecked: (isChecked) => {
                    if (!isChecked) return;
                    setValue('isPrivate', false, { shouldDirty: true });
                  },
                },
                {
                  label: t('main.setting.sign-up-mgmt.impossibility'),
                  checked: watch('isPrivate'),
                  onChecked: (isChecked) => {
                    if (!isChecked) return;
                    setValue('isPrivate', true, { shouldDirty: true });
                  },
                },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="input-label flex items-center gap-1">
              Email domain WhiteList
              <DescriptionTooltip
                description={t(
                  'main.setting.sign-up-mgmt.domain-restriction-tooltip',
                )}
              />
            </p>
            <RadioGroup
              name="isRestrictDomain"
              radios={[
                {
                  label: t('main.setting.sign-up-mgmt.no-domain-restriction'),
                  checked: !watch('isRestrictDomain'),
                  onChecked: () =>
                    setValue('isRestrictDomain', false, { shouldDirty: true }),
                },
                {
                  label: t('main.setting.sign-up-mgmt.domain-restriction'),
                  checked: watch('isRestrictDomain'),
                  onChecked: () =>
                    setValue('isRestrictDomain', true, { shouldDirty: true }),
                },
              ]}
            />
            {watch('isRestrictDomain') && (
              <div className="flex flex-col gap-2">
                <Input
                  value={currentDomain}
                  placeholder="@example.com"
                  onChange={(e) => {
                    if (domainState.isSubmitted && domainState.isValid) {
                      setDomainState({ isSubmitted: false, isValid: false });
                    }
                    setCurrentDomain(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onClickAdd();
                    }
                  }}
                  rightChildren={
                    <button
                      type="button"
                      className="btn btn-xs btn-rounded btn-primary"
                      onClick={onClickAdd}
                    >
                      {t('button.register')}
                    </button>
                  }
                  {...domainState}
                />
                <div className="flex flex-row flex-wrap gap-2">
                  {(watch('allowDomains') ?? []).map((domain, i) => (
                    <Badge
                      key={i}
                      type="secondary"
                      right={{ iconName: 'Close', onClick: onClickDelete(i) }}
                    >
                      @{domain}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </SettingMenuTemplate>
  );
};

export default AuthSetting;
