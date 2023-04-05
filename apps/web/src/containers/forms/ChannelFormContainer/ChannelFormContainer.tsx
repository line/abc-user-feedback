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
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { Card } from '@/components';
import { RowTable } from '@/components/tables';
import { RESERVED_FIELD_NAMES } from '@/constants/reserved-field-name';
import { useToastDefaultOption } from '@/constants/toast-default-option';
import { FieldCreateModal, FieldModalFormType } from '@/containers/modals';
import { useOAIQuery } from '@/hooks';
import { FieldTypeEnumList, FieldTypeEnumType } from '@/types/field.type';

export namespace ChannelForm {
  export type FieldType = {
    id?: string;
    name: string;
    type: FieldTypeEnumType;
    isAdmin: boolean;
    isDisabled: boolean;
    order: number;
    description: string;
    options?: { id?: string; name: string }[];
  };

  export const fieldSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    type: z.enum(FieldTypeEnumList),
    isAdmin: z.boolean(),
    isDisabled: z.boolean(),
    order: z.number(),
    description: z.string(),
    options: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
        }),
      )
      .optional(),
  });

  export type FormType = z.infer<typeof schema>;

  export const schema = z.object({
    name: z.string(),
    description: z.string(),
    fields: z.array(fieldSchema).min(1),
  });
}

interface IProps extends React.PropsWithChildren {
  methods: UseFormReturn<ChannelForm.FormType, any>;
  onSubmit: (data: ChannelForm.FormType) => void;
  projectId: string;
  isModify?: boolean;
}

const ChannelFormContainer: React.FC<IProps> = (props) => {
  const { methods, onSubmit, projectId, isModify = false } = props;

  const { getValues, setValue, handleSubmit, register, watch, formState } =
    methods;

  const { errors } = formState;

  const { t } = useTranslation();

  const toast = useToast(useToastDefaultOption);

  const [isOpen, setIsOpen] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>();

  const { data: projectData } = useOAIQuery({
    path: '/api/projects/{id}',
    variables: { id: projectId! },
    queryOptions: { enabled: !!projectId },
  });

  useEffect(() => {
    const errorValues = Object.values(errors);
    if (errorValues.length === 0) return;
    errorValues.forEach((error) => {
      toast({ title: JSON.stringify(error), status: 'error' });
    });
  }, [errors]);

  const openOptionModalForAdding = () => {
    setIsOpen(true);
    setCurrentFieldIndex(undefined);
  };

  const openOptionModalForModifying = (index: number) => {
    setIsOpen(true);
    setCurrentFieldIndex(index);
  };

  const upsertField = (data: FieldModalFormType) => {
    const fields = getValues('fields');
    if (currentFieldIndex !== undefined) {
      setValue(
        'fields',
        fields.map((field, index) =>
          index === currentFieldIndex ? { ...data, order: field.order } : field,
        ),
      );
    } else {
      setValue('fields', fields.concat({ ...data, order: fields.length + 1 }));
    }
  };

  const removeField = (index: number) => {
    if (!confirm('필드 삭제시 되돌릴 수 없습니다.')) return;
    setValue(
      'fields',
      getValues('fields')
        .filter((_, fieldIndex) => fieldIndex !== index)
        .map((v, fieldIndex) => ({ ...v, order: fieldIndex + 1 })),
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column" gap={4}>
          <Card title={t('title.card.inputChannelInfo')}>
            <Flex flexDir="column" gap={4}>
              <Heading>프로젝트 정보</Heading>
              <Box>
                <Text>이름</Text>
                <Text>{projectData?.name}</Text>
              </Box>
              <Box>
                <Text>설명</Text>
                <Text>{projectData?.description}</Text>
              </Box>
              <Divider />
              <FormControl isRequired>
                <FormLabel>{t('input.label.channelTitle')}</FormLabel>
                <Input {...register('name')} />
              </FormControl>
              <FormControl>
                <FormLabel>{t('input.label.description')}</FormLabel>
                <Input {...register('description')} />
              </FormControl>
              <Flex justifyContent="space-between">
                <FormLabel>{t('input.label.feedbackField')}</FormLabel>
                <Button size="sm" onClick={openOptionModalForAdding}>
                  {t('button.add')}
                </Button>
              </Flex>
              <RowTable
                columns={[
                  {
                    title: t('order'),
                    dataIndex: 'order',
                    width: '80px',
                  },
                  {
                    title: t('fieldName'),
                    dataIndex: 'name',
                    render: (v, _, idx) => (
                      <Menu>
                        <MenuButton type="button">
                          {v}
                          {!RESERVED_FIELD_NAMES.includes(v) && (
                            <ChevronDownIcon />
                          )}
                        </MenuButton>
                        {!RESERVED_FIELD_NAMES.includes(v) && (
                          <MenuList>
                            <MenuItem onClick={() => removeField(idx)}>
                              {t('button.delete')}
                            </MenuItem>
                            <MenuItem
                              onClick={() => openOptionModalForModifying(idx)}
                            >
                              {t('button.modify')}
                            </MenuItem>
                          </MenuList>
                        )}
                      </Menu>
                    ),
                  },
                  { title: t('fieldType'), dataIndex: 'type' },
                  {
                    title: 'isAdmin',
                    dataIndex: 'isAdmin',
                    render: (v) => (v ? 'O' : 'X'),
                  },
                  {
                    title: 'isDisabled',
                    dataIndex: 'isDisabled',
                    render: (v) => (v ? 'O' : 'X'),
                  },
                  {
                    title: t('fieldOption'),
                    dataIndex: 'options',
                    render: (options: { name: string }[]) => (
                      <Flex gap={2}>
                        {options?.map(({ name }, idx) => (
                          <Tag key={idx} flexShrink={0}>
                            {name}
                          </Tag>
                        ))}
                      </Flex>
                    ),
                  },
                ]}
                data={watch('fields').sort((a, b) => a.order - b.order)}
              />
            </Flex>
          </Card>
          <Button type="submit" float="right">
            {isModify ? t('button.modify') : t('button.create')}
          </Button>
        </Flex>
      </form>
      <FieldCreateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        handleSave={upsertField}
        currentFieldIndex={currentFieldIndex}
        fields={watch('fields')}
      />
    </>
  );
};

const optionTextStyle = {
  bg: 'gray.300',
  borderRadius: 'lg',
  py: 1,
  px: 2,
  whiteSpace: 'nowrap',
};

export default ChannelFormContainer;
