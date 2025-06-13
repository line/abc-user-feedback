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
import { FormProvider, useForm } from 'react-hook-form';
import { create } from 'zustand';

import { Button, toast } from '@ufb/react';

import { HelpCardDocs, SettingAlert, useOAIMutation } from '@/shared';
import { AiSettingForm } from '@/entities/ai';
import type { AI } from '@/entities/ai';

import type { AISettingStore } from '../ai-setting-form.type';

const useAISettingFormStore = create<AISettingStore>((set) => ({
  isPending: false,
  formId: 'ai-setting-form',
  setIsPending: (isPending) => set({ isPending }),
  setFormState: (formState) => set({ formState }),
}));

export const AISettingForm = ({ projectId }: { projectId: number }) => {
  const methods = useForm<AI>();
  const { setIsPending, formId, setFormState } = useAISettingFormStore();

  const { mutate, isPending } = useOAIMutation({
    method: 'put',
    path: '/api/admin/projects/{projectId}/ai/integrations',
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
    setFormState(methods.formState);
  }, [methods.formState]);

  return (
    <>
      <SettingAlert
        description={<HelpCardDocs i18nKey="help-card.api-key" />}
      />
      <FormProvider {...methods}>
        <form
          id={formId}
          onSubmit={methods.handleSubmit((data) => {
            mutate(data);
          })}
        >
          <AiSettingForm />
        </form>
      </FormProvider>
    </>
  );
};

export const AISettingFormButton = () => {
  const { formId, isPending, formState } = useAISettingFormStore();
  return (
    <Button
      form={formId}
      type="submit"
      disabled={!formState?.isDirty}
      loading={isPending}
    >
      저장
    </Button>
  );
};
