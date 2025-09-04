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

import { Badge } from '@ufb/react';

import { DescriptionTooltip } from '@/shared';
import { useUserSearch } from '@/entities/user';
import { useAuth } from '@/features/auth';

interface Props {
  email: string;
}

const MemberNameCell = (props: Props) => {
  const { email } = props;
  const { t } = useTranslation();
  const { data, isLoading } = useUserSearch({
    queries: [{ key: 'email', value: email, condition: 'IS' }],
  });
  const { user } = useAuth();

  return data || isLoading ?
      <div className="flex items-center gap-1">
        {email}
        {email === user?.email && <Badge variant="outline">You</Badge>}
      </div>
    : <div className="flex items-center gap-1">
        <span className="text-tint-red">{email}</span>
        <DescriptionTooltip
          color="red"
          description={t('main.create-project.error-member')}
        />
      </div>;
};

export default MemberNameCell;
