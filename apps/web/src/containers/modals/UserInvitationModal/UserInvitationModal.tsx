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
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { FormSelect } from '@/components';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { useOAIMuataion, useOAIQuery } from '@/hooks';

interface IForm {
  email: string;
  role: { label: string; value: string };
}

const schema: yup.SchemaOf<IForm> = yup.object().shape({
  email: yup.string().email().required(),
  role: yup
    .object()
    .shape({ label: yup.string().required(), value: yup.string().required() })
    .required(),
});
const defaultValues: IForm = {
  email: '',
  role: { label: 'select', value: '' },
};
interface IProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

const UserInvitationModal: React.FC<IProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const { data: roleData } = useOAIQuery({ path: '/api/roles' });
  const { data: serviceData } = useOAIQuery({ path: '/api/tenant' });
  const toast = useToast(useToastDefaultOption);

  const { register, control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { mutate, status } = useOAIMuataion({
    method: 'post',
    path: '/api/users/invite',
  });

  useEffect(() => {
    if (!serviceData) return;
    const { id, name } = serviceData.defaultRole;
    setValue('role', { label: name, value: id });
  }, [serviceData]);

  useEffect(() => {
    if (status === 'success') {
      toast({ title: 'User invitation success', status });
      onClose();
    }
  }, [status]);

  const onSubmit = ({ email, role }: IForm) => {
    mutate({ email, roleId: role.value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{t('title.userInvitation')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>{t('email')}</FormLabel>
                <Input type="email" {...register('email')} placeholder=" " />
              </FormControl>
              <FormControl isRequired>
                <FormSelect
                  name="role"
                  control={control}
                  label={t('role')}
                  options={roleData?.roles.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))}
                />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t('button.close')}
            </Button>
            <Button type="submit">{t('button.invite')}</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UserInvitationModal;
