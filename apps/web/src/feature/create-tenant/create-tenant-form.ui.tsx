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
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { Path } from '@/constants/path';
import { useTenantActions } from '@/entities/tenant';
import { useOAIMutation } from '@/hooks';

interface IProps {}

const CreateTenantForm: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { refetchTenant } = useTenantActions();
  const [siteName, setSiteName] = useState('');

  const { mutate: createTenant, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/tenants',
    queryOptions: {
      async onSuccess() {
        toast.positive({ title: 'Success' });
        toast.positive({
          title: 'create Default Super User',
          description: 'email: user@feedback.com \n password: 12345678',
        });
        router.replace(Path.SIGN_IN);
        await refetchTenant();
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-20-bold">{t('tenant.create.title')}</h1>
      <label>
        <span>{t('tenant.create.site-name')}</span>
        <input
          className="input"
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
      </label>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={isPending}
        onClick={() => createTenant({ siteName })}
      >
        {t('button.setting')}
      </button>
    </div>
  );
};

export default CreateTenantForm;
