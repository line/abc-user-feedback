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

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextInput } from '@/shared';

import type { TenantInfo } from '../tenant.type';

interface IProps {}

const TenantInfoForm: React.FC<IProps> = () => {
  const { register, formState } = useFormContext<TenantInfo>();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <TextInput {...register('id')} label="Tenant ID" disabled />
      <TextInput
        {...register('siteName')}
        label="Name"
        placeholder={t('placeholder', { name: 'Tenant Name' })}
        error={formState.errors.siteName?.message}
        required
      />
      <TextInput
        {...register('description')}
        label="Description"
        placeholder={t('placeholder', { name: 'Description' })}
        error={formState.errors.siteName?.message}
      />
    </div>
  );
};

export default TenantInfoForm;
