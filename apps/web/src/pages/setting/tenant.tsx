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
  FormLabel,
  HStack,
  Input,
  Switch,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ReactElement, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Card, FormSelect, MainTemplate, TitleTemplate } from '@/components';
import { DEFAULT_LOCALE } from '@/constants/i18n';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion, useOAIQuery } from '@/hooks';

import { NextPageWithLayout } from '../_app';

interface IForm {
  siteName: string;
  defaultRole: { label: string; value: string };
  isPrivate: boolean;
  isRestrictDomain: boolean;
  allowDomains: string[];
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  siteName: yup.string().required(),
  defaultRole: yup
    .object()
    .shape({ label: yup.string().required(), value: yup.string().required() })
    .required(),
  isPrivate: yup.boolean().required(),
  isRestrictDomain: yup.boolean().required(),
  allowDomains: yup.array().required(),
});

const defaultValues: IForm = {
  allowDomains: [''],
  isPrivate: false,
  isRestrictDomain: false,
  siteName: '',
  defaultRole: { label: 'Select', value: '' },
};

const TenantPage: NextPageWithLayout = () => {
  const { t } = useTranslation();

  const toast = useToast(useToastDefaultOption);

  const { register, watch, setValue, getValues, control, reset, handleSubmit } =
    useForm({ resolver: yupResolver(schema), defaultValues });

  const {
    data: tenantData,
    status,
    refetch,
  } = useOAIQuery({ path: '/api/tenant' });

  const { data: roleData } = useOAIQuery({ path: '/api/roles' });

  const { mutateAsync } = useOAIMuataion({
    method: 'put',
    path: '/api/tenant',
  });

  useEffect(() => {
    if (status === 'success') {
      const { allowDomains, defaultRole } = tenantData;
      reset({
        ...tenantData,
        allowDomains: allowDomains.length === 0 ? [''] : allowDomains,
        defaultRole: { label: defaultRole.name, value: defaultRole.id },
      });
    }
  }, [status]);

  const handleAddDomain = () => {
    setValue('allowDomains', watch('allowDomains').concat(['']));
  };
  const handleRemoveDomain = (index: number) => {
    const allowDomains = getValues('allowDomains');
    allowDomains.splice(index, 1);
    setValue('allowDomains', allowDomains);
  };

  const onSubmit = async (data: IForm) => {
    if (!tenantData) return;
    if (data.allowDomains) {
      if (!data.isRestrictDomain) data.allowDomains = [];
      else data.allowDomains = data.allowDomains.filter((v) => v !== '');
    }

    const { defaultRole, ...restData } = data;

    try {
      await mutateAsync({
        ...restData,
        id: tenantData.id,
        defaultRole: { id: data.defaultRole.value },
      });
      refetch();
      toast({ title: 'success', status: 'success' });
    } catch (error: any) {
      toast({ title: error.message, status: 'error' });
    }
  };

  return (
    <TitleTemplate title={t('title.serviceSetting') ?? ''}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <VStack spacing={8}>
            <FormControl isRequired>
              <FormLabel>{t('input.label.siteName')}</FormLabel>
              <Input {...register('siteName')} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="isPrivate">
                {t('input.label.isPrivate')}
              </FormLabel>
              <Switch w="100%" id="isPrivate" {...register('isPrivate')} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="isRestrictDomain">
                {t('input.label.isRestrictDomain')}
              </FormLabel>
              <Switch id="isRestrictDomain" {...register('isRestrictDomain')} />
            </FormControl>
            {watch('isRestrictDomain') && (
              <FormControl>
                <FormLabel size="md">{t('input.label.allowDomains')}</FormLabel>
                <VStack alignItems="baseline">
                  {watch('allowDomains').map((_, i) => (
                    <HStack key={i}>
                      <Input {...register(`allowDomains.${i}`)} />
                      {i === watch('allowDomains').length - 1 ? (
                        <Button onClick={handleAddDomain}>
                          {t('button.add')}
                        </Button>
                      ) : (
                        <Button onClick={() => handleRemoveDomain(i)}>
                          {t('button.delete')}
                        </Button>
                      )}
                    </HStack>
                  ))}
                </VStack>
              </FormControl>
            )}
            <FormControl>
              <FormSelect
                name="defaultRole"
                control={control}
                label={t('input.label.defaultRole')}
                options={roleData?.roles.map(({ id, name }) => ({
                  label: name,
                  value: id,
                }))}
              />
            </FormControl>
          </VStack>
        </Card>
        <Flex justifyContent="flex-end">
          <Button type="submit" disabled={status === 'loading'}>
            {t('button.modify')}
          </Button>
        </Flex>
      </form>
    </TitleTemplate>
  );
};

TenantPage.getLayout = function getLayout(page: ReactElement) {
  return <MainTemplate>{page}</MainTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? DEFAULT_LOCALE)),
    },
  };
};

export default TenantPage;
