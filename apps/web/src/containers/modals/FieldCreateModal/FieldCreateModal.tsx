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
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { z } from 'zod';

import { ChannelForm } from '@/containers/forms';
import { FieldTypeEnumList, FieldTypeEnumType } from '@/types/field.type';

import { OptionInput } from './inputs';

export type FieldModalFormType = Omit<ChannelForm.FieldType, 'order'>;

const fieldSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.string(),
  options: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      }),
    )
    .optional(),
  isDisabled: z.boolean(),
  isAdmin: z.boolean(),
  description: z.string(),
});

const defaultValues: FieldModalFormType = {
  name: '',
  type: 'text',
  isDisabled: false,
  isAdmin: false,
  description: '',
};

interface IProps extends React.PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  handleSave: (data: FieldModalFormType) => void;
  fields: ChannelForm.FieldType[];
  currentFieldIndex?: number;
}

const FieldCreateModal: React.FC<IProps> = (props) => {
  const { handleSave, isOpen, onClose, fields, currentFieldIndex } = props;

  const { t } = useTranslation();

  const {
    register,
    watch,
    getValues,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState,
    control,
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues,
  });
  const { errors } = formState;

  const [optionName, setOptionName] = useState('');

  useEffect(() => {
    reset(
      currentFieldIndex !== undefined
        ? fields[currentFieldIndex]
        : defaultValues,
    );
  }, [currentFieldIndex, fields]);

  const addOption = () => {
    const options = getValues('options') ?? [];
    if (!optionName || optionName.length === 0 || !options) return;

    if (options?.find(({ name }) => name === optionName)) return;
    setValue('options', options?.concat({ name: optionName }));

    setOptionName('');
  };

  const removeOption = (idx: number) => {
    const options = getValues('options');
    if (!options) return;
    setValue('options', options.slice(0, idx).concat(options.slice(idx + 1)));
  };

  const onSubmit = (data: FieldModalFormType) => {
    if (
      fields
        .filter((_, index) => index !== currentFieldIndex)
        .find(({ name }) => name === data.name)
    ) {
      setError('name', { message: 'This name is duplicated' });
      return;
    }

    const { name, description, isDisabled, options, isAdmin, type, id } = data;

    handleSave({
      name,
      isDisabled,
      isAdmin,
      type,
      description,
      id,
      ...(type === 'select' ? { options } : {}),
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('title.card.addField')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            as="form"
            flexDir="column"
            gap={4}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isRequired>
              <FormLabel>{t('fieldName')}</FormLabel>
              <Input {...register('name')} />
              {errors.name && (
                <FormHelperText color="red.500">
                  {errors.name.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>{t('fieldType')}</FormLabel>
              <ReactSelect
                instanceId="fieldType"
                isDisabled={!!getValues('id')}
                value={{ label: watch('type'), value: watch('type') }}
                onChange={(value) => value && setValue('type', value.value)}
                options={FieldTypeEnumList.map((v) => ({
                  label: v as FieldTypeEnumType,
                  value: v as FieldTypeEnumType,
                }))}
              />
            </FormControl>

            {watch('type') === 'select' && (
              <OptionInput
                addOption={addOption}
                setOptionName={setOptionName}
                optionName={optionName}
                options={watch('options') ?? []}
                removeOption={removeOption}
                modifyLabel={(index, label) =>
                  setValue(`options.${index}.name`, label)
                }
              />
            )}

            <FormControl>
              <FormLabel>{t('description')}</FormLabel>
              <Textarea rows={4} {...register('description')} />
            </FormControl>
            <FormControl>
              <FormLabel>{t('constraint')}</FormLabel>
              <Flex flexDir="column">
                <Controller
                  control={control}
                  name="isDisabled"
                  render={({ field }) => (
                    <Checkbox
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      isChecked={field.value}
                      onChange={field.onChange}
                    >
                      isDisabled
                    </Checkbox>
                  )}
                />
                <Controller
                  control={control}
                  name="isAdmin"
                  render={({ field }) => (
                    <Checkbox
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      isChecked={field.value}
                      onChange={field.onChange}
                    >
                      isAdmin
                    </Checkbox>
                  )}
                />
              </Flex>
            </FormControl>

            <Flex py={4} justifyContent="space-between">
              <Button variant="ghost" onClick={onClose}>
                {t('button.close')}
              </Button>
              <Button type="submit">{t('button.save')}</Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FieldCreateModal;
