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

import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';

import { toast } from '@ufb/react';

import { useOAIMutation } from '@/shared';
import type { AIIssue } from '@/entities/ai';

import type { PlaygroundInputItem } from '../playground-input-item.schema';

export const useAIIssueTest = () => {
  const [result, setResult] = useState<string[] | undefined>();
  const { getValues, watch } = useFormContext<AIIssue>();
  const router = useRouter();
  const projectId = Number(router.query.projectId);

  const { mutateAsync, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/ai/issueRecommend/playground/test',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: (data) => {
        setResult(data?.result);
      },
    },
  });

  const executeTest = useCallback(
    (inputItems: PlaygroundInputItem[]) => {
      const {
        model,
        temperature,
        channelId,
        dataReferenceAmount,
        prompt,
        targetFieldKeys,
      } = getValues();

      toast.promise(
        mutateAsync({
          model,
          temperature,
          channelId,
          dataReferenceAmount,
          targetFieldKeys,
          templatePrompt: prompt,
          temporaryFields: inputItems,
        }),
        {
          success: () => '성공',
          loading: '로딩중',
        },
      );
    },
    [getValues, mutateAsync],
  );

  const isTestDisabled = watch('model') === '';

  return {
    result,
    isPending,
    executeTest,
    isTestDisabled,
  };
};
