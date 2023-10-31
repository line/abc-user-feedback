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
import { useCallback, useMemo } from 'react';

import { TextInput } from '@ufb/ui';

import { SelectBox } from '@/components';
import { useCreateProject } from '@/contexts/create-project.context';
import type { IssueTrackerType } from '@/types/issue-tracker.type';
import CreateProjectInputTemplate from './CreateProjectInputTemplate';

interface IProps {}

const InputIssueTracker: React.FC<IProps> = () => {
  const { input, onChangeInput } = useCreateProject();

  const ticketDomain = useMemo(
    () => input.issueTracker.ticketDomain,
    [input.issueTracker.ticketDomain],
  );
  const ticketKey = useMemo(
    () => input.issueTracker.ticketKey,
    [input.issueTracker.ticketKey],
  );
  const onChangeIssueTracker = useCallback(
    <T extends keyof IssueTrackerType>(key: T, value: IssueTrackerType[T]) => {
      onChangeInput('issueTracker', { ticketDomain, ticketKey, [key]: value });
    },
    [input?.issueTracker],
  );

  return (
    <CreateProjectInputTemplate>
      <SelectBox
        options={[{ key: 'jira', name: 'JIRA' }]}
        value={{ key: 'jira', name: 'JIRA' }}
        label="Issue Tracking System"
      />
      <TextInput
        label="Base URL"
        placeholder="example.com"
        value={ticketDomain}
        onChange={(e) => onChangeIssueTracker('ticketDomain', e.target.value)}
      />
      <TextInput
        label="Project Key"
        placeholder="Delivery"
        value={ticketKey}
        onChange={(e) => onChangeIssueTracker('ticketKey', e.target.value)}
      />
      <TextInput
        label="Ticket URL"
        value={`${input.issueTracker.ticketDomain}/browse/${input.issueTracker.ticketKey}-{Number}`}
        disabled
      />
    </CreateProjectInputTemplate>
  );
};

export default InputIssueTracker;
