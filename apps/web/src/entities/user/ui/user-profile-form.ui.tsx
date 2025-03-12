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
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import { TextInput } from '@/shared';
import type { User, UserProfile } from '@/entities/user';

interface Props {
  user: User;
}

const UserProfileForm: React.FC<Props> = (props: Props) => {
  const { user } = props;
  const { t } = useTranslation();

  const { register, formState } = useFormContext<UserProfile>();

  return (
    <div className="flex flex-col gap-4">
      <TextInput label="Email" value={user.email} disabled />
      <TextInput label="Type" value={user.type} disabled />
      <TextInput
        label="Name"
        placeholder={t('v2.placeholder.text')}
        error={formState.errors.name?.message}
        {...register('name')}
      />
      <TextInput
        label="Department"
        placeholder={t('v2.placeholder.text')}
        error={formState.errors.department?.message}
        {...register('department')}
      />
    </div>
  );
};

export default UserProfileForm;
