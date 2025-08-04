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

import { useTranslation } from 'next-i18next';
import { FormProvider } from 'react-hook-form';

import { Button, Divider, FormField, InputField, Label } from '@ufb/react';

import {
  CardDescription,
  CardTitle,
  Slider,
  usePermissions,
  useWarnIfUnsavedChanges,
} from '@/shared';
import { FormInput, FormSelect, FormTextarea } from '@/shared/ui/form-inputs';

import { TEMPERATURE_CONFIG } from '../constants';
import { useAITemplateDelete } from '../hooks/use-ai-template-deletion';
import { useAITemplateForm } from '../hooks/use-ai-template-form';
import { useAITemplateTest } from '../hooks/use-ai-template-test';
import { useAITemplateFormStore } from '../stores/ai-template-form.store';
import AiFormTemplate from './ai-form-template.ui';
import AiPlaygroundTemplate from './ai-playground-template.ui';

export const AIFieldTemplateForm = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const { methods, modelData, handleFormSubmit } = useAITemplateForm(projectId);

  const { setValue, watch, handleSubmit } = methods;
  const { formId } = useAITemplateFormStore();

  useWarnIfUnsavedChanges(
    methods.formState.isDirty,
    '/settings?menu=generative-ai&subMenu=field-template-form',
  );

  return (
    <AiFormTemplate
      methods={methods}
      description={t('v2.description.ai-field-template-form')}
      playground={<AIFieldPlayground projectId={projectId} />}
    >
      <FormProvider {...methods}>
        <form
          id={formId}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <FormField
            control={methods.control}
            name="title"
            render={({ field }) => (
              <FormInput
                label="Title"
                {...field}
                placeholder={t('v2.placeholder.text')}
                required
              />
            )}
          />
          <FormField
            control={methods.control}
            name="prompt"
            render={({ field }) => (
              <FormTextarea
                label="Prompt"
                placeholder={t('v2.placeholder.ai-field-template-prompt')}
                {...field}
                required
              />
            )}
          />
          <Divider variant="subtle" />
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle size="lg">Advanced Configuration</CardTitle>
              <CardDescription>
                {t('v2.description.ai-field-template-advanced-configuration')}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={methods.control}
                name="model"
                render={({ field }) => (
                  <FormSelect
                    options={
                      modelData?.models.map(({ id }) => ({
                        value: id,
                        label: id,
                      })) ?? []
                    }
                    label="Model"
                    placeholder="Select a model"
                    {...field}
                  />
                )}
              />
              <InputField>
                <Label>Temperature</Label>
                <div className="border-neutral-tertiary rounded-8 flex gap-4 border p-6">
                  <div>Precise</div>
                  <Slider
                    min={TEMPERATURE_CONFIG.min}
                    max={TEMPERATURE_CONFIG.max}
                    step={TEMPERATURE_CONFIG.step}
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
      </FormProvider>
    </AiFormTemplate>
  );
};

const AIFieldPlayground = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const aiTest = useAITemplateTest(projectId);
  return (
    <AiPlaygroundTemplate
      description={t('v2.description.ai-field-template-playground')}
      onTestAI={aiTest.executeTest}
      result={aiTest.result}
      isPending={aiTest.isPending}
      isDisabled={aiTest.isTestDisabled}
    />
  );
};

export const AITemplateFormButton = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const { formId, isPending, isDirty } = useAITemplateFormStore();
  const {
    templateId,
    isPending: isDeletePending,
    openDeleteConfirmDialog,
  } = useAITemplateDelete(projectId);
  const perms = usePermissions(projectId);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="!text-tint-red"
        onClick={openDeleteConfirmDialog}
        disabled={!templateId || !perms.includes('project_genai_update')}
        loading={isDeletePending}
      >
        {t('v2.button.name.delete', { name: 'Template' })}
      </Button>
      <Button
        form={formId}
        type="submit"
        loading={isPending}
        disabled={!isDirty || !perms.includes('project_genai_update')}
      >
        {t('v2.button.save')}
      </Button>
    </div>
  );
};
