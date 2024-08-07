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
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { Path, useOAIQuery } from '@/shared';

interface IProps extends React.PropsWithChildren {
  projectId: number;
}

const ProjectGuard: React.FC<IProps> = ({ children, projectId }) => {
  const { data, status } = useOAIQuery({
    path: '/api/admin/projects',
    variables: { limit: 1000, page: 1 },
  });
  const router = useRouter();

  useEffect(() => {
    if (!data) return;
    const project = data.items.find((v) => v.id === projectId);
    if (!project) {
      alert('You do not have permission for this project');
      void router.replace(Path.MAIN);
    }
  }, [data]);

  if (status === 'pending') return <>Loading...</>;
  return children;
};

export default ProjectGuard;
