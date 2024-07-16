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
import { randomBytes } from 'crypto';
import { useTranslation } from 'react-i18next';

import { ApiKeyTable } from '@/entities/api-key';

import { useCreateProjectStore } from '../create-project-model';
import CreateProjectInputTemplate from './create-project-input-template.ui';

interface IProps {}

const InputApiKeyStep: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProjectStore();

  const { t } = useTranslation();

  const createApiKey = () => {
    onChangeInput(
      'apiKeys',
      input.apiKeys.concat({
        id: (input.apiKeys[input.apiKeys.length - 1]?.id ?? 0) + 1,
        value: randomBytes(10).toString('hex').toUpperCase(),
        createdAt: new Date().toISOString(),
        deletedAt: null,
      }),
    );
  };

  const deleteApiKey = (id: number) => {
    onChangeInput(
      'apiKeys',
      input.apiKeys.filter((v) => v.id !== id),
    );
  };

  return (
    <CreateProjectInputTemplate
      actionButton={
        <button
          className="btn btn-primary btn-md min-w-[120px]"
          onClick={createApiKey}
        >
          {t('main.setting.button.create-api-key')}
        </button>
      }
    >
      <ApiKeyTable apiKeys={input.apiKeys} onClickDelete={deleteApiKey} />
    </CreateProjectInputTemplate>
  );
};

export default InputApiKeyStep;
