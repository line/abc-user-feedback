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
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { toast } from '@ufb/ui';

import { useOAIMutation, usePermissions } from '@/shared';

interface IProps {
  projectId: number;
}

const CreateApiKeyButton: React.FC<IProps> = (props) => {
  const { projectId } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const perms = usePermissions(projectId);

  const { mutate: createApiKey, isPending } = useOAIMutation({
    method: 'post',
    path: '/api/admin/projects/{projectId}/api-keys',
    pathParams: { projectId },
    queryOptions: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['/api/admin/projects/{projectId}/api-keys'],
        });
        toast.positive({ title: t('toast.add') });
      },
      onError(error) {
        toast.negative({ title: error.message });
      },
    },
  });

  return (
    <button
      className="btn btn-md btn-primary min-w-[120px]"
      disabled={!perms.includes('project_apikey_create') || isPending}
      onClick={() => createApiKey({ value: undefined })}
    >
      {t('main.setting.button.create-api-key')}
    </button>
  );
};

export default CreateApiKeyButton;
