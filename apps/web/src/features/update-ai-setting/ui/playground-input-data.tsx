/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import React, { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { Button, Icon } from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  TextInput,
} from '@/shared';

import { useAIPlayground } from '../contexts/ai-playground-context';
import type { PlaygroundInputItem } from '../playground-input-item.schema';
import { playgroundInputItemSchema } from '../playground-input-item.schema';

interface AIPlaygroundInputDataItemFormProps {
  onSubmit: (input: PlaygroundInputItem) => void;
  onClose: () => void;
  initialValues?: PlaygroundInputItem;
  index: number;
}

const PlaygroundInputDataItem = ({
  onSubmit,
  onClose,
  initialValues,
  index,
}: AIPlaygroundInputDataItemFormProps) => {
  const { t } = useTranslation();
  const { inputItems } = useAIPlayground();
  const { register, handleSubmit, reset, formState, setError } =
    useForm<PlaygroundInputItem>({
      defaultValues: initialValues ?? { name: '', description: '', value: '' },
      resolver: zodResolver(playgroundInputItemSchema),
    });

  const handleFormSubmit = handleSubmit((data) => {
    if (inputItems.some((item, i) => item.name === data.name && i !== index)) {
      setError('name', {
        type: 'manual',
        message: 'A data item with this name already exists.',
      });
      return;
    }
    onSubmit(data);
  });

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Card size="sm">
      <CardBody>
        <form className="flex flex-col gap-1" onSubmit={handleFormSubmit}>
          <TextInput
            label="Field Name"
            {...register('name')}
            required
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.name?.message}
          />
          <TextInput
            label="Field Description"
            {...register('description')}
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.description?.message}
          />
          <TextInput
            label="Field Value"
            {...register('value')}
            required
            placeholder={t('v2.placeholder.text')}
            error={formState.errors.value?.message}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={!formState.isDirty}>
              Confirm
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

interface PlaygroundInputDataProps {
  index: number;
}

const PlaygroundInputData = ({ index }: PlaygroundInputDataProps) => {
  const { inputItems, updateInputItem, deleteInputItem } = useAIPlayground();
  const data = inputItems[index];

  const setIsEditing = useCallback(
    (isEditing: boolean) => {
      if (!data) return;
      updateInputItem(index, { ...data, isEditing });
    },
    [data, index, updateInputItem],
  );

  const handleClose = useCallback(() => {
    if (data?.name === '') {
      deleteInputItem(index);
    }
  }, [data?.name, deleteInputItem, index]);

  const handleSubmit = useCallback(
    (newData: PlaygroundInputItem) => {
      updateInputItem(index, { ...newData, isEditing: false });
    },
    [index, updateInputItem],
  );

  const handleDelete = useCallback(() => {
    deleteInputItem(index);
  }, [deleteInputItem, index]);

  if (!data) return null;

  if (data.isEditing) {
    return (
      <PlaygroundInputDataItem
        initialValues={data}
        onClose={handleClose}
        onSubmit={handleSubmit}
        index={index}
      />
    );
  }

  return (
    <Card size="sm">
      <CardHeader
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Icon name="RiEditBoxLine" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="!text-tint-red"
            >
              <Icon name="RiDeleteBinLine" />
            </Button>
          </div>
        }
      >
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardBody>
        <div className="bg-neutral-tertiary rounded-8 max-h-16 overflow-auto p-3">
          <p className="text-small-normal text-neutral-secondary">
            {data.value}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default PlaygroundInputData;
