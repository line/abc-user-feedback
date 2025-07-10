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

import React from 'react';
import { FormProvider } from 'react-hook-form';

import { Button, Divider } from '@ufb/react';

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  useOAIQuery,
} from '@/shared';

import { useAIIssueDelete } from '../hooks/use-ai-issue-delete';
import { useAIIssueForm } from '../hooks/use-ai-issue-form';
import { useAIIssueFormStore } from '../stores/ai-issue-form.store';
import {
  ChannelSelect,
  DataReferenceSlider,
  EnableTemplateCard,
  FieldSelect,
  ModelSelect,
  PromptField,
  TemperatureSlider,
} from './ai-issue-form-fields.ui';
import AIIssuePlayground from './ai-issue-playground.ui';

export const AIIssueForm = ({ projectId }: { projectId: number }) => {
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
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <ChannelSelect channels={channelData?.items} />
              <FieldSelect fields={channelDetailData?.fields} />
              <PromptField />
              <EnableTemplateCard />
              <Divider variant="subtle" />
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-title-h4">Advanced Configuration</h4>
                  <p className="text-small-normal text-neutral-secondary">
                    description
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <ModelSelect models={modelData?.models} />
                  <TemperatureSlider />
                  <DataReferenceSlider />
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
  const {
    isPending: isDeletePending,
    openDeleteTemplateConfirm,
    templateId,
  } = useAIIssueDelete(projectId);
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="!text-tint-red"
        onClick={openDeleteTemplateConfirm}
        disabled={!templateId}
        loading={isDeletePending}
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
