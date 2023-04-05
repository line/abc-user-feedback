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
import { ChevronDownIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';

import { DataTable } from '@/components';
import { UserInvitationModal } from '@/containers/modals';
import { useOAIMuataion, useOAIQuery } from '@/hooks';
import client from '@/libs/client';

const LIMIT = 10;

interface IProps extends React.PropsWithChildren {}

const UserTable: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const toast = useToast({ position: 'top-right', isClosable: true });

  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const {
    data: userData,
    refetch,
    status,
  } = useOAIQuery({
    path: '/api/users',
    variables: {
      limit: LIMIT,
      page: currentPage,
      keyword,
    },
    queryOptions: { keepPreviousData: true },
  });

  const { data: roleData } = useOAIQuery({ path: '/api/roles' });
  const { mutate, status: deleteStatus } = useOAIMuataion({
    method: 'delete',
    path: '/api/users',
  });

  useEffect(() => {
    if (deleteStatus === 'success') {
      toast({ title: 'Successfully delete users', status: deleteStatus });
      refetch();
    }
  }, [deleteStatus]);

  const handleRoleChange = async (id: string, roleId: string) => {
    try {
      await client.put({
        path: '/api/users/{id}/role',
        pathParams: { id },
        body: { roleId },
      });

      toast({ title: 'Role change Success' });
      await refetch();
    } catch (error: any) {
      toast({ title: error.message, status: 'error' });
    }
  };

  const columns = useMemo(
    () => [
      { title: t('email'), dataIndex: 'email' },
      {
        title: t('text.authorization'),
        dataIndex: 'roleName',
        render: (roleName: string, row: any) => (
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton color="blue.500">
                  {roleName}
                  <ChevronDownIcon
                    transform={isOpen ? 'rotate(180deg)' : 'none'}
                  />
                </MenuButton>
                <MenuList>
                  {roleData?.roles
                    .filter((role) => role.name !== roleName)
                    .map(({ name, id: roleId }) => (
                      <MenuItem
                        key={roleId}
                        onClick={() => handleRoleChange(row.id, roleId)}
                      >
                        {name} {t('toChange')}
                      </MenuItem>
                    ))}
                </MenuList>
              </>
            )}
          </Menu>
        ),
      },
    ],
    [roleData, t],
  );
  const tableBar = useMemo(
    () => ({
      count: userData?.meta.totalItems,
      leftButtons: [
        {
          children: <DeleteIcon />,
          onClickCheckList: (ids: string[]) => mutate({ ids }),
        },
        {
          children: <RepeatIcon />,
          onClick: refetch,
        },
      ],
      searchInput: {
        placeholder: t('input.placeholder.email'),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.currentTarget.value),
      },
      rightButtons: [
        {
          onClick: () => setModalOpen(true),
          children: t('button.userInvitation'),
        },
      ],
    }),
    [userData, t],
  );
  if (!userData) return <Spinner />;

  return (
    <>
      <DataTable
        columns={columns}
        data={userData?.items ?? []}
        status={status}
        tableBar={tableBar}
        pagination={{
          onChangePage: (page) => setCurrentPage(page),
          meta: userData?.meta,
        }}
      />
      <UserInvitationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default UserTable;
