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
import { Flex } from '@chakra-ui/react';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement } from 'react';

import { MainTemplate, TitleTemplate } from '@/components';

import { NextPageWithLayout } from '../_app';

interface IProps {}

const DashboardPage: NextPageWithLayout<IProps> = () => {
  return (
    <TitleTemplate title="대쉬보드">
      <Flex flexDir="column" gap={4}>
        <Flex gap={4} alignItems="stretch">
          hi
        </Flex>
      </Flex>
    </TitleTemplate>
  );
};

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return { props: await serverSideTranslations(locale ?? 'en') };
};

export default DashboardPage;
