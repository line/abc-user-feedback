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

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { Button, Icon, toast } from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  TextInput,
  useOAIMutation,
} from '@/shared';
import type { AITemplate } from '@/entities/ai';

type InputItem = {
  name: string;
  description: string;
  value: string;
  isEditing?: boolean;
};

const AIPlaygroundContext = React.createContext<{
  inputItems: InputItem[];
  createInputItem: (item: InputItem) => void;
  updateInputItem: (index: number, item: InputItem) => void;
  deleteInputItem: (index: number) => void;
}>({
  inputItems: [],
  createInputItem: () => 0,
  updateInputItem: () => 0,
  deleteInputItem: () => 0,
});

interface Props {
  projectId: number;
}

const AiFieldPlayground = ({ projectId }: Props) => {
  const [inputItems, setInputItems] = useState<InputItem[]>([]);
  const [result, setResult] = useState('');
  const { getValues } = useFormContext<AITemplate>();
  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/playground/test',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: (data) => {
        setResult(data?.result ?? '');
      },
      onError: (error) => {
        toast.error(`AI 테스트 중 오류가 발생했습니다: ${error.message}`);
      },
    },
  });
  const onTestAI = () => {
    if (inputItems.length === 0) {
      alert('테스트 케이스를 추가해주세요.');
      return;
    }
    const { model, temperature, prompt } = getValues();
    mutate({
      model,
      temperature,
      templatePrompt: prompt,
      temporaryFields: inputItems,
    });
  };

  return (
    <AIPlaygroundContext.Provider
      value={{
        inputItems,
        createInputItem: (item) => setInputItems((prev) => [...prev, item]),
        updateInputItem: (index, item) =>
          setInputItems((prev) =>
            prev.map((prevItem, i) => (i === index ? item : prevItem)),
          ),
        deleteInputItem: (index) =>
          setInputItems((prev) => prev.filter((_, i) => i !== index)),
      }}
    >
      <Card
        className="last-of-type: flex h-full flex-[2] flex-col border"
        size="md"
      >
        <CardHeader>
          <CardTitle>Playground</CardTitle>
          <CardDescription>
            테스트 데이터와 템플릿 가지고 AI 결과를 미리 확인해 보세요.
          </CardDescription>
        </CardHeader>
        <CardBody className="flex min-h-0 flex-1 flex-col gap-4">
          <Card size="sm" className="flex min-h-0 flex-[2] flex-col">
            <CardHeader
              action={
                <Button
                  variant="outline"
                  onClick={() =>
                    setInputItems((prev) => [
                      { name: '', description: '', value: '', isEditing: true },
                      ...prev,
                    ])
                  }
                >
                  <Icon name="RiAddLine" />
                  테스트 케이스 추가
                </Button>
              }
            >
              <CardTitle>Input Data</CardTitle>
            </CardHeader>
            <CardBody className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
              {inputItems.map((_, key) => (
                <AIPlaygroundInputDataItem key={key} index={key} />
              ))}
            </CardBody>
          </Card>
          <Card size="sm" className="flex-[1]">
            <CardHeader
              action={
                <Button
                  variant="outline"
                  onClick={onTestAI}
                  loading={isPending}
                >
                  <Icon name="RiSparklingFill" />
                  AI 테스트
                </Button>
              }
            >
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="bg-neutral-tertiary rounded-8 overflow-auto p-3">
                <p className="text-small-normal text-neutral-secondary">
                  {result}
                </p>
              </div>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </AIPlaygroundContext.Provider>
  );
};

const AIPlaygroundInputDataItemForm = ({
  onSubmit,
  onClose,
  initialValues,
}: {
  onSubmit: (input: InputItem) => void;
  onClose: () => void;
  initialValues?: InputItem;
}) => {
  const { register, handleSubmit, reset } = useForm<InputItem>({
    defaultValues: initialValues ?? { name: '', description: '', value: '' },
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, 'Field title is required'),
        description: z.string(),
        value: z.string().min(1, 'Field value is required'),
      }),
    ),
  });

  return (
    <Card size="sm">
      <CardBody>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Field Title" {...register('name')} />
          <TextInput label="Field Description" {...register('description')} />
          <TextInput label="Field Value" {...register('value')} />
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

const AIPlaygroundInputDataItem = ({ index }: { index: number }) => {
  const { inputItems, updateInputItem, deleteInputItem } =
    React.useContext(AIPlaygroundContext);
  const data = inputItems[index];

  const setIsEditing = (isEditing: boolean) => {
    if (!data) return;
    updateInputItem(index, { ...data, isEditing });
  };

  if (!data) return;
  if (data.isEditing) {
    return (
      <AIPlaygroundInputDataItemForm
        initialValues={data}
        onClose={() => {
          if (data.name === '') {
            deleteInputItem(index);
          }
        }}
        onSubmit={(data) =>
          updateInputItem(index, { ...data, isEditing: false })
        }
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
            <Button onClick={() => deleteInputItem(index)} variant="outline">
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

export default AiFieldPlayground;
