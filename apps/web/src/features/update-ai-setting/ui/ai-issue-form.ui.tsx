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
  client,
  DeleteDialog,
  MultiSelectInput,
  SelectInput,
  Slider,
  useOAIMutation,
  useOAIQuery,
  useWarnIfUnsavedChanges,
} from '@/shared';
import { aiIssueSchema } from '@/entities/ai';
import type { AIIssue } from '@/entities/ai';

import type { AISettingStore } from '../ai-setting-form.type';
import AIIssuePlayground from './ai-issue-playground.ui';

const DEFAULT_FIELD_COLUMNS_KEYS = ['id', 'createdAt', 'updatedAt', 'issues'];

const useAIIssueFormStore = create<AISettingStore>((set) => ({
  formId: 'ai-issue-form',
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));

const defaultValues: Partial<AIIssue> = {
  temperature: 0.5,
  prompt: '',
  isEnabled: true,
  dataReferenceAmount: 3,
};

export const AIIssueForm = ({ projectId }: { projectId: number }) => {
  const router = useRouter();
  const templateId = router.query.templateId ? +router.query.templateId : null;

  const methods = useForm<AIIssue>({
    defaultValues,
    resolver: zodResolver(aiIssueSchema),
  });

  const { register, formState, setValue, watch, handleSubmit } = methods;

  const { formId, setIsPending, setIsDirty } = useAIIssueFormStore();

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
  });
  const { data: channelDetailData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { projectId, channelId: watch('channelId') },
    queryOptions: { enabled: !!watch('channelId') },
  });

  const { data: templateData, refetch } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/issueTemplates',
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
    path: '/api/admin/projects/{projectId}/ai/issueTemplates/new',
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
    mutationFn: async (body: AIIssue & { templateId: number }) => {
      const { data } = await client.put({
        path: '/api/admin/projects/{projectId}/ai/issueTemplates/{templateId}',
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
    '/settings?menu=generative-ai&subMenu=ai-issue-form',
  );

  const onSubmit = (values: AIIssue) => {
    if (
      templateData?.some(
        (v) => v.channelId === values.channelId && v.id !== templateId,
      )
    ) {
      methods.setError('channelId', {
        type: 'manual',
        message: '이미 존재하는 채널 ID입니다.',
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
              <SelectInput
                options={
                  channelData?.items.map(({ id, name }) => ({
                    value: String(id),
                    label: name,
                  })) ?? []
                }
                label="Channel"
                placeholder="Select a channel"
                onChange={(value) => {
                  if (!value) return;
                  setValue('channelId', +value, { shouldDirty: true });
                  setValue('targetFieldKeys', [], { shouldDirty: true });
                }}
                value={watch('channelId') ? String(watch('channelId')) : ''}
                error={formState.errors.channelId?.message}
                required
              />
              <MultiSelectInput
                options={
                  channelDetailData?.fields
                    .filter((v) => !DEFAULT_FIELD_COLUMNS_KEYS.includes(v.key))
                    .map(({ name, key }) => ({ value: key, label: name })) ?? []
                }
                label="Field"
                placeholder="Select a field"
                onChange={(value) => {
                  setValue('targetFieldKeys', value, { shouldDirty: true });
                }}
                value={watch('targetFieldKeys')}
                error={formState.errors.targetFieldKeys?.message}
                required
              />
              <InputField>
                <InputLabel>Prompt</InputLabel>
                <Textarea {...register('prompt')} />
                {formState.errors.prompt?.message && (
                  <InputCaption variant="error">
                    {formState.errors.prompt.message}
                  </InputCaption>
                )}
              </InputField>
              <Card size="sm">
                <CardHeader
                  action={
                    <Switch
                      checked={watch('isEnabled')}
                      onCheckedChange={(checked) =>
                        setValue('isEnabled', checked, { shouldDirty: true })
                      }
                    />
                  }
                >
                  <CardTitle>Enable Template</CardTitle>
                  <CardDescription>
                    AI 이슈 템플릿 사용여부를 설정합니다.
                  </CardDescription>
                </CardHeader>
              </Card>
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
                  <InputField>
                    <InputLabel>Data Reference Amount</InputLabel>
                    <div className="border-neutral-tertiary rounded-8 flex gap-4 border p-6">
                      <div>Low</div>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[watch('dataReferenceAmount')]}
                        onValueChange={(value) => {
                          setValue('dataReferenceAmount', value[0] ?? 3, {
                            shouldDirty: true,
                          });
                        }}
                      />
                      <div>High</div>
                    </div>
                  </InputField>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
        <AIIssuePlayground />
      </FormProvider>
    </div>
  );
};

export const AIIssueFormButton = ({ projectId }: { projectId: number }) => {
  const { formId, isPending, isDirty } = useAIIssueFormStore();
  const [templateId] = useQueryState('templateId', parseAsInteger);
  const overlay = useOverlay();
  const router = useRouter();

  const { mutate: deleteTemplate } = useMutation({
    mutationFn: async (body: { templateId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/ai/issueTemplates/{templateId}',
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
