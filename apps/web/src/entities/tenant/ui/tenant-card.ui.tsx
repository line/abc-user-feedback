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
import { useTranslation } from 'react-i18next';

import MainCard from '@/shared/ui/main-card.ui';
import type { Tenant } from '@/entities/tenant';

import { useOAIQuery, useProjects } from '@/hooks';

interface IProps {
  tenant: Tenant;
}
const TenantCard: React.FC<IProps> = ({ tenant }) => {
  const { t } = useTranslation();
  const { data } = useProjects();

  const { data: feedbackCount } = useOAIQuery({
    path: '/api/admin/tenants/{tenantId}/feedback-count',
    variables: { tenantId: tenant.id },
  });

  return (
    <MainCard
      title={tenant.siteName}
      icon={{ bgColor: '#5D7BE7', iconName: 'OfficeFill' }}
      description={tenant.description}
      leftContent={{
        title: t('main.index.total-project'),
        count: data?.meta.totalItems ?? 0,
      }}
      rightContent={{
        title: t('main.index.total-feedback'),
        count: feedbackCount?.total ?? 0,
      }}
    />
  );
};

export default TenantCard;
