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
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { Card } from '@/components';
import { useUser } from '@/hooks';
import client from '@/libs/client';

export interface IProjectForm {
  name: string;
  description: string;
}
export const projectFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

interface IProps extends React.PropsWithChildren {
  methods: UseFormReturn<IProjectForm, any>;
  onSubmit: (data: IProjectForm) => void;
  isModify?: boolean;
}

const ProjectFormContainer: React.FC<IProps> = (props) => {
  const {
    methods: { register, handleSubmit },
    onSubmit,
    isModify = false,
  } = props;

  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card title={t('title.card.inputProjectInfo')}>
        <Flex flexDir="column" gap={4}>
          <FormControl isRequired>
            <FormLabel>{t('input.label.projectTitle')}</FormLabel>
            <Input {...register('name')} />
          </FormControl>
          <FormControl>
            <FormLabel>{t('input.label.description')}</FormLabel>
            <Input {...register('description')} />
          </FormControl>
        </Flex>
      </Card>
      <ButtonGroup justifyContent="flex-end" w="100%" mt={2}>
        <Button type="submit">
          {isModify ? t('button.modify') : t('button.create')}
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default ProjectFormContainer;
