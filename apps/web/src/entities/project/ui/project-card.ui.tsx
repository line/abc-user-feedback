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
import { useTranslation } from 'react-i18next';

import { Path, useOAIQuery } from '@/shared';
import { MainCard } from '@/shared/ui';

import type { Project } from '../project.type';

interface IProps {
  project: Project;
}

const ProjectCard: React.FC<IProps> = ({ project }) => {
  const router = useRouter();

  const { t } = useTranslation();

  const { data: channels } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId: project.id, limit: 0 },
  });

  const { data: feedbackCount } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/feedback-count',
    variables: { projectId: project.id },
  });

  return (
    <MainCard
      title={project.name}
      icon={{ bgColor: '#48DECC', iconName: 'CollectionFill' }}
      description={project.description}
      leftContent={{
        title: t('main.index.total-channel'),
        count: channels?.meta.totalItems ?? 0,
      }}
      rightContent={{
        title: t('main.index.total-feedback'),
        count: feedbackCount?.total ?? 0,
      }}
      onClick={() =>
        router.push({
          pathname: Path.PROJECT_MAIN,
          query: { projectId: project.id },
        })
      }
    />
  );
};

export default ProjectCard;
