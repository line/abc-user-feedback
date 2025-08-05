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
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { create } from 'zustand';

import { Button, toast } from '@ufb/react';

import {
  SettingAlert,
  useOAIMutation,
  useOAIQuery,
  usePermissions,
  useWarnIfUnsavedChanges,
} from '@/shared';
import { aiSchema, AiSettingForm } from '@/entities/ai';
import type { AI } from '@/entities/ai';

import type { AISettingStore } from '../ai-setting-form.type';

const useAISettingFormStore = create<AISettingStore>((set) => ({
  formId: 'ai-setting-form',
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
}));

export const AISettingForm = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const methods = useForm<AI>({
    resolver: zodResolver(aiSchema),
    defaultValues: {
      provider: 'OPEN_AI',
      endpointUrl: '',
      systemPrompt: '',
      notificationThreshold: null,
      tokenThreshold: null,
    },
  });

  const { formId, setIsPending, setIsDirty } = useAISettingFormStore();
  const queryClient = useQueryClient();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
    queryOptions: { retry: 0 },
  });

  const { mutateAsync: validateApiKey, isPending: isValidatingApiKey } =
    useOAIMutation({
      method: 'post',
      path: '/api/admin/projects/{projectId}/ai/validate',
      pathParams: { projectId },
    });

  const { mutateAsync: update, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/ai/integrations',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        await queryClient.invalidateQueries({
          queryKey: [
            '/api/admin/projects/{projectId}/ai/integrations',
            { projectId },
          ],
        });
        toast.success(t('v2.toast.success'));
      },
    },
  });

  useEffect(() => {
    setIsPending(isPending || isValidatingApiKey);
  }, [isPending, isValidatingApiKey]);

  useEffect(() => {
    setIsDirty(methods.formState.isDirty);
  }, [methods.formState.isDirty]);

  useEffect(() => {
    if (data) methods.reset(data);
  }, [data]);

  const onSubmit = async (values: AI) => {
    const data = await validateApiKey(values);
    if (!data?.valid) {
      toast.error(data?.error);
      return;
    }
    await update(values);
  };

  useWarnIfUnsavedChanges(methods.formState.isDirty);

  return (
    <>
      <SettingAlert description={t('help-card.ai-setting')} />
      <FormProvider {...methods}>
        <form id={formId} onSubmit={methods.handleSubmit(onSubmit)}>
          <AiSettingForm />
        </form>
      </FormProvider>
    </>
  );
};

export const AISettingFormButton = () => {
  const { t } = useTranslation();

  const { formId, isPending, isDirty } = useAISettingFormStore();
  const perms = usePermissions();
  return (
    <Button
      form={formId}
      type="submit"
      loading={isPending}
      disabled={!isDirty || !perms.includes('project_genai_update')}
    >
      {t('v2.button.save')}
    </Button>
  );
};
