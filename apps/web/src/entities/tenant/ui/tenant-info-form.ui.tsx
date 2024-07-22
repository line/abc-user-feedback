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

import { TextInput } from '@ufb/ui';

import type { TenantInfo } from '../tenant.type';

interface IProps {}

const TenantInfoForm: React.FC<IProps> = () => {
  const { register, formState } = useFormContext<TenantInfo>();

  return (
    <div className="flex flex-col gap-6">
      <TextInput {...register('id')} label="Project ID" disabled />
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
    </div>
  );
};

export default TenantInfoForm;
