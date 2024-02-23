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

import { TextInput } from '@ufb/ui';

import { SelectBox } from '@/components';
import { CreateSectionTemplate } from '@/components/templates';
import { useOAIQuery } from '@/hooks';

interface IProps {
  projectId: number;
}

const IssueTrackerSection: React.FC<IProps> = ({ projectId }) => {
  const { t } = useTranslation();
  const { data } = useOAIQuery({
    path: '/api/admin/projects/{projectId}/issue-tracker',
    variables: { projectId },
  });
  return (
    <CreateSectionTemplate title={t('project-setting-menu.issue-tracker-mgmt')}>
      <SelectBox
        options={[{ value: 'jira', label: 'JIRA' }]}
        value={{ value: 'jira', label: 'JIRA' }}
        label="Issue Tracking System"
        isDisabled
      />
      <TextInput
        label="Base URL"
        placeholder="example.com"
        value={data?.data.ticketDomain}
        disabled
      />
      <TextInput
        label="Project Key"
        placeholder="PROJECT"
        value={data?.data.ticketKey}
        disabled
      />
      <TextInput
        label="Ticket URL"
        value={`${data?.data.ticketDomain}/browse/${data?.data.ticketDomain}-{Number}`}
        disabled
      />
    </CreateSectionTemplate>
  );
};

export default IssueTrackerSection;
