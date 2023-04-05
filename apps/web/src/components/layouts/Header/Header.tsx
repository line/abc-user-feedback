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
import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { INIT_PATH, PATH } from '@/constants/path';
import { useOAIQuery } from '@/hooks';

import UserMenu from './UserMenu';

interface IProps {}

const Header: React.FC<IProps> = () => {
  const router = useRouter();
  const { data } = useOAIQuery({
    path: '/api/tenant',
    queryOptions: {
      retry: false,
      onError: () => router.replace(PATH.TENANT_INITIAL_SETTING),
    },
  });

  return (
    <Box h="60px" borderBottomWidth={1} bg="white">
      <Flex justifyContent="space-between" h="100%" px="16px">
        <Link
          href={INIT_PATH}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image
            src="/assets/logo.svg"
            sx={{ w: '36px', h: '36px', mr: 2 }}
            alt="logo"
          />
          <Heading>User Feedback - {data?.siteName}</Heading>
        </Link>
        <Flex>
          <UserMenu />
          {/* <LocaleMenu /> */}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
