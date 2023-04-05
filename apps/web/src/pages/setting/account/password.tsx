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
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Card, MainTemplate, TitleTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { useOAIMuataion } from '@/hooks';

interface IForm {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  password: yup.string().required(),
  newPassword: yup
    .string()
    .required()
    .notOneOf([yup.ref('password')], 'Not equals password to newPassword '),
  confirmNewPassword: yup
    .string()
    .required()
    .oneOf(
      [yup.ref('newPassword')],
      'Not equals newPassword to confirmNewPassword ',
    ),
});

const defaultValues: IForm = {
  password: '',
  newPassword: '',
  confirmNewPassword: '',
};

const ProfileSettingPage: NextPage = () => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const toast = useToast({ position: 'top-right', isClosable: true });

  const { mutate, status, error } = useOAIMuataion({
    method: 'post',
    path: '/api/users/password/change',
  });
  useEffect(() => {
    if (status === 'success') {
      toast({ title: 'password change success', status });
      reset();
    } else if (status === 'error') {
      toast({ title: error.message, description: error.code, status });
    }
  }, [status]);

  const onSubmit = ({ password, newPassword }: IForm) =>
    mutate({ password, newPassword });

  return (
    <MainTemplate>
      <TitleTemplate title={t('title.changePassword')}>
        <Card>
          <Flex
            flexDir="column"
            gap={4}
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isRequired>
              <FormLabel>{t('currentPassword')}</FormLabel>
              <Input
                type="password"
                {...register('password')}
                isInvalid={!!formState.errors['password']}
              />
              {formState.errors['password'] && (
                <FormHelperText>
                  {formState.errors['password'].message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t('newPassword')}</FormLabel>
              <Input
                type="password"
                {...register('newPassword')}
                isInvalid={!!formState.errors['newPassword']}
              />
              {formState.errors['newPassword'] && (
                <FormHelperText color="red.300">
                  {formState.errors['newPassword'].message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{t('confirmNewPassword')}</FormLabel>
              <Input
                type="password"
                {...register('confirmNewPassword')}
                isInvalid={!!formState.errors['confirmNewPassword']}
              />
              {formState.errors['confirmNewPassword'] && (
                <FormHelperText color="red.500">
                  {formState.errors['confirmNewPassword'].message}
                </FormHelperText>
              )}
            </FormControl>
            <Button type="submit" mt={4}>
              {t('button.save')}
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
