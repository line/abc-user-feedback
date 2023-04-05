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
  Heading,
  Input,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Card, MainTemplate, TitleTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
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

const defaultValues: IForm = {
  name: '',
  permissions: [],
};

const RoleIdPage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { register, watch, setValue, getValues, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate, status } = useOAIMuataion({
    method: 'post',
    path: '/api/roles',
  });

  useEffect(() => {
    if (status === 'success') router.back();
  }, [status]);

  const handleChecked = (isChecked: boolean, permission: PermissionType) => {
    const permissions = getValues('permissions');
    permissions.concat(permission);
    if (isChecked) setValue('permissions', permissions.concat(permission));
    else {
      const index = permission.indexOf(permission);
      permissions.splice(index, 1);
      setValue('permissions', permissions);
    }
  };
  const onSubmit = (data: IForm) => mutate(data);

  return (
    <TitleTemplate title={t('title.roleManagement')}>
      <Card>
        <Flex
          as="form"
          flexDir="column"
          gap={4}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl>
            <FormLabel>
              <Heading>{t('roleName')}</Heading>
            </FormLabel>
            <Input {...register('name')} />
          </FormControl>
          <Flex flexDir="column" gap={2}>
            <Heading>{t('permission')}</Heading>
            {PermissionList.map((permission, index) => (
              <Checkbox
                key={index}
                checked={watch('permissions').includes(permission)}
                onChange={(v) =>
                  handleChecked(v.currentTarget.checked, permission)
                }
              >
                {permission}
              </Checkbox>
            ))}
          </Flex>
          <Flex justifyContent="spa"></Flex>
          <Button type="submit" disabled={status === 'loading'}>
            {t('button.create')}
          </Button>
        </Flex>
      </Card>
    </TitleTemplate>
  );
};

RoleIdPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default RoleIdPage;
