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
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useOverlay } from '@toss/use-overlay';
import { useTranslation } from 'next-i18next';
import { parseAsInteger, useQueryState } from 'nuqs';

import { toast } from '@ufb/react';

import { client, DeleteDialog } from '@/shared';

interface UseAITemplateDeleteReturn {
  templateId: number | null;
  isPending: boolean;
  openDeleteConfirmDialog: () => void;
}

export const useAITemplateDelete = (
  projectId: number,
): UseAITemplateDeleteReturn => {
  const { t } = useTranslation();
  const router = useRouter();
  const overlay = useOverlay();
  const [templateId] = useQueryState('templateId', parseAsInteger);

  const { mutate: deleteTemplate, isPending } = useMutation({
    mutationFn: async (body: { templateId: number }) => {
      const { data } = await client.delete({
        path: '/api/admin/projects/{projectId}/ai/fieldTemplates/{templateId}',
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

  const openDeleteConfirmDialog = () => {
    if (!templateId) return;

    overlay.open(({ close, isOpen }) => {
      return (
        <DeleteDialog
          close={close}
          isOpen={isOpen}
          onClickDelete={() => {
            deleteTemplate({ templateId });
          }}
        />
      );
    });
  };

  return {
    templateId,
    isPending,
    openDeleteConfirmDialog,
  };
};
