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
import {
  Box,
  Divider,
  Flex,
  IconButton,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';

import { PATH } from '@/constants/path';
import { useUser } from '@/hooks';

interface IProps extends React.PropsWithChildren {}

const SideNav: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { pathname } = useRouter();

  const [isExpanded, setIsExpanded] = useState(true);

  const menu = useMemo(() => {
    const menu: { name: string; path: string }[] = [
      {
        name: t('menu.sideNav.projectManagement'),
        path: PATH.PROJECT_MANAGEMENT.LIST,
      },
    ];

    if (user?.permissions?.includes('user_management')) {
      menu.push({
        name: t('menu.sideNav.userManagement'),
        path: PATH.SETTING.USER,
      });
    }

    if (user?.permissions?.includes('role_management')) {
      menu.push({
        name: t('menu.sideNav.roleManamgenet'),
        path: PATH.SETTING.ROLE.LIST,
      });
    }

    if (user?.permissions?.includes('service_management')) {
      menu.push({
        name: t('menu.sideNav.serviceManagement'),
        path: PATH.SETTING.TENANT,
      });
    }

    return menu;
  }, [user, t]);

  return (
    <Box
      w={isExpanded ? '200px' : '40px'}
      transition="width .5s ease-in-out"
      flexShrink={0}
      bg="white"
      borderRightWidth={1}
    >
      <Flex justifyContent="flex-end">
        <IconButton
          m="4px"
          aria-label="menu expand and compress"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((v) => !v)}
          icon={
            isExpanded ? (
              <AiOutlineMenuFold size={20} color="gray" />
            ) : (
              <AiOutlineMenuUnfold size={20} color="gray" />
            )
          }
        />
      </Flex>
      <Box
        opacity={isExpanded ? '1' : '0'}
        transition="opacity .5s ease-in-out"
      >
        <Box sx={{ pb: '16px', px: '24px', borderBottomWidth: 1 }}>
          <Text fontSize="sm">{user?.email}</Text>
          <Divider my={4} />
          <Flex justifyContent="space-between">
            <Text fontSize="sm" color="gray.500">
              {t('myRole')}
            </Text>
            <Text fontSize="sm">{user?.roleName}</Text>
          </Flex>
        </Box>
        <List>
          {menu.map(({ name, path }, idx) => (
            <ListItem
              key={idx}
              sx={{
                _hover: {
                  bg: 'secondary',
                  cursor: 'pointer',
                  color: 'primary.400',
                },
                bg: pathname.includes(path) ? 'secondary' : 'transparent',
                color: pathname.includes(path) ? 'primary' : 'inherit',
              }}
            >
              <Link href={path}>
                <Text
                  display="block"
                  sx={{
                    fontSize: 'sm',
                    fontWeight: pathname.includes(path) ? 'bold' : '500',
                    p: '16px 24px',
                  }}
                >
                  {name}
                </Text>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default SideNav;
