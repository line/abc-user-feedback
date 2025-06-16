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

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { create } from 'zustand';

import {
  Button,
  Icon,
  InputField,
  InputLabel,
  Switch,
  Textarea,
  toast,
} from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  SelectInput,
  SliderInput,
  TextInput,
  useOAIMutation,
  useOAIQuery,
} from '@/shared';
import type { AITemplate } from '@/entities/ai';

import type { AISettingStore } from '../ai-setting-form.type';

type InputItem = {
  title: string;
  description: string;
  value: string;
};

const useAITemplateFormStore = create<AISettingStore>((set) => ({
  formId: 'ai-template-form',
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));

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

export const AIFieldTemplateForm = ({ projectId }: { projectId: number }) => {
  const [inputItems, setInputItems] = useState<InputItem[]>([]);
  const { register, formState, setValue, watch, handleSubmit } =
    useForm<AITemplate>();
  const { formId, setIsPending, setIsDirty } = useAITemplateFormStore();

  const { data: modelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations/models',
    variables: { projectId },
  });
  console.log('modelData: ', modelData);

  const { mutate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/templates/new',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: () => {
        toast.success('AI 설정이 저장되었습니다.');
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty]);

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <Card className="flex-[1] border" size="md">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            템플릿 정보와 프롬프트를 설정해주세요
          </CardDescription>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <form
            id={formId}
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((data) => {
              mutate(data);
            })}
          >
            <TextInput label="Title" {...register('title')} />
            <InputField>
              <InputLabel>Prompt</InputLabel>
              <Textarea {...register('prompt')} />
            </InputField>
            <Card size="sm">
              <CardHeader
                action={
                  <Switch
                    checked={watch('autoProcessing')}
                    onCheckedChange={(checked) =>
                      setValue('autoProcessing', checked, { shouldDirty: true })
                    }
                  />
                }
              >
                <CardTitle>Auto Processing</CardTitle>
                <CardDescription>
                  자동으로 AI Prompt를 적용합니다.
                </CardDescription>
              </CardHeader>
            </Card>
            <div>
              <h4>Advanced Configuration</h4>
              <p>description</p>
              <SelectInput
                options={
                  modelData?.models.map(({ id }) => ({
                    value: id,
                    label: id,
                  })) ?? []
                }
                label="Model"
                placeholder="Select a model"
                onChange={(value) =>
                  setValue('model', value ?? '', { shouldDirty: true })
                }
                value={watch('model')}
              />
              <SliderInput
                label="Temperature"
                min={0}
                max={1}
                value={[watch('temperature')]}
                onValueChange={(value) => {
                  console.log('value: ', value);
                  setValue('temperature', value[0] ?? 0, { shouldDirty: true });
                }}
              />
            </div>
          </form>
        </CardBody>
      </Card>
      <AIPlaygroundContext.Provider
        value={{
          inputItems,
          createInputItem: (item) => setInputItems((prev) => [...prev, item]),
          updateInputItem: (index, item) =>
            setInputItems((prev) => {
              const newData = [...prev];
              newData[index] = item;
              return newData;
            }),
          deleteInputItem: (index) =>
            setInputItems((prev) => {
              const newData = [...prev];
              newData.splice(index, 1);
              return newData;
            }),
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
                        ...prev,
                        { title: '', description: '', value: '' },
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
                {/* {inputItems.map((_, key) => (
                  <AIPlaygroundInputDataItem key={key} index={key} />
                ))} */}
              </CardBody>
            </Card>
            <Card size="sm" className="flex-[1]">
              <CardHeader
                action={
                  <Button variant="outline">
                    <Icon name="RiSparklingFill" />
                    AI 테스트
                  </Button>
                }
              >
                <CardTitle>Output</CardTitle>
              </CardHeader>
            </Card>
          </CardBody>
        </Card>
      </AIPlaygroundContext.Provider>
    </div>
  );
};

export const AITemplateFormButton = () => {
  const { formId, isPending, isDirty } = useAITemplateFormStore();
  return (
    <Button form={formId} type="submit" loading={isPending} disabled={!isDirty}>
      저장
    </Button>
  );
};

const AIPlaygroundInputDataItem = ({ index }: { index: number }) => {
  const { inputItems, updateInputItem, deleteInputItem } =
    React.useContext(AIPlaygroundContext);
  const [isEditing, setIsEditing] = useState(true);
  const data = inputItems[index];

  if (!data) return;

  if (isEditing) {
    return (
      <AIPlaygroundInputDataItemForm
        initialValues={data}
        onClose={() => {
          if (data.title === '') {
            deleteInputItem(index);
          }
          setIsEditing(false);
        }}
        onSubmit={(data) => {
          updateInputItem(index, data);
          setIsEditing(false);
        }}
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
        <CardTitle>{data.title}</CardTitle>
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
    defaultValues: initialValues ?? { title: '', description: '', value: '' },
  });

  return (
    <Card size="sm">
      <CardBody>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit(onSubmit)}>
          <TextInput label="Field Title" {...register('title')} />
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
