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
import { Icon } from '@ufb/ui';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useOAIQuery, useTenant } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const HeaderName: React.FC<IProps> = () => {
  const router = useRouter();
  const { tenant } = useTenant();

  const projectId = useMemo(() => {
    if (!router.query?.projectId) return -1;
    const id = +router.query?.projectId;
    if (isNaN(id)) return -1;
    return id;
  }, [router]);

  const { data } = useOAIQuery({
    path: '/api/projects/{projectId}',
    variables: { projectId },
    queryOptions: { enabled: projectId !== -1 },
  });

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="bg-fill-tertiary rounded-sm p-1.5 inline-flex">
          <Icon name="OfficeFill" size={12} className="text-secondary" />
        </div>
        <span className="font-12-regular">{tenant?.siteName}</span>
      </div>
      {data && (
        <div className="flex items-center gap-2">
          <div className="bg-fill-tertiary rounded-sm p-1.5 inline-flex">
            <Icon name="CollectionFill" size={12} className="text-secondary" />
          </div>
          <span className="font-12-regular">{data?.name}</span>
        </div>
      )}
    </>
  );
};

export default HeaderName;
