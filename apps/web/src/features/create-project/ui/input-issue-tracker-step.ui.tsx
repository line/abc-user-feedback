/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { FormProvider, useForm } from 'react-hook-form';

import { IssueTrackerForm, issueTrackerSchema } from '@/entities/issue-tracker';
import type { IssueTracker } from '@/entities/issue-tracker';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputIssueTrackerStep: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProjectStore();

  const methods = useForm<IssueTracker>({
    resolver: zodResolver(issueTrackerSchema),
    defaultValues: input.issueTracker,
  });

  useEffect(() => {
    const subscription = methods.watch((values) => {
      const newValues = issueTrackerSchema.safeParse(values);
      if (!newValues.data) return;
      onChangeInput('issueTracker', newValues.data);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <CreateProjectInputTemplate
      validate={async () => {
        const isValid = await methods.trigger();
        methods.handleSubmit(() => {})();
        return isValid;
      }}
    >
      <FormProvider {...methods}>
        <IssueTrackerForm />
      </FormProvider>
    </CreateProjectInputTemplate>
  );
};

export default InputIssueTrackerStep;
