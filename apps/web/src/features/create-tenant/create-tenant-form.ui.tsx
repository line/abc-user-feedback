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
    defaultValues: { siteName: '' },
  });

  return (
    <form
      className="flex h-full flex-col gap-4"
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <div className="flex flex-1 flex-col gap-4">
        <TextInput
          label="Name"
          placeholder={t('v2.placeholder.text')}
          {...register('siteName')}
        />
      </div>
      <Button type="submit" disabled={!formState.isDirty}>
        {submitText}
      </Button>
    </form>
  );
};

export default CreateTenantForm;
