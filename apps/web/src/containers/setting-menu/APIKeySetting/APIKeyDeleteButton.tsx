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
import { useTranslation } from 'react-i18next';

import { Icon, toast } from '@ufb/ui';

import { useOAIMutation } from '@/shared';

interface IProps {
  apiKeyId: number;
  projectId: number;
  refetch: () => void;
  disabled: boolean;
}

const APIKeyDeleteButton: React.FC<IProps> = (props) => {
  const { projectId, refetch, apiKeyId, disabled } = props;
  const { t } = useTranslation();

  const { mutate: deleteAPiKey, isPending } = useOAIMutation({
    method: 'delete',
    path: '/api/admin/projects/{projectId}/api-keys/{apiKeyId}',
    pathParams: { projectId, apiKeyId },
    queryOptions: {
      async onSuccess() {
        await refetch();
        toast.negative({ title: t('toast.delete') });
      },
      onError(error) {
        toast.negative({ title: error?.message ?? 'Error' });
      },
    },
  });
  return (
    <button
      className="icon-btn icon-btn-tertiary icon-btn-sm"
      onClick={() => deleteAPiKey(undefined)}
      disabled={disabled || isPending}
    >
      <Icon name="TrashFill" />
    </button>
  );
};

export default APIKeyDeleteButton;
