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
import { TenantProjectCard } from '@/components';
import { useTenant } from '@/contexts/tenant.context';
import { useOAIQuery, useProjects } from '@/hooks';

const TenantCardWrapper: React.FC = () => {
  const { tenant } = useTenant();

  if (!tenant) return null;

  return <TenantCard tenantId={tenant?.id} />;
};
const TenantCard: React.FC<{ tenantId: number }> = ({ tenantId }) => {
  const { tenant } = useTenant();
  const { data } = useProjects();

  const { data: feedbackCount } = useOAIQuery({
    path: '/api/tenants/{tenantId}/feedback-count',
    variables: { tenantId },
  });

  return (
    <TenantProjectCard
      type="tenant"
      name={tenant?.siteName ?? ''}
      description={tenant?.description}
      total={data?.meta.totalItems}
      feedbackCount={feedbackCount?.total}
    />
  );
};

export default TenantCardWrapper;
