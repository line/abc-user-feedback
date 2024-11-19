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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@ufb/react';

import { TextInput } from '@/shared';

import { createTenantFormSchema } from './create-tenant-form.schema';
import type { CreateTenant } from './create-tenant-form.type';

interface IProps {
  onSubmit: (data: CreateTenant) => void;
  submitText: string;
}

const CreateTenantForm: React.FC<IProps> = (props) => {
  const { onSubmit, submitText } = props;
  const { t } = useTranslation();

  const { register, handleSubmit, formState } = useForm<CreateTenant>({
    resolver: zodResolver(createTenantFormSchema),
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <TextInput
        label={t('tenant.create.site-name')}
        placeholder="Please enter the site name"
        {...register('siteName')}
      />

      <Button type="submit" disabled={!formState.isValid}>
        {submitText}
      </Button>
    </form>
  );
};

export default CreateTenantForm;
