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
import type { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import type { NextPageWithLayout } from '@/shared';
import { DEFAULT_LOCALE } from '@/shared';
import { ProjectGuard } from '@/entities/project';
import { CreateChannel } from '@/features/create-channel';

interface IProps {
  projectId: number;
}

const CreateChannelPage: NextPageWithLayout<IProps> = () => {
  return <CreateChannel />;
};

CreateChannelPage.getLayout = (page: React.ReactElement<IProps>) => {
  return <ProjectGuard projectId={page.props.projectId}>{page}</ProjectGuard>;
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const projectId = parseInt(query.projectId as string);

  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
      projectId,
    },
  };
};

export default CreateChannelPage;
