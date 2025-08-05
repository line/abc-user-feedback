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

import { Button, Divider } from '@ufb/react';

import {
  CardDescription,
  CardTitle,
  useOAIQuery,
  usePermissions,
} from '@/shared';

import { useAIIssueDelete } from '../hooks/use-ai-issue-delete';
import { useAIIssueForm } from '../hooks/use-ai-issue-form';
import { useAIIssueTest } from '../hooks/use-ai-issue-test';
import { useAIIssueFormStore } from '../stores/ai-issue-form.store';
import AiFormTemplate from './ai-form-template.ui';
import {
  ChannelSelect,
  DataReferenceSlider,
  EnableTemplateCard,
  FieldSelect,
  ModelSelect,
  PromptField,
  TemperatureSlider,
} from './ai-issue-form-fields.ui';
import AiPlaygroundTemplate from './ai-playground-template.ui';

export const AIIssueForm = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();
  const { channelData, modelData, methods, handleFormSubmit } =
    useAIIssueForm(projectId);
  const { formId } = useAIIssueFormStore();
  const { watch, handleSubmit } = methods;

  const { data: channelDetailData } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/channels/{channelId}',
    variables: { projectId, channelId: watch('channelId') },
    queryOptions: { enabled: !!watch('channelId') },
  });

  return (
    <AiFormTemplate
      methods={methods}
      description={t('v2.description.ai-issue-recommendation-form')}
      playground={<AIIssuePlayground />}
    >
      <form
        id={formId}
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <ChannelSelect channels={channelData?.items} />
        <FieldSelect fields={channelDetailData?.fields} />
        <PromptField />
        <EnableTemplateCard />
        <Divider variant="subtle" />
        <div className="flex flex-col gap-4">
          <div>
            <CardTitle size="lg">Advanced Configuration</CardTitle>
            <CardDescription>
              {t(
                'v2.description.ai-issue-recommendation-advanced-configuration',
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3">
            <ModelSelect models={modelData?.models} />
            <TemperatureSlider />
            <DataReferenceSlider />
          </div>
        </div>
      </form>
    </AiFormTemplate>
  );
};

const AIIssuePlayground = () => {
  const { t } = useTranslation();
  const aiTest = useAIIssueTest();

  return (
    <AiPlaygroundTemplate
      description={t('v2.description.ai-issue-recommendation-playground')}
      onTestAI={aiTest.executeTest}
      result={aiTest.result}
      isPending={aiTest.isPending}
      isDisabled={aiTest.isTestDisabled}
    />
  );
};

export const AIIssueFormButton = ({ projectId }: { projectId: number }) => {
  const { t } = useTranslation();

  const { formId, isPending, isDirty } = useAIIssueFormStore();
  const {
    isPending: isDeletePending,
    openDeleteTemplateConfirm,
    templateId,
  } = useAIIssueDelete(projectId);
  const perms = usePermissions(projectId);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="!text-tint-red"
        onClick={openDeleteTemplateConfirm}
        disabled={!templateId || !perms.includes('project_genai_update')}
        loading={isDeletePending}
      >
        {t('v2.button.delete')}
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
