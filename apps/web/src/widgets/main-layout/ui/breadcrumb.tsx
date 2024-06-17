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
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Icon } from '@ufb/ui';

import { useTenantStore } from '@/entities/tenant';

import { useOAIQuery } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const Breadcrumb: React.FC<IProps> = () => {
  const router = useRouter();
  const { tenant } = useTenantStore();

  const projectId = useMemo(() => {
    if (!router.query?.projectId) return -1;
    const id = +router.query?.projectId;
    if (isNaN(id)) return -1;
    return id;
  }, [router]);

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
    queryOptions: { enabled: projectId !== -1 },
  });

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-fill-tertiary inline-flex rounded-sm p-1.5">
          <Icon name="OfficeFill" size={12} className="text-secondary" />
        </div>
        <span className="font-12-regular">{tenant?.siteName}</span>
      </div>
      {data && (
        <>
          <Icon name="ChevronRight" size={12} />
          <div className="flex items-center gap-2">
            <div className="bg-fill-tertiary inline-flex rounded-sm p-1.5">
              <Icon
                name="CollectionFill"
                size={12}
                className="text-secondary"
              />
            </div>
            <span className="font-12-regular">{data?.name}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
