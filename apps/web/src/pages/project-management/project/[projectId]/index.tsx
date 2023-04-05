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
import { EditIcon } from '@chakra-ui/icons';
import { Divider, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { ReactElement } from 'react';

import { Card, MainTemplate, TitleTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import ChannelTable from '@/containers/tables/ChannelTable';
import { NextPageWithLayout } from '@/pages/_app';

interface IProps extends React.PropsWithChildren {
  projectId: string;
  name: string;
  description: string;
}

const ProjectIdPage: NextPageWithLayout<IProps> = (props) => {
  const { projectId, name, description } = props;
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <TitleTemplate
      title={`${t('title.projectManagement')} | ${name} `}
      showBackBtn
    >
      <VStack spacing={4}>
        <Card
          title={t('title.card.projectInfo')}
          w="100%"
          actionChildren={
            <IconButton
              aria-label="modify"
              variant="outline"
              icon={<EditIcon />}
              onClick={() =>
                router.push({
                  pathname: PATH.PROJECT_MANAGEMENT.PROJECT.MODIFY,
                  query: { projectId },
                })
              }
            />
          }
        >
          <VStack spacing={2} alignItems="flex-start">
            <Heading>{name}</Heading>
            <Divider />
            <Text fontWeight="medium">{t('description')}</Text>
            <Text>{description}</Text>
            <Divider />
          </VStack>
        </Card>
        <Card title={t('text.channeList')}>
          <ChannelTable projectId={projectId} />
        </Card>
      </VStack>
    </TitleTemplate>
  );
};
// NextPageWithLayout
ProjectIdPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<
  IProps,
  { projectId: string }
> = async ({ params, locale }) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/projects/${params?.projectId}`,
    { method: 'get' },
  );

  const data = await response.json();
  if (response.status !== 200) {
    return { notFound: true };
  }

  const { id, name, description } = data;

  return {
    props: {
      projectId: id,
      name,
      description,
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default ProjectIdPage;
