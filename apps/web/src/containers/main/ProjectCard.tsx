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
import { useRouter } from 'next/router';

import { TenantProjectCard } from '@/components';
import { Path } from '@/constants/path';
import { useOAIQuery } from '@/hooks';

const ProjectCard: React.FC<{ projectId: number }> = ({ projectId }) => {
  const router = useRouter();

  const { data: project } = useOAIQuery({
    path: '/api/admin/projects/{projectId}',
    variables: { projectId },
  });

  const { data: feedbackCount } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/feedback-count',
    variables: { projectId },
  });

  const { data: channels } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId, limit: 1000 },
  });

  return (
    <TenantProjectCard
      type="project"
      name={project?.name ?? ''}
      description={project?.description}
      total={channels?.meta.totalItems}
      feedbackCount={feedbackCount?.total}
      onClick={() =>
        router.push({ pathname: Path.PROJECT_MAIN, query: { projectId } })
      }
    />
  );
};

export default ProjectCard;
