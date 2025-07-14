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

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { toast } from '@ufb/react';

import { client, useOAIMutation, useOAIQuery } from '@/shared';
import { aiTemplateSchema } from '@/entities/ai';
import type { AITemplate } from '@/entities/ai';

import {
  AI_TEMPLATE_DEFAULT_VALUES,
  PROVIDER_MODEL_CONFIG,
} from '../constants';
import { useAITemplateFormStore } from '../stores/ai-template-form.store';

export const useAITemplateForm = (projectId: number) => {
  const router = useRouter();
  const templateId = router.query.templateId ? +router.query.templateId : null;
  const { setIsPending, setIsDirty } = useAITemplateFormStore();

  const methods = useForm<AITemplate>({
    defaultValues: AI_TEMPLATE_DEFAULT_VALUES,
    resolver: zodResolver(aiTemplateSchema),
  });

  const { formState } = methods;

  // Data fetching
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

  // Mutations
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

  // Effects
  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty, setIsDirty]);

  useEffect(() => {
    if (!templateData) return;

    const original = templateData.find((v) => v.id === templateId);
    if (original) {
      const temperatureMultiplier =
        integrationData?.provider === 'GEMINI' ?
          PROVIDER_MODEL_CONFIG.GEMINI.temperatureMultiplier
        : PROVIDER_MODEL_CONFIG.DEFAULT.temperatureMultiplier;

      methods.reset({
        ...AI_TEMPLATE_DEFAULT_VALUES,
        ...original,
        temperature:
          integrationData?.provider === 'GEMINI' ?
            original.temperature / temperatureMultiplier
          : original.temperature,
      });
      return;
    }

    const defaultModel =
      integrationData?.provider === 'GEMINI' ?
        PROVIDER_MODEL_CONFIG.GEMINI.defaultModel
      : PROVIDER_MODEL_CONFIG.DEFAULT.defaultModel;

    methods.reset({
      ...AI_TEMPLATE_DEFAULT_VALUES,
      model: defaultModel,
    });
  }, [templateData, templateId, integrationData, methods]);

  // Submit handler
  const handleFormSubmit = (values: AITemplate) => {
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
          values.temperature *
          PROVIDER_MODEL_CONFIG.GEMINI.temperatureMultiplier
        : values.temperature,
    };

    if (templateId) {
      updateTemplate({ ...input, templateId });
    } else {
      createTemplate(input);
    }
  };

  return {
    methods,
    templateId,
    templateData,
    integrationData,
    modelData,
    handleFormSubmit,
    refetch,
  };
};
