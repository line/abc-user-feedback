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
import { FormProvider, useForm } from 'react-hook-form';
import { create } from 'zustand';

import { Button, toast } from '@ufb/react';

import {
  client,
  HelpCardDocs,
  SettingAlert,
  useOAIMutation,
  useOAIQuery,
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
  const methods = useForm<AI>({
    resolver: zodResolver(aiSchema),
    defaultValues: {
      endpointUrl: '',
      systemPrompt: '',
    },
  });

  const { formId, setIsPending, setIsDirty } = useAISettingFormStore();
  const queryClient = useQueryClient();

  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/ai/integrations',
    variables: { projectId },
  });

  const { mutateAsync: validateApiKey } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/validate',
  });

  const { mutateAsync: update, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/ai/integrations',
    pathParams: { projectId },
    queryOptions: {
      async onSuccess() {
        if (!data?.apiKey) {
          await client.post({
            path: '/api/admin/projects/{projectId}/ai/templates/default',
            pathParams: { projectId },
          });
        }
        await queryClient.invalidateQueries({
          queryKey: [
            '/api/admin/projects/{projectId}/ai/integrations',
            { projectId },
          ],
        });
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
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <FormProvider {...methods}>
        <form id={formId} onSubmit={methods.handleSubmit(onSubmit)}>
          <AiSettingForm />
        </form>
      </FormProvider>
    </>
  );
};

export const AISettingFormButton = () => {
  const { formId, isPending, isDirty } = useAISettingFormStore();
  return (
    <Button form={formId} type="submit" loading={isPending} disabled={!isDirty}>
      저장
    </Button>
  );
};
