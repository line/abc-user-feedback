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
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Switch,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Card, CenterTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { PATH } from '@/constants/path';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion, useUser } from '@/hooks';

import { NextPageWithLayout } from '../_app';

interface IForm {
  siteName: string;
  isPrivate: boolean;
  isRestrictDomain: boolean;
  allowDomains: string[];
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  siteName: yup.string().required(),
  isPrivate: yup.boolean().required(),
  isRestrictDomain: yup.boolean().required(),
  allowDomains: yup.array().required(),
});
const defaultValues: IForm = {
  siteName: '',
  isPrivate: false,
  isRestrictDomain: false,
  allowDomains: [''],
};
const CreatePage: NextPageWithLayout = () => {
  const { t } = useTranslation();
  const { userStatus } = useUser();

  const router = useRouter();

  const toast = useToast(useToastDefaultOption);

  const { register, watch, setValue, getValues, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate, status } = useOAIMuataion({
    method: 'post',
    path: '/api/tenant',
  });

  useEffect(() => {
    if (userStatus === 'notLoggedIn') router.push(PATH.AUTH.SIGN_IN);
  }, [userStatus]);

  useEffect(() => {
    if (status === 'success') {
      toast({ title: 'success', status });
      router.push(PATH.AUTH.SIGN_IN);
    }
  }, [status]);

  const handleAddDomain = () => {
    setValue('allowDomains', getValues('allowDomains').concat(['']));
  };
  const handleRemoveDomain = (index: number) => () => {
    setValue(
      'allowDomains',
      getValues('allowDomains').filter((_, i) => i !== index),
    );
  };

  const onSubmit = (data: IForm) => {
    if (data.allowDomains) {
      if (!data.isRestrictDomain) data.allowDomains = [];
      else data.allowDomains = data.allowDomains.filter((v) => v !== '');
    }
    mutate(data);
  };

  return (
    <Center h="100vh">
      <Card sx={{ width: '100%', maxWidth: '400px', p: 2 }}>
        <Flex
          as="form"
          gap={4}
          flexDir="column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Heading mb="4" textAlign="center">
            {t('title.serviceSetting')}
          </Heading>
          <FormControl isRequired>
            <FormLabel>{t('input.placeholder.siteName')}</FormLabel>
            <Input type="text" {...register('siteName')} />
          </FormControl>
          <Switch w="100%" id="isPrivate" {...register('isPrivate')}>
            {t('input.caption.isPrivate')}
          </Switch>
          <Switch
            w="100%"
            id="isRestrictDomain"
            {...register('isRestrictDomain')}
          >
            {t('input.caption.isRestrictDomain')}
          </Switch>

          {watch('isRestrictDomain') && (
            <Flex flexDirection="column">
              <FormLabel>{t('input.caption.allowDomains')}</FormLabel>
              <VStack alignItems="baseline">
                {watch('allowDomains').map((_, i) => (
                  <HStack key={i} w="100%">
                    <Input {...register(`allowDomains.${i}`)} />
                    {i === watch('allowDomains').length - 1 ? (
                      <Button onClick={handleAddDomain}>
                        {t('button.add')}
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={handleRemoveDomain(i)}>
                        {t('button.delete')}
                      </Button>
                    )}
                  </HStack>
                ))}
              </VStack>
            </Flex>
          )}
          <Button type="submit" w="100%" disabled={status === 'loading'} mt={4}>
            {t('button.setting')}
          </Button>
        </Flex>
      </Card>
    </Center>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default CreatePage;
