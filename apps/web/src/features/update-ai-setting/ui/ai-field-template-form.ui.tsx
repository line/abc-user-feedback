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

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { parseAsInteger, useQueryState } from 'nuqs';
import { FormProvider, useForm } from 'react-hook-form';
import { create } from 'zustand';

import {
  Button,
  Divider,
  InputCaption,
  InputField,
  InputLabel,
  Textarea,
  toast,
} from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  client,
  DeleteDialog,
  SelectInput,
  Slider,
  TextInput,
  useOAIMutation,
  useOAIQuery,
  useWarnIfUnsavedChanges,
} from '@/shared';
import { aiTemplateSchema } from '@/entities/ai';
import type { AITemplate } from '@/entities/ai';

import type { AISettingStore } from '../ai-setting-form.type';
import AiFieldPlayground from './ai-field-playground.ui';

const useAITemplateFormStore = create<AISettingStore>((set) => ({
  formId: 'ai-template-form',
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));

const defaultValues: Partial<AITemplate> = {
  temperature: 0.5,
  title: '',
  prompt: '',
};

export const AIFieldTemplateForm = ({ projectId }: { projectId: number }) => {
  const router = useRouter();
  const templateId = router.query.templateId ? +router.query.templateId : null;

  const methods = useForm<AITemplate>({
    defaultValues,
    resolver: zodResolver(aiTemplateSchema),
  });

  const { register, formState, setValue, watch, handleSubmit } = methods;

  const { formId, setIsPending, setIsDirty } = useAITemplateFormStore();

  const { data: templateData, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/fieldTemplates',
    variables: { projectId },
  });

  const { data: integrationData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
    queryOptions: { enabled: !!templateId },
  });

  const { data: modelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations/models',
    variables: { projectId },
  });

  const { mutate: createTemplate, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/fieldTemplates/new',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess(data) {
        toast.success('AI 설정이 저장되었습니다.');
        await router.push({
          pathname: router.pathname,
          query: { ...router.query, templateId: data?.id },
        });
        await refetch();
      },
      onError(error) {
        toast.error(error.message);
      },
    },
  });

  const { mutate: updateTemplate } = useMutation({
    mutationFn: async (body: AITemplate & { templateId: number }) => {
      const { data } = await client.put({
        path: '/api/admin/projects/{projectId}/ai/fieldTemplates/{templateId}',
        pathParams: { projectId, templateId: body.templateId },
        body,
      });
      return data;
    },
    async onSuccess() {
      await refetch();
      toast.success('AI 설정이 저장되었습니다.');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending]);

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty]);

  useEffect(() => {
    if (!templateData) return;
    const original = templateData.find((v) => v.id === templateId);
    if (original) {
      methods.reset({
        ...defaultValues,
        ...original,
        temperature:
          integrationData?.provider === 'GEMINI' ?
            original.temperature / 2
          : original.temperature,
      });
      return;
    }
    methods.reset({
      ...defaultValues,
      model:
        integrationData?.provider === 'GEMINI' ? 'gemini-2.5-flash' : 'gpt-4o',
    });
  }, [templateData, templateId, integrationData]);

  useWarnIfUnsavedChanges(
    methods.formState.isDirty,
    '/settings?menu=generative-ai&subMenu=field-template-form',
  );

  const onSubmit = (values: AITemplate) => {
    if (
      templateData?.some((v) => v.title === values.title && v.id !== templateId)
    ) {
      methods.setError('title', {
        type: 'manual',
        message: '이미 존재하는 템플릿 이름입니다.',
      });
      return;
    }
    const input = {
      ...values,
      temperature:
        integrationData?.provider === 'GEMINI' ?
          values.temperature * 2
        : values.temperature,
    };
    if (templateId) updateTemplate({ ...input, templateId });
    else createTemplate(input);
  };

  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <FormProvider {...methods}>
        <Card className="flex-[1] overflow-auto border" size="md">
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
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInput
                label="Title"
                {...register('title')}
                required
                error={formState.errors.title?.message}
              />
              <InputField>
                <InputLabel>
                  Prompt <span className="text-tint-red">*</span>
                </InputLabel>
                <Textarea {...register('prompt')} />
                {formState.errors.prompt?.message && (
                  <InputCaption variant="error">
                    {formState.errors.prompt.message}
                  </InputCaption>
                )}
              </InputField>
              <Divider variant="subtle" />
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-title-h4">Advanced Configuration</h4>
                  <p className="text-small-normal text-neutral-secondary">
                    description
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <SelectInput
                    options={
                      modelData?.models.map(({ id }) => ({
                        value: id,
                        label: id,
                      })) ?? []
                    }
                    label="Model"
                    placeholder="Select a model"
                    onChange={(value) => {
                      if (!value) return;
                      setValue('model', value, { shouldDirty: true });
                    }}
                    value={watch('model')}
                    error={formState.errors.model?.message}
                  />
                  <InputField>
                    <InputLabel>Temperature</InputLabel>
                    <div className="border-neutral-tertiary rounded-8 flex gap-4 border p-6">
                      <div>Precise</div>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[watch('temperature')]}
                        onValueChange={(value) => {
                          setValue('temperature', value[0] ?? 0, {
                            shouldDirty: true,
                          });
                        }}
                      />
                      <div>Creative</div>
                    </div>
                  </InputField>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
        <AiFieldPlayground projectId={projectId} />
      </FormProvider>
    </div>
  );
};

export const AITemplateFormButton = ({ projectId }: { projectId: number }) => {
  const { formId, isPending, isDirty } = useAITemplateFormStore();
  const [templateId] = useQueryState('templateId', parseAsInteger);
  const overlay = useOverlay();
  const router = useRouter();

  const { mutate: deleteTemplate } = useMutation({
    mutationFn: async (body: { templateId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/ai/fieldTemplates/{templateId}',
        pathParams: { projectId, templateId: body.templateId },
      });
      return data;
    },
    onSuccess() {
      router.back();
      toast.success('AI 설정이 저장되었습니다.');
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const openDeleteTemplateConfirm = () => {
    if (!templateId) return;
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => {
          deleteTemplate({ templateId });
        }}
      />
    ));
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="!text-tint-red"
        onClick={openDeleteTemplateConfirm}
        disabled={!templateId}
      >
        Template 삭제
      </Button>
      <Button
        form={formId}
        type="submit"
        loading={isPending}
        disabled={!isDirty}
      >
        저장
      </Button>
    </div>
  );
};
