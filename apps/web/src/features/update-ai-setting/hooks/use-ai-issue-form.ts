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
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';

import { toast } from '@ufb/react';

import {
  client,
  useOAIMutation,
  useOAIQuery,
  useWarnIfUnsavedChanges,
} from '@/shared';
import { aiIssueSchema } from '@/entities/ai';
import type { AIIssue } from '@/entities/ai';

import { AI_ISSUE_DEFAULT_VALUES, PROVIDER_MODEL_CONFIG } from '../constants';
import { useAIIssueFormStore } from '../stores/ai-issue-form.store';

export const useAIIssueForm = (projectId: number) => {
  const { t } = useTranslation();
  const router = useRouter();
  const templateId = router.query.templateId ? +router.query.templateId : null;
  const { setIsPending, setIsDirty } = useAIIssueFormStore();

  const methods = useForm<AIIssue>({
    defaultValues: AI_ISSUE_DEFAULT_VALUES,
    resolver: zodResolver(aiIssueSchema),
  });

  const { formState } = methods;

  const { data: channelData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels',
    variables: { projectId },
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
        toast.success(t('v2.toast.success'));
        await router.replace({
          pathname: router.pathname,
          query: { ...router.query, templateId: data?.id },
        });
        await refetch();
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
      toast.success(t('v2.toast.success'));
      await refetch();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const { mutate: deleteTemplate } = useMutation({
    mutationFn: async (body: { templateId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/ai/issueTemplates/{templateId}',
        pathParams: { projectId, templateId: body.templateId },
      });
      return data;
    },
    onSuccess() {
      toast.success(t('v2.toast.success'));
      router.back();
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    setIsPending(isPending);
  }, [isPending, setIsPending]);

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty, setIsDirty]);

  const model = methods.watch('model');
  useEffect(() => {
    if (!modelData) return;
    if (!modelData.models.some((m) => m.id === model)) {
      methods.setError('model', {
        type: 'manual',
        message: 'Model is not available',
      });
    } else {
      methods.clearErrors('model');
    }
  }, [modelData, model]);

  useEffect(() => {
    if (!templateData) return;

    const original = templateData.find((v) => v.id === templateId);
    if (original) {
      methods.reset({
        ...AI_ISSUE_DEFAULT_VALUES,
        ...original,
      } as AIIssue);
      if (!modelData?.models.some((model) => model.id === original.model)) {
        methods.setError('model', {
          type: 'manual',
          message: 'Model is not available',
        });
      }

      return;
    }

    const defaultModel =
      integrationData?.provider === 'GEMINI' ?
        PROVIDER_MODEL_CONFIG.GEMINI.defaultModel
      : PROVIDER_MODEL_CONFIG.DEFAULT.defaultModel;

    methods.reset({
      ...AI_ISSUE_DEFAULT_VALUES,
      model: defaultModel,
    });
  }, [templateData, templateId, integrationData, methods]);

  useWarnIfUnsavedChanges(
    methods.formState.isDirty,
    '/settings?menu=generative-ai&subMenu=ai-issue-form',
  );
  const handleFormSubmit = (values: AIIssue) => {
    if (
      templateData?.some(
        (v) => v.channelId === values.channelId && v.id !== templateId,
      )
    ) {
      methods.setError('channelId', {
        type: 'manual',
        message: 'A channel with this ID already exists.',
      });
      return;
    }
    if (!modelData?.models.some((model) => model.id === values.model)) {
      methods.setError('model', {
        type: 'manual',
        message: 'Model is not available',
      });
      return;
    }

    if (templateId) updateTemplate({ ...values, templateId });
    else createTemplate(values);
  };

  return {
    channelData,
    templateData,
    integrationData,
    modelData,
    templateId,
    refetch,
    methods,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    handleFormSubmit,
  };
};
