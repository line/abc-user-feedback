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

import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { parseAsInteger, useQueryState } from 'nuqs';

import { toast } from '@ufb/react';

import { client, DeleteDialog } from '@/shared';

export const useAIIssueDelete = (projectId: number) => {
  const { t } = useTranslation();
  const [templateId] = useQueryState('templateId', parseAsInteger);
  const overlay = useOverlay();
  const router = useRouter();

  const { mutate: deleteTemplate, isPending } = useMutation({
    mutationFn: async (body: { templateId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/ai/issueTemplates/{templateId}',
        pathParams: { projectId, templateId: body.templateId },
      });
      return data;
    },
    onSuccess() {
      router.back();
      toast.success(t('v2.toast.success'));
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const openDeleteTemplateConfirm = () => {
    if (!templateId) return;
    overlay.open(({ close, isOpen }) => (
      <DeleteDialog
        close={close}
        isOpen={isOpen}
        onClickDelete={() => {
          deleteTemplate({ templateId });
        }}
      />
    ));
  };
  return {
    templateId,
    openDeleteTemplateConfirm,
    isPending,
  };
};
