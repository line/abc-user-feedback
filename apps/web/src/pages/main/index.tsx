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
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ufb/ui';

import { CreateProjectButton, MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useUser } from '@/contexts/user.context';
import { useOAIQuery, useProjects, useTenant } from '@/hooks';
import { getDescriptionStr } from '@/utils/description-string';
import type { NextPageWithLayout } from '../_app';

const CARD_BORDER_CSS =
  'border-fill-tertiary h-[204px] w-[452px] rounded border';

const MainIndexPage: NextPageWithLayout = () => {
  const { tenant } = useTenant();
  const { data } = useProjects();
  const { user } = useUser();

  return (
    <div className="mx-4 my-2">
      <h1 className="font-20-bold mb-4">Tenant</h1>
      <ul className="flex flex-wrap gap-2">
        {tenant && <TenantList tenantId={tenant.id} />}
      </ul>
      <h1 className="font-20-bold my-6 mb-4">Project</h1>
      <ul className="flex flex-wrap gap-2">
        {data?.items.map(({ id }) => <ProjectList key={id} projectId={id} />)}
        {user?.type === 'SUPER' && (
          <div
            className={[
              CARD_BORDER_CSS,
              'flex flex-col items-center justify-center',
            ].join(' ')}
          >
            <CreateProjectButton hasProject={data?.meta.totalItems !== 0} />
          </div>
        )}
      </ul>
    </div>
  );
};

const TenantList: React.FC<{ tenantId: number }> = ({ tenantId }) => {
  const { tenant } = useTenant();
  const { data } = useProjects();

  const { data: feedbackCount } = useOAIQuery({
    path: '/api/tenants/{tenantId}/feedback-count',
    variables: { tenantId },
  });

  return (
    <CardItem
      type="tenant"
      name={tenant?.siteName ?? ''}
      description={tenant?.description}
      total={data?.meta.totalItems}
      feedbackCount={feedbackCount?.total}
    />
  );
};
const ProjectList: React.FC<{ projectId: number }> = ({ projectId }) => {
  const router = useRouter();

  const { data: project } = useOAIQuery({
    path: '/api/projects/{projectId}',
    variables: { projectId },
  });

  const { data: feedbackCount } = useOAIQuery({
    path: '/api/projects/{projectId}/feedback-count',
    variables: { projectId },
  });

  const { data: channels } = useOAIQuery({
    path: '/api/projects/{projectId}/channels',
    variables: { projectId, limit: 1000 },
  });

  return (
    <CardItem
      type="project"
      name={project?.name ?? ''}
      description={project?.description}
      total={channels?.meta.totalItems}
      feedbackCount={feedbackCount?.total}
      onClick={() =>
        router.push({ pathname: Path.FEEDBACK, query: { projectId } })
      }
    />
  );
};

interface IProps {
  name: string;
  description?: string | null;
  type: 'tenant' | 'project';
  total?: number;
  feedbackCount?: number;
  onClick?: () => void;
}

const CardItem: React.FC<IProps> = ({
  name,
  type,
  description,
  feedbackCount,
  total,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <li
      className={[
        CARD_BORDER_CSS,
        'p-8',
        type === 'project' ? 'hover:cursor-pointer hover:opacity-50' : '',
      ].join(' ')}
      onClick={onClick}
    >
      <div className="mb-10 flex gap-5">
        <div
          className={[
            'flex h-10 w-10 items-center justify-center rounded',
            type === 'tenant' ? 'bg-[#5D7BE7]' : 'bg-[#48DECC]',
          ].join(' ')}
        >
          <Icon
            name={type === 'tenant' ? 'OfficeFill' : 'CollectionFill'}
            className="text-inverse"
            size={20}
          />
        </div>
        <div className="flex-1">
          <p className="font-16-bold mb-1">{name}</p>
          <p className="font-12-regular text-secondary line-clamp-1 break-all">
            {getDescriptionStr(description)}
          </p>
        </div>
      </div>
      <div className="flex gap-16">
        <div>
          <p className="font-12-regular mb-1">
            {type === 'tenant'
              ? t('main.index.total-project')
              : t('main.index.total-channel')}
          </p>
          <p
            className={[
              'font-24-bold',
              typeof total === 'undefined'
                ? 'bg-secondary w-15 h-7 animate-pulse rounded-sm'
                : '',
            ].join(' ')}
          >
            {total?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="font-12-regular mb-1">
            {t('main.index.total-feedback')}
          </p>
          <p
            className={[
              'font-24-bold',
              typeof feedbackCount === 'undefined'
                ? 'bg-secondary w-15 h-7 animate-pulse rounded-sm'
                : '',
            ].join(' ')}
          >
            {feedbackCount?.toLocaleString()}
          </p>
        </div>
      </div>
    </li>
  );
};

MainIndexPage.getLayout = (page) => {
  return <MainTemplate>{page}</MainTemplate>;
};
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default MainIndexPage;
