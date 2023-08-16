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
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { MainTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { Path } from '@/constants/path';
import { useOAIQuery, useProjects, useTenant } from '@/hooks';
import isNotEmptyStr from '@/utils/is-not-empty-string';

import { NextPageWithLayout } from '../_app';

const MainIndexPage: NextPageWithLayout = () => {
  const { tenant } = useTenant();

  const { data } = useProjects();

  return (
    <div className="mx-4 my-2">
      <h1 className="font-20-bold mb-4">Tenant</h1>
      <ul className="flex gap-2 flex-wrap">
        {tenant && <TenantList tenantId={tenant.id} />}
      </ul>
      <h1 className="font-20-bold my-6 mb-4">Project</h1>
      <ul className="flex gap-2 flex-wrap">
        {data?.items.map(({ id }) => (
          <ProjectList key={id} projectId={id} />
        ))}
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
        'border rounded p-8 border-fill-tertiary',
        type === 'project' ? 'hover:opacity-50 hover:cursor-pointer' : '',
      ].join(' ')}
      onClick={onClick}
    >
      <div className="flex gap-5 mb-10">
        <div
          className={[
            'w-10 h-10 rounded flex justify-center items-center',
            type === 'tenant' ? 'bg-[#5D7BE7]' : 'bg-[#48DECC]',
          ].join(' ')}
        >
          <Icon
            name={type === 'tenant' ? 'OfficeFill' : 'CollectionFill'}
            className="text-inverse"
            size={20}
          />
        </div>
        <div>
          <p className="font-16-bold mb-1">{name}</p>
          <p className="font-12-regular text-secondary w-[250px]">
            {isNotEmptyStr(description) ? description : '-'}
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
                ? 'animate-pulse bg-secondary w-15 h-7 rounded-sm'
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
                ? 'animate-pulse bg-secondary w-15 h-7 rounded-sm'
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
