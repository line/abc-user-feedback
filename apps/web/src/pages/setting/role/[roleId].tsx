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
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  Card,
  MainTemplate,
  OverlayLoading,
  TitleTemplate,
} from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';
import { PermissionList, PermissionType } from '@/types/permission.type';

interface IForm {
  name: string;
  permissions: PermissionType[];
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  name: yup.string().required(),
  permissions: yup.array().required(),
});

interface IProps {
  id: string;
  name: string;
  permissions: PermissionType[];
}

const RoleIdPage: NextPageWithLayout<IProps> = (props) => {
  const { name, permissions, id } = props;

  const { t } = useTranslation();

  const router = useRouter();

  const toast = useToast(useToastDefaultOption);

  const { register, setValue, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name, permissions } as IForm,
  });

  const { mutateAsync: updateRole, status } = useOAIMuataion({
    method: 'put',
    path: '/api/roles/{id}',
    pathParams: { id },
  });
  const { mutateAsync: deleteRole } = useOAIMuataion({
    method: 'delete',
    path: '/api/roles/{id}',
    pathParams: { id },
  });

  const handleChecked = (isChecked: boolean, permission: PermissionType) => {
    const permissions = watch('permissions');
    setValue(
      'permissions',
      isChecked
        ? permissions.concat(permission)
        : permissions.filter((v) => v !== permission),
    );
  };
  const onSubmit = async (data: IForm) => {
    try {
      await updateRole(data);
      toast({ title: 'Successfully modify role', status: 'success' });
      router.back();
    } catch (error: any) {
      toast({ title: error.code, description: error.message, status: 'error' });
    }
  };
  const handleDeleteRole = async () => {
    try {
      await deleteRole(undefined);
      toast({ title: 'Successfully delete role', status: 'success' });
      router.back();
    } catch (error: any) {
      toast({ title: error.code, description: error.message, status: 'error' });
    }
  };

  return (
    <>
      <OverlayLoading isLoading={status === 'loading'} />
      <TitleTemplate title={t('title.roleManagement')} showBackBtn>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card mb={4}>
            <Flex flexDir="column" gap={4}>
              <FormControl>
                <FormLabel>{t('roleName')}</FormLabel>
                <Input {...register('name')} />
              </FormControl>
              <Flex flexDir="column" gap={2}>
                <Text fontWeight={500}>{t('permission')}</Text>
                {PermissionList.map((permission, idx) => (
                  <Checkbox
                    key={idx}
                    disabled={name === 'owner'}
                    defaultChecked={permissions?.includes(permission)}
                    onChange={(v) =>
                      handleChecked(v.currentTarget.checked, permission)
                    }
                    size="sm"
                  >
                    {permission}
                  </Checkbox>
                ))}
              </Flex>
            </Flex>
            <Button
              w="100%"
              colorScheme="red"
              mt="16px"
              onClick={handleDeleteRole}
              disabled={name === 'owner'}
            >
              {t('button.delete')}
            </Button>
          </Card>
          <Flex justifyContent="flex-end">
            <Button
              type="submit"
              disabled={status === 'loading' || name === 'owner'}
            >
              {t('button.modify')}
            </Button>
          </Flex>
        </form>
      </TitleTemplate>
    </>
  );
};

RoleIdPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getServerSideProps: GetServerSideProps<
  IProps,
  { roleId: string }
> = async ({ locale, params }) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/api/roles/${params?.roleId}`,
  );

  const data = await response.json();
  if (response.status !== 200) {
    return { notFound: true };
  }

  return {
    props: {
      ...data,
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default RoleIdPage;
