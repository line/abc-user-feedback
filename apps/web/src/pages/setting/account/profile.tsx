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
import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import {
  Card,
  MainTemplate,
  OverlayLoading,
  TitleTemplate,
} from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion, useUser } from '@/hooks';
import { IFetchError } from '@/types/fetch-error.type';

const ProfileSettingPage: NextPage = () => {
  const { t } = useTranslation();
  const { user, signOut } = useUser();
  const router = useRouter();
  const toast = useToast(useToastDefaultOption);

  const { mutateAsync, status } = useOAIMuataion({
    method: 'delete',
    path: '/api/users/{id}',
    pathParams: { id: user?.id ?? '' },
  });

  const onClickDelete = async () => {
    try {
      await mutateAsync(undefined);
      await signOut();
      toast({ title: 'Successfully delete user', status: 'success' });
      router.push(PATH.AUTH.SIGN_IN);
    } catch (error) {
      const { code, message } = error as IFetchError;
      toast({ title: message, description: code, status: 'error' });
    }
  };

  return (
    <MainTemplate>
      <OverlayLoading isLoading={status === 'loading'} />
      <TitleTemplate title={t('title.userSetting')}>
        <Card>
          <Flex flexDir="column" gap={2}>
            <Flex gap={2}>
              <Box borderRadius="lg" p={4} borderWidth={1} flex={1}>
                <Heading mb={2} size="sm" textTransform="capitalize">
                  {t('email')}
                </Heading>
                <Text>{user?.email}</Text>
              </Box>
              <Box flex={1} borderRadius="lg" p={4} borderWidth={1}>
                <Heading mb={2} size="sm" textTransform="capitalize">
                  {t('role')}
                </Heading>
                <Text>{user?.roleName}</Text>
              </Box>
            </Flex>
            <Flex>
              <Box flex={1} borderRadius="lg" p={4} borderWidth={1}>
                <Heading mb={2} size="sm" textTransform="capitalize">
                  {t('permission')}
                </Heading>
                <Text>{user?.permissions.join(', ')}</Text>
              </Box>
            </Flex>
            <Button mt={4} onClick={onClickDelete}>
              {t('button.deleteUser')}
            </Button>
          </Flex>
        </Card>
      </TitleTemplate>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default ProfileSettingPage;
