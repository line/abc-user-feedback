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

import { useFormContext } from 'react-hook-form';

import { Icon, InputField, Label } from '@ufb/react';

import { cn, SelectInput, TextInput } from '@/shared';

import type { IssueTracker } from '../issue-tracker.type';

interface IProps {
  readOnly?: boolean;
}

const IssueTrackerForm: React.FC<IProps> = ({ readOnly }) => {
  const { register, watch, formState } = useFormContext<IssueTracker>();

  return (
    <div className="flex flex-col gap-4">
      <SelectInput
        options={[{ value: 'jira', label: 'Jira' }]}
        value="jira"
        label="Issue Tracking System"
        disabled={readOnly}
      />
      <TextInput
        label="Base URL"
        placeholder="https://example.com"
        error={formState.errors.ticketDomain?.message}
        {...register('ticketDomain')}
      />
      <TextInput
        label="Project Key"
        placeholder="PROJ"
        error={formState.errors.ticketKey?.message}
        disabled={readOnly}
        {...register('ticketKey')}
      />
      <InputField>
        <Label>Preview</Label>
        <div
          className={cn(
            'bg-neutral-tertiary flex items-center gap-2 rounded p-4',
            { 'opacity-50': !watch('ticketDomain') || !watch('ticketKey') },
          )}
        >
          <Icon name="RiPriceTag3Fill" size={16} />
          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
          {`${watch('ticketDomain') || 'https://example.com'}/browse/${watch('ticketKey') || 'PROJ'}-{Number}`}
        </div>
      </InputField>
    </div>
  );
};

export default IssueTrackerForm;
